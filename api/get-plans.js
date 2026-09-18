import admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK se ainda não foi inicializado
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = typeof process.env.FIREBASE_SERVICE_ACCOUNT === 'string'
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : process.env.FIREBASE_SERVICE_ACCOUNT;
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      console.warn('Variável de ambiente FIREBASE_SERVICE_ACCOUNT não definida.');
    }
  } catch (error) {
    console.error('Falha ao inicializar Firebase Admin SDK:', error);
  }
}

const getDb = () => (admin.apps.length ? admin.firestore() : null);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido. Utilize GET.' });
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
  const db = getDb();

  if (!db) {
    return res.status(500).json({ message: 'Serviço de banco de dados indisponível: FIREBASE_SERVICE_ACCOUNT ausente ou inválida nas variáveis de ambiente da Vercel.' });
  }

  try {
    // 2. Buscar no Firestore todos os documentos correspondentes ao userId do usuário logado
    const querySnapshot = await db.collection('viagens')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const viagens = [];
    querySnapshot.forEach(doc => {
      viagens.push(doc.data());
    });

    return res.status(200).json(viagens);

  } catch (error) {
    console.error('Erro ao recuperar planos de viagem:', error);
    return res.status(500).json({ message: error.message || 'Erro interno ao recuperar planos de viagem.' });
  }
}
