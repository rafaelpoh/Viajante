/**
 * Entrada principal (main.js)
 * Controla os eventos da página e integra as funcionalidades.
 */

import { select, selectAll, createElementSafe } from './utils.js';
import { loginUser, registerUser, listenToAuthState, getCurrentUser } from './auth.js';

// DOM Caching
const mobileMenuButton = select('#mobile-menu-button');
const mobileMenu = select('#mobile-menu');
const travelPlanForm = select('#travel-plan-form');
const formMessage = select('#form-message');
const animateElements = selectAll('.animate-fade-in-up');

// Modal Elements
const authModal = select('#auth-modal');
const closeAuthModal = select('#close-auth-modal');
const tabLogin = select('#tab-login');
const tabRegister = select('#tab-register');
const modalTitle = select('#modal-title');
const loginForm = select('#login-form');
const registerForm = select('#register-form');
const authMessage = select('#auth-message');
const travelSubmitBtn = select('#travel-plan-form .btn-submit');

// Itinerary Display Elements
const itineraryResultSection = select('#itinerary-result');
const itineraryTitle = select('#itinerary-title');
const itineraryResumo = select('#itinerary-resumo');
const itineraryDicas = select('#itinerary-dicas');
const itineraryDays = select('#itinerary-days');

/**
 * Abre o modal de autenticação na aba correspondente.
 * @param {string} tab - 'login' ou 'register'
 */
function openAuthModal(tab = 'login') {
  if (!authModal) return;
  
  if (authMessage) {
    authMessage.textContent = '';
    authMessage.className = 'form-message';
  }

  authModal.classList.add('active');

  if (tab === 'login') {
    switchToLoginTab();
  } else {
    switchToRegisterTab();
  }
}

/**
 * Fecha o modal de autenticação.
 */
function closeAuthModalWindow() {
  if (authModal) {
    authModal.classList.remove('active');
  }
}

function switchToLoginTab() {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
  modalTitle.textContent = 'Acesse sua conta';
}

function switchToRegisterTab() {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  modalTitle.textContent = 'Crie uma nova conta';
}

/**
 * Configura as interações de clique do modal.
 */
function setupModalEvents() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target.classList.contains('btn-login')) {
      event.preventDefault();
      openAuthModal('login');
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
      }
    }
    
    if (target.classList.contains('btn-register')) {
      event.preventDefault();
      openAuthModal('register');
      if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
      }
    }
  });

  if (closeAuthModal) {
    closeAuthModal.addEventListener('click', closeAuthModalWindow);
  }

  if (authModal) {
    authModal.addEventListener('click', (event) => {
      if (event.target === authModal) {
        closeAuthModalWindow();
      }
    });
  }

  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', switchToLoginTab);
    tabRegister.addEventListener('click', switchToRegisterTab);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      displayAuthMessage('Acessando conta...', 'loading');
      
      const email = select('#login-email').value.trim();
      const password = select('#login-password').value;

      try {
        await loginUser(email, password);
        displayAuthMessage('Login efetuado com sucesso!', 'success');
        setTimeout(closeAuthModalWindow, 1000);
      } catch (error) {
        displayAuthMessage(error.message, 'error');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = select('#register-email').value.trim();
      const password = select('#register-password').value;
      const confirmPassword = select('#register-confirm-password').value;

      if (password.length < 6) {
        displayAuthMessage('A senha precisa ter no mínimo 6 caracteres.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        displayAuthMessage('As senhas não coincidem.', 'error');
        return;
      }

      displayAuthMessage('Criando conta...', 'loading');

      try {
        await registerUser(email, password);
        displayAuthMessage('Conta criada e logada com sucesso!', 'success');
        setTimeout(closeAuthModalWindow, 1000);
      } catch (error) {
        displayAuthMessage(error.message, 'error');
      }
    });
  }
}

function displayAuthMessage(message, type = 'info') {
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.className = 'form-message';
  authMessage.classList.add(type);
}

function toggleMobileMenu() {
  const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
  mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
  mobileMenu.classList.toggle('active');
}

function setupNavigation() {
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    mobileMenu.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  }
}

