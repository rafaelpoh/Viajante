# ✈️ Viajante — Planejador Inteligente de Viagens

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Firebase Integrated](https://img.shields.io/badge/Firebase-Integrated-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vanilla JS](https://img.shields.io/badge/JS-Vanilla%20ES6+-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

O **Viajante** é um planejador de itinerários de viagens inteligente e dinâmico. A aplicação utiliza inteligência artificial para gerar roteiros personalizados com base em suas preferências, enriquecendo o plano com dados climáticos reais, informações geográficas e dados detalhados do país de destino.

---

## 🌟 Recursos Principais

*   **Roteiros com IA (Gemini):** Geração de itinerários detalhados e personalizados de acordo com o motivo, duração e perfil da viagem.
*   **Integração Clima & Geografia:** Consumo de dados dinâmicos das APIs do *OpenWeatherMap* e *REST Countries* para enriquecer o plano da viagem.
*   **Autenticação de Usuários:** Login seguro integrado via *Firebase Authentication*.
*   **Histórico de Viagens:** Salvamento automático de rotas e planos personalizados no *Cloud Firestore* para consultas futuras.
*   **Segurança Robusta (Arquitetura Proxy/Serverless):** Chamadas de chaves sensíveis da API (Gemini/Firebase Admin) ocorrem exclusivamente no backend (Serverless Functions na Vercel), mantendo o front-end limpo e seguro.

---

## 🛠️ Stack Tecnológica

O projeto foi concebido seguindo princípios de **desenvolvimento limpo**, sem o uso de empacotadores ou frameworks SPA pesados no front-end:

*   **Front-end:** HTML5 Semântico, CSS3 (variáveis nativas e arquitetura limpa) e JavaScript Vanilla (ES6+ modular).
*   **Back-end:** Serverless Functions do Node.js executadas na infraestrutura da [Vercel](https://vercel.com).
*   **Banco de Dados & Auth:** [Google Firebase](https://firebase.google.com/) (Firestore e Auth).
*   **Processamento de Linguagem Natural:** Google Gemini API.

---

## 📂 Estrutura do Projeto

```text
/ (raiz)
├── api/                  # Serverless Functions (Node.js) implantadas na Vercel
│   └── create-plan.js    # Função para geração e persistência dos planos
├── assets/               # Recursos estáticos (imagens, ícones)
├── css/                  # Arquitetura CSS Modular
│   ├── reset.css         # Reset de estilos globais
│   ├── var.css           # Tokens de Design e Variáveis do CSS (:root)
│   └── skin.css          # Estilização visual dos componentes e layout
├── js/                   # Arquitetura JS Modular (ES Modules)
│   ├── main.js           # Ponto de entrada do Front-end
│   └── utils.js          # Helpers e utilitários reutilizáveis (DRY)
├── index.html            # Ponto de entrada da aplicação
├── package.json          # Configurações do Backend Serverless e dependências
├── spec.md               # Especificação técnica e regras de desenvolvimento
└── viajante_plano.md     # Plano geral do projeto
```

---

## 🚀 Como Iniciar Localmente

### Pré-requisitos
*   [Node.js](https://nodejs.org/) instalado.
*   [Vercel CLI](https://vercel.com/cli) instalado globalmente (`npm i -g vercel`).
*   Conta configurada no Firebase.

### Passo a Passo

1.  **Clonar o repositório:**
    ```bash
    git clone https://github.com/rafaelpoh/Viajante.git
    cd Viajante
    ```

2.  **Instalar dependências (Backend):**
    ```bash
    npm install
    ```

3.  **Configurar variáveis de ambiente (`.env`):**
    Crie um arquivo `.env` na raiz do projeto com as seguintes chaves de acesso:
    ```env
    GEMINI_API_KEY=sua_chave_do_gemini
    OPENWEATHER_API_KEY=sua_chave_do_openweathermap
    FIREBASE_PROJECT_ID=id-do-seu-projeto
    FIREBASE_CLIENT_EMAIL=email-do-client-firebase-admin
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
    ```

4.  **Executar o servidor de desenvolvimento:**
    Inicie a Vercel em modo local para rodar tanto o front-end quanto as serverless functions de forma integrada:
    ```bash
    npm run dev
    ```
    Acesse a aplicação localmente no endereço fornecido pelo terminal (ex: `http://localhost:3000`).

---

## 🛡️ Regras e Padrões de Código

Os contribuidores devem seguir estritamente as diretrizes contidas em [`spec.md`](file:///c:/Users/Pohzin/Documents/GitHub/Viajante/spec.md):
*   **innerHTML é Proibido:** Para evitar vulnerabilidades XSS, utilize sempre `textContent`, `innerText` ou manipulação manual do DOM através de `document.createElement`.
*   **CSS Limpo:** Não adicione cores ou tamanhos estáticos diretamente no `skin.css`. Utilize sempre as variáveis declaradas centralizadamente em `css/var.css`.
*   **Módulos Nativos:** Utilize imports/exports ES Modules nativos no JavaScript.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
