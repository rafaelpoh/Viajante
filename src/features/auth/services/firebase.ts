import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBPA6SmmzdHsMA6Y66g6VyjiyJK1NbBlAU",
  authDomain: "viajante-5d54f.firebaseapp.com",
  projectId: "viajante-5d54f",
  storageBucket: "viajante-5d54f.firebasestorage.app",
  messagingSenderId: "1053000852525",
  appId: "1:1053000852525:web:c34725c84177040a2fc4a4"
};

// Inicialização segura no padrão singleton para evitar reinicializações
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
