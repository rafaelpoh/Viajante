const admin = require('firebase-admin');

// Inicializa o Firebase Admin SDK se ainda não foi inicializado
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Falha ao inicializar Firebase Admin SDK. Certifique-se de configurar a variável de ambiente FIREBASE_SERVICE_ACCOUNT.');
  }
}

const db = admin.apps.length ? admin.firestore() : null;

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(455).json({ message: 'Método não permitido. Utilize POST.' });
  }

  // 1. Validar Token de Autenticação do Usuário
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Não autorizado. Token ausente.' });
  }

  const idToken = authHeader.split('Bearer ')[1];
  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (error) {
    console.error('Erro ao verificar ID Token:', error);
    return res.status(401).json({ message: 'Sessão inválida ou expirada. Faça login novamente.' });
  }

  const userId = decodedToken.uid;
  const userEmail = decodedToken.email;

  // 2. Extrair dados do corpo da requisição
  const { destino, periodo_viagem, motivo_viagem } = req.body;
  if (!destino || !periodo_viagem || !motivo_viagem) {
    return res.status(400).json({ message: 'Os campos destino, periodo_viagem e motivo_viagem são obrigatórios.' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ message: 'Configuração do servidor incompleta (GEMINI_API_KEY ausente).' });
  }

  if (!db) {
    return res.status(500).json({ message: 'Serviço de banco de dados indisponível no momento.' });
  }

  try {
    // 3. Montar prompt estruturado para o Gemini
    const prompt = `Crie um itinerário de viagem super detalhado para o destino: "${destino}". 
Período da viagem: "${periodo_viagem}". 
Perfil/Motivo da viagem: "${motivo_viagem}". 

Você deve responder APENAS com um objeto JSON válido (sem markdown, sem tags \`\`\`json, apenas o texto bruto do JSON) seguindo a estrutura exata abaixo:
{
  "destino": "${destino}",
  "periodo": "${periodo_viagem}",
  "motivo": "${motivo_viagem}",
  "resumo": "Um breve texto de introdução motivador sobre o destino.",
  "dicas_gerais": ["Dica 1", "Dica 2", "Dica 3"],
  "itinerario": [
    {
      "dia": 1,
      "titulo": "Título para o dia 1",
      "atividades": [
        "Atividade da manhã",
        "Atividade da tarde",
        "Atividade da noite"
      ]
    }
  ]
}`;

    // 4. Chamar a API do Gemini via HTTPS (método simples, rápido e sem dependências extras)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Erro na API do Gemini: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    
    // Extrai o texto gerado
    let responseText = geminiData.candidates[0].content.parts[0].text;
    
    // Limpa possíveis marcações de código markdown do JSON caso a IA tenha incluído por acidente
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Converte o texto da IA para objeto JSON
    let planoEstruturado;
    try {
      planoEstruturado = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Erro de Parse do JSON retornado pelo Gemini:', responseText);
      throw new Error('O gerador de itinerários retornou um formato inválido. Tente novamente.');
    }

    // 5. Salvar o plano no Firestore
    const newDocRef = db.collection('viagens').doc();
    const planoSalvar = {
      id: newDocRef.id,
      userId: userId,
      userEmail: userEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...planoEstruturado
    };

    await newDocRef.set(planoSalvar);

    // Retorna o plano gerado e persistido
    return res.status(200).json(planoSalvar);

  } catch (error) {
    console.error('Erro ao processar plano de viagem:', error);
    return res.status(500).json({ message: error.message || 'Erro interno ao gerar plano de viagem.' });
  }
};
