/**
 * Utilitários e Helpers reutilizáveis para o projeto Viajante.
 */

/**
 * Cria de maneira segura um elemento do DOM configurando atributos e conteúdo de texto para evitar XSS.
 * @param {string} tag - O nome da tag HTML.
 * @param {Object} attributes - Atributos a serem aplicados ao elemento.
 * @param {string|Node} [content] - Conteúdo de texto ou nó filho do elemento.
 * @returns {HTMLElement} O elemento DOM criado de forma segura.
 */
export function createElementSafe(tag, attributes = {}, content = '') {
  const element = document.createElement(tag);
  
  // Aplica atributos
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'className') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  }

  // Define conteúdo de forma segura contra XSS
  if (content !== '') {
    if (content instanceof Node) {
      element.appendChild(content);
    } else {
      element.textContent = content; // textContent é seguro contra XSS
    }
  }

  return element;
}

/**
 * Encapsula o document.querySelector para facilitar e cachear seletores básicos de forma limpa.
 * @param {string} selector - O seletor CSS do elemento.
 * @param {HTMLElement} [parent=document] - Elemento pai para escopo da busca.
 * @returns {HTMLElement|null} O elemento DOM encontrado ou nulo.
 */
export function select(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Encapsula o document.querySelectorAll convertendo o resultado para um Array real.
 * @param {string} selector - O seletor CSS dos elementos.
 * @param {HTMLElement} [parent=document] - Elemento pai para escopo da busca.
 * @returns {HTMLElement[]} Coleção de elementos DOM.
 */
export function selectAll(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}
