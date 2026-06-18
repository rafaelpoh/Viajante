# Planejador de Viagens - Plano de Projeto

## Objetivo
Criar uma aplicação de planejamento de viagens integrada com APIs de geolocalização, clima, dados geográficos e o Gemini, utilizando arquitetura simples (sem build tools) e backend na Vercel, com persistência via Firebase.

## Stack Tecnológica
- **Front-end:** HTML5, CSS3, JS Vanilla.
- **Back-end:** Vercel (Serverless Functions em Node.js).
- **Firebase:** Auth (Autenticação) e Firestore (Banco de dados).
- **APIs:** 
  - Geocoding API (ex: Nominatim).
  - OpenWeatherMap (clima).
  - REST Countries (dados dos países).
  - Gemini API (IA/Planejamento).

## Fluxo de Execução (Opção 2 - Segura)
1. Usuário envia o "motivo da viagem" via front-end autenticado (Firebase Auth).
2. Front-end envia requisição para Vercel Function.
3. Vercel Function chama Gemini API, recebe o plano estruturado.
4. Vercel Function salva o plano no Firestore (Firebase Admin SDK).
5. Vercel Function retorna o plano salvo para o front-end exibir.

## Etapas do Projeto
1. **Configuração inicial:** Estruturar pastas, criar projeto no Firebase e Vercel.
2. **Back-end (Proxy & Firebase):** Implementar funções Serverless protegidas para Gemini e Firebase.
3. **Front-end:** Criar formulário de destino, período e motivo.
4. **Auth & UI:** Integrar Firebase Auth no front-end para login e exibição dos dados.
5. **Integração Dados:** Consumir APIs de clima e países para enriquecer o plano.
6. **UI/UX:** Implementar exibição do itinerário e histórico de viagens salvas.

## Segurança
- Chaves de API e credenciais do Firebase Admin NUNCA no front-end.
- Todo processamento sensível via back-end.
- Regras de segurança no Firestore garantindo privacidade por usuário.
