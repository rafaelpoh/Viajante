# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 18+ com TypeScript (`strict: true`), Vite, CSS Modules com tokens nativos, Zod para validação em runtime de I/O, Firebase Client SDK (Auth), Leaflet.js (Mapas interativos OpenStreetMap) e Serverless Functions no backend (Vercel) com Firebase Admin SDK e Google Gemini AI.

## Users

Viajantes, turistas e aventureiros que desejam roteiros personalizados, detalhados e contextualizados (clima, moeda, dicas culturais e itinerário dia a dia) de forma rápida e intuitiva.

## Product Purpose

Transformar o planejamento de viagens em uma experiência simples, rica e inspiradora. O Viajante conecta inteligência artificial generativa com dados geográficos e climáticos reais em tempo real, organizando itinerários inteligentes com visualização cartográfica e armazenamento seguro no histórico da nuvem.

## Positioning

Diferente de geradores de texto genéricos ou planilhas estáticas, o Viajante integra em uma única tela o poder de IA do Gemini contextualizado com previsão de tempo real (OpenWeather) e informações financeiras/moeda do país (REST Countries), além de mapas interativos de pontos turísticos próximos e navegação responsiva de alto padrão.

## Operating Context

- Aplicação web responsiva (Mobile-First e Desktop).
- Usuários autenticados de forma rápida e segura via Firebase Auth (e-mail e senha).
- Consulta e armazenamento assíncrono de planos no Google Firestore.

## Capabilities and Constraints

- Criação de planos informando Destino, Período e Motivo da viagem.
- Validação estrita de contratos de entrada e saída via Zod schemas.
- Renderização visual e responsiva do itinerário completo: Resumo, Dicas, Clima & Roupas, Finanças & Moeda, e Programação Diária.
- Modal de mapa dinâmico com Leaflet (para o destino selecionado ou para geolocalização do usuário com Overpass API).
- Consulta e recuperação de planos salvos no Firestore vinculados ao UID do usuário logado.
- Restrição: Chaves de API de backend (Gemini, OpenWeather, Firebase Admin) protegidas exclusivamente nas Serverless Functions do Vercel (`api/`).

## Brand Commitments

- Nome: Viajante (Planejador de Viagens).
- Identidade visual moderna, acolhedora e fluida, com foco em legibilidade, tipografia clara (*Outfit*) e superfícies com alto contraste.
- Nenhum uso de emojis para ícones de sistema ou textos genéricos; ícones desenhados com consistência vetorial.

## Product Principles

- **Clareza Imediata**: O usuário deve conseguir gerar seu plano em poucos cliques sem barreiras cognitivas.
- **Riqueza de Contexto Real**: Um itinerário precisa informar além dos pontos turísticos: o que vestir de acordo com a temperatura e qual moeda levar.
- **Zero Trust & Confiabilidade**: Respostas de IA devem ser rigorosamente validadas em runtime antes de serem expostas na interface.
- **Respeito às Superfícies**: O design cuida dos menores detalhes, incluindo scrollbars, seleção de texto, contraste e anéis de foco acessíveis.
