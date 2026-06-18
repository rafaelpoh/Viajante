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

// Auth Modal Elements
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

// Itinerary Weather & Financial Elements
const itineraryClimaTemp = select('#itinerary-clima-temperatura');
const itineraryClimaRec = select('#itinerary-clima-recomendacao');
const itineraryFinanceiroMoeda = select('#itinerary-financeiro-moeda');
const itineraryFinanceiroCusto = select('#itinerary-financeiro-custo');

// Plans History Modal Elements
const plansModal = select('#plans-modal');
const closePlansModal = select('#close-plans-modal');
const plansList = select('#plans-list');
const plansLoading = select('#plans-loading');

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
 * Abre o modal de histórico de planos.
 */
function openPlansModal() {
  if (!plansModal) return;
  plansModal.classList.add('active');
  loadMyPlans();
}

/**
 * Fecha o modal de histórico de planos.
 */
function closePlansModalWindow() {
  if (plansModal) {
    plansModal.classList.remove('active');
  }
}

/**
 * Consulta o histórico de planos de viagem do usuário no back-end.
 */
async function loadMyPlans() {
  const user = getCurrentUser();
  if (!user) return;

  if (plansLoading) plansLoading.style.display = 'block';
  if (plansList) plansList.textContent = ''; // Limpeza segura

  try {
    const idToken = await user.getIdToken();
    const response = await fetch('/api/get-plans', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });

    if (plansLoading) plansLoading.style.display = 'none';

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao carregar os planos.');
    }

    const plans = await response.json();

    if (plans.length === 0) {
      const emptyMsg = createElementSafe('div', {
        className: 'form-message info',
        style: 'margin-top: var(--spacing-md);'
      }, 'Você não tem planos de viagem para mostrar. Crie um novo plano no formulário da página!');
      plansList.appendChild(emptyMsg);
      return;
    }

    plans.forEach(plan => {
      const card = createElementSafe('button', {
        className: 'plan-item-card'
      });

      const title = createElementSafe('div', {
        className: 'plan-item-title'
      }, plan.destino);

      const meta = createElementSafe('div', {
        className: 'plan-item-meta'
      });

      const periodSpan = createElementSafe('span', {}, `Período: ${plan.periodo}`);
      
      let dateString = '';
      if (plan.createdAt) {
        const dateObj = plan.createdAt._seconds ? new Date(plan.createdAt._seconds * 1000) : new Date(plan.createdAt);
        dateString = dateObj.toLocaleDateString('pt-BR');
      }
      const dateSpan = createElementSafe('span', {}, dateString);

      meta.appendChild(periodSpan);
      meta.appendChild(dateSpan);
      card.appendChild(title);
      card.appendChild(meta);

      card.addEventListener('click', () => {
        closePlansModalWindow();
        renderItinerary(plan);
      });

      plansList.appendChild(card);
    });

  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    if (plansLoading) plansLoading.style.display = 'none';
    const errorMsg = createElementSafe('div', {
      className: 'form-message error'
    }, error.message || 'Houve um erro ao buscar seus planos de viagem.');
    plansList.appendChild(errorMsg);
  }
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

    if (target.classList.contains('btn-my-plans')) {
      event.preventDefault();
      const user = getCurrentUser();
      if (!user) {
        openAuthModal('login');
        displayAuthMessage('Faça login para acessar o histórico de seus planos.', 'info');
      } else {
        openPlansModal();
      }
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

  if (closePlansModal) {
    closePlansModal.addEventListener('click', closePlansModalWindow);
  }

  if (plansModal) {
    plansModal.addEventListener('click', (event) => {
      if (event.target === plansModal) {
        closePlansModalWindow();
      }
    });
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

  // 3. Renderizar Clima (Se disponível no plano)
  if (itineraryClimaTemp && itineraryClimaRec) {
    if (plan.dados_clima) {
      itineraryClimaTemp.textContent = `Temperatura Média Estimada: ${plan.dados_clima.temperatura_media || 'N/A'}`;
      itineraryClimaRec.textContent = plan.dados_clima.recomendacoes_roupa || '';
    } else {
      itineraryClimaTemp.textContent = 'Dados de previsão climática não vinculados.';
      itineraryClimaRec.textContent = '';
    }
  }

  // 4. Renderizar Dados Financeiros (Se disponível no plano)
  if (itineraryFinanceiroMoeda && itineraryFinanceiroCusto) {
    if (plan.dados_financeiros) {
      itineraryFinanceiroMoeda.textContent = `Moeda Sugerida: ${plan.dados_financeiros.moeda_local || 'N/A'} (Levar físico ou cartão: ${plan.dados_financeiros.moeda_levar || 'N/A'})`;
      itineraryFinanceiroCusto.textContent = plan.dados_financeiros.planejamento_custo || '';
    } else {
      itineraryFinanceiroMoeda.textContent = 'Dados de moeda e planejamento financeiro não vinculados.';
      itineraryFinanceiroCusto.textContent = '';
    }
  }

  // 5. Limpar e renderizar Programação Diária
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
