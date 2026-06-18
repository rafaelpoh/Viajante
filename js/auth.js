/**
 * Lógica do Firebase Authentication (auth.js)
 */

import { auth } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { select } from './utils.js';

// Cache de elementos do cabeçalho que mudam com a autenticação
const headerLoginBtn = select('.nav-desktop .btn-login') || select('.btn-login');
const headerRegisterBtn = select('.nav-desktop .btn-register') || select('.btn-register');

// Armazena o usuário atual globalmente no escopo do módulo
let currentUser = null;

/**
 * Retorna o usuário logado atualmente.
 * @returns {Object|null}
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Realiza login de um usuário existente.
 * @param {string} email 
 * @param {string} password 
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erro de Login:', error);
    throw new Error(translateAuthError(error.code));
  }
}

/**
 * Registra um novo usuário.
 * @param {string} email 
 * @param {string} password 
 */
export async function registerUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Erro de Cadastro:', error);
    throw new Error(translateAuthError(error.code));
  }
}

/**
 * Realiza o logout do usuário.
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro de Logout:', error);
    throw error;
  }
}

/**
 * Traduz erros comuns do Firebase Auth para o Português.
 * @param {string} code 
 * @returns {string}
 */
function translateAuthError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'O endereço de e-mail inserido é inválido.';
    case 'auth/user-disabled':
      return 'Este usuário foi desabilitado.';
    case 'auth/user-not-found':
      return 'Não há usuário correspondente ao e-mail fornecido.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Tente novamente.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está sendo utilizado por outra conta.';
    case 'auth/weak-password':
      return 'A senha fornecida é muito fraca. Use pelo menos 6 caracteres.';
    case 'auth/operation-not-allowed':
      return 'Esta operação não está habilitada nas configurações do Firebase.';
    default:
      return 'Houve um erro de autenticação. Por favor, verifique suas chaves do Firebase.';
  }
}

/**
 * Escuta mudanças de estado da autenticação e atualiza a interface.
 * @param {Function} callback 
 */
export function listenToAuthState(callback) {
  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateAuthUI(user);
    if (callback) callback(user);
  });
}

/**
 * Atualiza o cabeçalho do site dependendo do estado do usuário.
 * @param {Object|null} user 
 */
function updateAuthUI(user) {
  // Encontra os links do menu e os botões
  const navDesktop = select('.nav-desktop');
  const navMobile = select('.nav-mobile');

  if (!navDesktop) return;

  // Cache de botões para alteração
  let loginBtns = [select('.btn-login', navDesktop), select('.btn-login', navMobile)].filter(Boolean);
  let registerBtns = [select('.btn-register', navDesktop), select('.btn-register', navMobile)].filter(Boolean);
  
  // Encontra ou cria os botões adicionais no container nav-desktop e nav-mobile
  let userProfileContainers = [select('.user-profile-nav', navDesktop), select('.user-profile-nav', navMobile)].filter(Boolean);

  if (user) {
    // Esconde botões de login e registro
    loginBtns.forEach(btn => btn.style.display = 'none');
    registerBtns.forEach(btn => btn.style.display = 'none');

    // Mostra/Cria botão de sair e área do usuário
    userProfileContainers.forEach(container => {
      container.style.display = 'flex';
    });

    if (userProfileContainers.length === 0) {
      // Cria a área do usuário logado se não existir
      createUserNavElements(navDesktop, user.email, false);
      createUserNavElements(navMobile, user.email, true);
    }
  } else {
    // Mostra botões de login e registro
    loginBtns.forEach(btn => btn.style.display = 'block');
    registerBtns.forEach(btn => btn.style.display = 'block');

    // Remove ou oculta área do usuário
    userProfileContainers.forEach(container => {
      container.style.display = 'none';
    });
  }
}

/**
 * Cria os elementos de navegação para o usuário logado de forma segura contra XSS.
 */
function createUserNavElements(navContainer, email, isMobile) {
  const container = document.createElement('div');
  container.className = 'user-profile-nav';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.gap = 'var(--spacing-md)';
  if (isMobile) {
    container.style.flexDirection = 'column';
    container.style.width = '80%';
  }

  // Nome do usuário abreviado
  const userLabel = document.createElement('span');
  userLabel.className = 'user-email-label';
  userLabel.textContent = email.split('@')[0];
  userLabel.style.fontSize = '0.9rem';
  userLabel.style.fontWeight = 'var(--font-medium)';
  userLabel.style.color = isMobile ? 'var(--text-color)' : 'var(--text-muted)';

  // Botão Sair
  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn-register';
  logoutBtn.textContent = 'Sair';
  logoutBtn.style.padding = '0.5rem 1rem';
  if (isMobile) {
    logoutBtn.style.width = '100%';
  }
  
  logoutBtn.addEventListener('click', async () => {
    await logoutUser();
  });

  container.appendChild(userLabel);
  container.appendChild(logoutBtn);
  navContainer.appendChild(container);
}
