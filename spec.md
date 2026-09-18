# Project Specification & Development Rules (spec.md)

Este documento define os padrões arquiteturais, diretrizes de segurança, performance, tipagem estrita e estilo de código para o projeto **Viajante (Planejador de Viagens)**, baseado no guia `/reactspecs` e nos padrões de design **Impeccable**.

---

## 1. Stack Tecnológico & Restrições

- **Linguagem & Runtime:** TypeScript (ES2022+ com `strict: true` ativado).
- **Biblioteca de UI:** React 18+ (Componentes Funcionais, Hooks nativos e State Imutável).
- **Bundler & Dev Server:** Vite.
- **Estilização:** CSS Modules (`*.module.css`) com Design Tokens nativos em `tokens.css` (:root).
- **Validação de Esquemas:** Zod para validação em runtime de I/O (contratos com APIs e Firestore).
- **Mapas Interativos:** Leaflet.js (OpenStreetMap) com ciclo de vida seguro no React.
- **Autenticação:** Firebase Client SDK (Auth) no frontend; Firebase Admin SDK e Gemini AI nas Serverless Functions (`api/`).
- **Restrição de Dependências:** Proibido o uso de bibliotecas legadas (jQuery, lodash desnecessário).

---

## 2. Estrutura de Diretórios e Arquivos (Feature-Driven & Colocation)

```text
/ (root)
├── index.html                   # HTML base com <div id="root">
├── tsconfig.json                # Configurações estritas do TypeScript (strict: true)
├── tsconfig.node.json           # Configuração de tipos para o bundler Vite
├── vite.config.ts               # Vite bundler com proxy e manualChunks
├── package.json                 # Dependências do projeto
├── PRODUCT.md                   # Registro durável de produto (Impeccable init)
├── /public                      # Mídias e ativos estáticos
│   └── /assets
├── /api                         # Serverless functions Vercel (preservadas)
└── /src
    ├── main.tsx                 # Entrada createRoot (React.StrictMode)
    ├── App.tsx                  # Composição global da aplicação
    ├── App.module.css           # Estilos do layout mestre
    ├── /styles                  # tokens.css, reset.css, global.css
    ├── /components              # Componentes de UI genéricos (Button, Input, Modal, Icons)
    ├── /features                # Módulos verticais de negócio isolados
    │   ├── auth/                # Autenticação Firebase (login, registro, sessão)
    │   ├── plan-creator/        # Criação de planos via IA e validação Zod
    │   ├── itinerary/           # Exibição do roteiro, dicas, clima e finanças
    │   ├── saved-plans/         # Histórico de viagens salvas no Firestore
    │   └── map-view/            # Mapas Leaflet (geolocalização e destino)
    ├── /types                   # Esquemas Zod e contratos TypeScript (Readonly)
    └── /utils                   # Funções puras, formatação e erros
```

---

## 3. Padrões de Código & Qualidade

- **Princípio da Responsabilidade Única (SRP):** Separação estrita de lógica de apresentação (JSX), lógica de negócio (Custom Hooks) e contratos (Types/Zod).
- **Proibição do any:** Proibido uso de `any`. Use `unknown` com Type Guards ou tipos genéricos estritos.
- **Imutabilidade Pura:** O estado do React deve ser estritamente imutável com uso de `Readonly<T>` e `ReadonlyArray<T>`.
- **Nomenclatura:**
  - Componentes e Interfaces: PascalCase (ex: `PlanForm`, `TravelPlan`).
  - Hooks: camelCase com prefixo `use` (ex: `useAuth`, `useCreatePlan`).
  - Manipuladores: prefixo `handle` internamente e `on` em props (ex: `handleSubmitPlan` / `onSubmitPlan`).
- **Segurança (Anti-XSS):**
  - Proibido o uso de `dangerouslySetInnerHTML`.
  - Validação na fronteira via Zod antes de propagar dados para o estado.
- **Performance & Estabilidade:**
  - `key` persistente em listas mutáveis (nunca usar índice de array).
  - Memorização estratégica com `React.memo`, `useCallback` e `useMemo`.

---

## 4. Padrões de Design e Superfícies (Impeccable Craft Floor)

- **Contraste:** Texto base ≥ 4.5:1, textos grandes ≥ 3:1.
- **Superfícies Nativas:** Estilização de `::selection`, `caret-color`, scrollbars customizados e anel de foco acessível `:focus-visible`.
- **Ícones Vetoriais:** Ícones SVG autorados em traço consistente de 2px (sem emojis para ícones de sistema).
- **Design Tokens:** Nenhuma cor, espaçamento ou raio hardcoded no CSS; tudo centralizado em `tokens.css`.