function displayFormMessage(message, type = 'info') {
  if (!formMessage) return;
  formMessage.textContent = message;
  formMessage.className = 'form-message';
  formMessage.classList.add(type);
}

/**
 * Renderiza de forma segura as informações do itinerário recebido.
 * @param {Object} plan - Dados do plano de viagem.
 */
function renderItinerary(plan) {
  if (!itineraryResultSection) return;

  // 1. Destino e Período
  itineraryTitle.textContent = `Meu Itinerário: ${plan.destino} (${plan.periodo})`;
  itineraryResumo.textContent = plan.resumo || '';

  // 2. Limpar e renderizar Dicas
  itineraryDicas.textContent = '';
  if (plan.dicas_gerais && Array.isArray(plan.dicas_gerais)) {
    plan.dicas_gerais.forEach(dica => {
      const li = createElementSafe('li', {}, dica);
      itineraryDicas.appendChild(li);
    });
  }

  // 3. Limpar e renderizar Programação Diária
  itineraryDays.textContent = '';
  if (plan.itinerario && Array.isArray(plan.itinerario)) {
    plan.itinerario.forEach(diaInfo => {
      const dayCard = createElementSafe('div', {
        className: 'form-card',
        style: 'background-color: var(--background-color); border: 1px solid var(--border-color); padding: var(--spacing-md); border-radius: var(--radius-lg);'
      });

      const dayTitle = createElementSafe('h4', {
        className: 'feature-card-title',
        style: 'font-size: 1.1rem; text-align: left; margin-bottom: var(--spacing-sm); color: var(--primary-color);'
      }, `Dia ${diaInfo.dia}: ${diaInfo.titulo}`);

      const activityList = createElementSafe('ul', {
        style: 'display: flex; flex-direction: column; gap: var(--spacing-xs); padding-left: var(--spacing-md); list-style-type: circle;'
      });

      if (diaInfo.atividades && Array.isArray(diaInfo.atividades)) {
        diaInfo.atividades.forEach(atividade => {
          const actLi = createElementSafe('li', {
            style: 'color: var(--text-muted); font-size: 0.95rem;'
          }, atividade);
          activityList.appendChild(actLi);
        });
      }

      dayCard.appendChild(dayTitle);
      dayCard.appendChild(activityList);
      itineraryDays.appendChild(dayCard);
    });
  }

  // Exibir a seção
  itineraryResultSection.style.display = 'block';
  itineraryResultSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Configura o envio do formulário de criação de planos de viagem.
 */
function setupFormSubmission() {
  if (!travelPlanForm) return;

  travelPlanForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      openAuthModal('login');
      displayAuthMessage('Por favor, faça login para gerar seu plano de viagem.', 'info');
      return;
    }

    displayFormMessage('Gerando seu plano de viagem com IA...', 'loading');
    itineraryResultSection.style.display = 'none';

    const formData = new FormData(travelPlanForm);
    const data = Object.fromEntries(formData.entries());

    try {
      // Obter o Token ID do Usuário Autenticado para Envio no Header
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/create-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao comunicar com o servidor.');
      }

      const planResult = await response.json();
      
      displayFormMessage('Seu plano de viagem foi gerado com sucesso!', 'success');
      
      // Renderizar o plano retornado na tela
      renderItinerary(planResult);
      
      travelPlanForm.reset();

    } catch (error) {
      console.error('Erro ao gerar plano de viagem:', error);
      displayFormMessage(error.message || 'Houve um problema ao processar sua solicitação.', 'error');
    }
  });
}

function setupAnimations() {
  animateElements.forEach((el, index) => {
    const delay = parseFloat(el.getAttribute('data-delay')) || (index * 0.1);
    setTimeout(() => {
      el.classList.add('active');
    }, delay * 1000);
  });
}

/**
 * Monitora o estado de login e ajusta o formulário de planos de viagem.
 */
function watchAuthState() {
  listenToAuthState((user) => {
    if (travelSubmitBtn) {
      if (user) {
        travelSubmitBtn.textContent = 'Gerar Meu Plano Agora!';
      } else {
        travelSubmitBtn.textContent = 'Faça login para gerar seu plano';
      }
    }
  });
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupFormSubmission();
  setupAnimations();
  setupModalEvents();
  watchAuthState();
});
