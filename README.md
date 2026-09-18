# ✈️ Viajante — Planejador Inteligente de Viagens

[![React 18](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite Bundler](https://img.shields.io/badge/Vite-5+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase Integrated](https://img.shields.io/badge/Firebase-Integrated-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Zod Validated](https://img.shields.io/badge/Zod-Validated-3E67B1?style=flat-square&logo=zod&logoColor=white)](https://zod.dev)
[![Leaflet Maps](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

O **Viajante** é um planejador de viagens inteligente e dinâmico construído como uma Single Page Application (SPA) em **React 18+ com TypeScript estrito**, orientado pelo guia arquitetural `/reactspecs` e pelos princípios de excelência estética do **Impeccable**.

A aplicação utiliza o **Google Gemini** para gerar itinerários detalhados dia a dia, enriquecendo o plano com dados climáticos reais da **OpenWeather API**, informações geográficas e financeiras da **REST Countries**, visualização cartográfica interativa com **Leaflet** e persistência segura na nuvem com **Firebase Auth & Firestore**.

---

## 🌟 Recursos Principais

*   **Roteiros com IA (Gemini):** Geração de itinerários estruturados e personalizados com base no destino, duração e motivo da viagem.
*   **Integração Clima & Geografia:** Previsão climática, recomendações de vestuário e planejamento de moeda/câmbio com dados reais.
*   **Mapas Interativos (Leaflet / OpenStreetMap):** Visualização de destinos sugeridos e busca de atrações turísticas e restaurantes em raio de 1.5km da localização atual do usuário via Overpass API.
*   **Autenticação & Histórico:** Cadastro/login com Firebase Auth e histórico completo de viagens salvas no Firestore.
*   **Validação Estrita de I/O:** Esquemas do **Zod** validando as respostas das APIs em tempo de execução para máxima estabilidade e prevenção de dados corrompidos.
*   **Segurança Serverless:** As chaves de API sensíveis (Gemini, OpenWeather, Firebase Admin) operam exclusivamente no backend serverless (`api/`).

---

## 🛠️ Stack Tecnológica

*   **Front-end:** React 18+, TypeScript (ES2022+ com `strict: true`), Vite, CSS Modules (`*.module.css`).
*   **Design System & Craft:** Design Tokens centralizados em `src/styles/tokens.css`, superfícies nativas customizadas (`::selection`, `caret-color`, scrollbars elegantes e anel `:focus-visible`).
*   **Cartografia:** Leaflet.js e Overpass API.
*   **Back-end:** Serverless Functions em Node.js (Vercel).
*   **Banco de Dados & Auth:** Google Firebase (Auth e Cloud Firestore).
*   **IA Generativa:** Google Gemini API.

---

## 📂 Estrutura do Projeto (Feature-Driven & Colocation)

```text
/ (raiz)
├── api/                         # Serverless Functions (Node.js) implantadas na Vercel
│   ├── create-plan.js           # Geração e persistência dos planos
│   └── get-plans.js             # Consulta dos planos salvos por usuário
├── public/                      # Recursos estáticos servidos pelo Vite
│   └── assets/                  # Favicon e imagem principal do Hero
├── src/                         # Código fonte da SPA React
│   ├── main.tsx                 # Entrada createRoot (React.StrictMode)
│   ├── App.tsx                  # Composição principal da aplicação
│   ├── App.module.css           # Estilos mestre de layout
│   ├── styles/                  # Design tokens, reset moderno e estilos globais
│   ├── components/              # Componentes de UI genéricos (Button, Input, Modal, Icons)
│   ├── features/                # Módulos verticais de negócio isolados
│   │   ├── auth/                # Autenticação Firebase (login, registro, hooks)
│   │   ├── plan-creator/        # Formulário com IA e validação Zod
│   │   ├── itinerary/           # Exibição do roteiro, clima e programação diária
│   │   ├── saved-plans/         # Histórico de viagens salvas no Firestore
│   │   └── map-view/            # Mapas Leaflet e geolocalização
│   ├── types/                   # Esquemas Zod e contratos TypeScript estritos
│   └── utils/                   # Formatadores puros e mensagens traduzidas
├── index.html                   # Ponto de entrada SPA do Vite
├── package.json                 # Dependências e scripts de build
├── PRODUCT.md                   # Registro de contexto de produto (Impeccable)
├── spec.md                      # Especificação técnica do projeto
├── tsconfig.json                # Configurações estritas do TypeScript
└── vite.config.ts               # Configuração do Vite com proxy e manualChunks
```

---

## 🚀 Como Iniciar Localmente

### Pré-requisitos
*   [Node.js](https://nodejs.org/) (versão 18 ou superior).

### Passo a Passo

1.  **Instalar dependências:**
    ```bash
    npm install
    ```

2.  **Configurar variáveis de ambiente (`.env`):**
    Certifique-se de que o arquivo `.env` na raiz contenha as chaves necessárias para as Serverless Functions (`GEMINI_API_KEY`, `OPENWEATHER_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`).

3.  **Executar o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    Acesse a aplicação no navegador em `http://localhost:5173`.

4.  **Verificar tipagem e compilar para produção:**
    ```bash
    npm run build
    ```

---

## 📄 Licença

Este projeto está sob a licença MIT.
