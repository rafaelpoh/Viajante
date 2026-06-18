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

/**
 * Busca dados reais de geolocalização, clima e dados do país.
 * @param {string} destino 
 * @returns {Promise<Object|null>}
 */
async function getGeocodingAndWeatherAndCountry(destino) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    console.warn('OPENWEATHER_API_KEY não configurada. Clima e dados geográficos serão omitidos.');
    return null;
  }

  try {
    // 1. Geocodificação para obter lat, lon e código do país
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destino)}&limit=1&appid=${apiKey}`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) return null;
    const geoData = await geoRes.json();
    if (!geoData || geoData.length === 0) return null;

    const { lat, lon, country: countryCode } = geoData[0];

    // 2. Buscar dados de clima em tempo real
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = weatherRes.ok ? await weatherRes.json() : null;

    // 3. Buscar dados do país (Moeda, Tradução do Nome, etc.)
    const countryUrl = `https://restcountries.com/v3.1/alpha/${countryCode}`;
    const countryRes = await fetch(countryUrl);
    const countryData = countryRes.ok ? await countryRes.json() : null;

    let moeda = { nome: "Desconhecida", simbolo: "", codigo: "" };
    if (countryData && countryData[0] && countryData[0].currencies) {
      const currencyKeys = Object.keys(countryData[0].currencies);
      if (currencyKeys.length > 0) {
        const cur = countryData[0].currencies[currencyKeys[0]];
        moeda = { nome: cur.name, simbolo: cur.symbol || "", codigo: currencyKeys[0] };
      }
    }

    return {
      lat,
      lon,
      clima: weatherData ? {
        temp: Math.round(weatherData.main.temp),
        descricao: weatherData.weather[0].description,
        umidade: weatherData.main.humidity
      } : null,
      moeda,
      pais: countryData && countryData[0] && countryData[0].translations && countryData[0].translations.por ? countryData[0].translations.por.common : countryCode
    };

  } catch (error) {
    console.error('Erro ao buscar APIs de clima/geografia:', error);
    return null;
  }
}

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
    // 3. Buscar dados de clima e moeda reais antes de chamar o Gemini
    const extraInfo = await getGeocodingAndWeatherAndCountry(destino);
    let contextualDetails = '';
    if (extraInfo) {
      contextualDetails = `DADOS REAIS E GEOGRÁFICOS DO DESTINO:
- País: ${extraInfo.pais}
- Moeda Local: ${extraInfo.moeda.nome} (Código: ${extraInfo.moeda.codigo}, Símbolo: ${extraInfo.moeda.simbolo})
${extraInfo.clima ? `- Clima atual estimado: ${extraInfo.clima.temp}°C, ${extraInfo.clima.descricao} (Umidade: ${extraInfo.clima.umidade}%)` : ''}

Use estes dados para preencher as seções correspondentes de clima e finanças abaixo.`;
    }

    // 4. Montar prompt estruturado para o Gemini
    const prompt = `Crie um itinerário de viagem super detalhado para o destino: "${destino}". 
Período da viagem: "${periodo_viagem}". 
Perfil/Motivo da viagem: "${motivo_viagem}". 

${contextualDetails}

Você deve responder APENAS com um objeto JSON válido (sem markdown, sem tags \`\`\`json, apenas o texto bruto do JSON) seguindo a estrutura exata abaixo:
{
  "destino": "${destino}",
  "periodo": "${periodo_viagem}",
  "motivo": "${motivo_viagem}",
  "resumo": "Um breve texto de introdução motivador sobre o destino.",
  "dicas_gerais": ["Dica 1", "Dica 2", "Dica 3"],
  "dados_clima": {
    "temperatura_media": "ex: 22°C",
    "recomendacoes_roupa": "Recomendações detalhadas de vestuário de acordo com o clima."
  },
  "dados_financeiros": {
    "moeda_local": "ex: Euro (EUR) - €",
    "planejamento_custo": "Estimativas de gastos e um breve orçamento ideal diário sugerido para este perfil de viagem.",
    "moeda_levar": "Indicação da moeda mais adequada que o viajante deve levar físico ou em cartão (ex: Euros)."
  },
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

    // 5. Chamar a API do Gemini via HTTPS com Fallback resiliente
    let modelName = 'gemini-3.5-flash';
    let geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    let geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (geminiResponse.status === 503) {
      console.warn('Modelo gemini-3.5-flash sob alta demanda. Iniciando fallback para gemini-2.5-flash...');
      modelName = 'gemini-2.5-flash';
      geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      
      geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
    }

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      throw new Error(`Erro na API do Gemini (${modelName}): ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    let responseText = geminiData.candidates[0].content.parts[0].text;
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    let planoEstruturado;
    try {
      planoEstruturado = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Erro de Parse do JSON retornado pelo Gemini:', responseText);
      throw new Error('O gerador de itinerários retornou um formato inválido. Tente novamente.');
    }

    // 6. Salvar o plano no Firestore
    const newDocRef = db.collection('viagens').doc();
    const planoSalvar = {
      id: newDocRef.id,
      userId: userId,
      userEmail: userEmail,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lat: extraInfo ? extraInfo.lat : null,
      lon: extraInfo ? extraInfo.lon : null,
      ...planoEstruturado
    };

    await newDocRef.set(planoSalvar);

    return res.status(200).json(planoSalvar);

  } catch (error) {
    console.error('Erro ao processar plano de viagem:', error);
    return res.status(500).json({ message: error.message || 'Erro interno ao gerar plano de viagem.' });
  }
};
