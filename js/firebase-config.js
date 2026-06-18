/**
 * Configuração e inicialização do Firebase.
 * IMPORTANTE: Substitua os placeholders abaixo pelas credenciais reais do seu projeto Firebase.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBPA6SmmzdHsMA6Y66g6VyjiyJK1NbBlAU",
  authDomain: "viajante-5d54f.firebaseapp.com",
  projectId: "viajante-5d54f",
  storageBucket: "viajante-5d54f.firebasestorage.app",
  messagingSenderId: "1053000852525",
  appId: "1:1053000852525:web:c34725c84177040a2fc4a4"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firebase Authentication
export const auth = getAuth(app);
