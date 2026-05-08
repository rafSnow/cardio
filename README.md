# 🏃 TreadLog — Cardio Tracker PWA

TreadLog é um Progressive Web App (PWA) minimalista para acompanhamento de sessões de cardio na esteira. Focado em privacidade e simplicidade, o app funciona 100% offline, salvando todos os dados localmente no seu navegador.

## ✨ Funcionalidades

- **Registro de Treino**: Data, distância, duração, calorias e observações.
- **Insights em Tempo Real**: Cálculo de pace e velocidade média durante o preenchimento.
- **Dashboard**: Acompanhe sua meta semanal, streak de treinos e recordes.
- **Histórico**: Lista filtrável de sessões passadas com estatísticas do período.
- **Gráficos e Análises**: Visualize sua evolução através de diversos gráficos de desempenho.
- **Privacidade**: Sem backend, sem login. Seus dados pertencem a você e ficam no IndexedDB do browser.
- **Exportação/Importação**: Backup completo dos seus dados em JSON ou exportação para CSV.
- **Notificações PWA**: Lembretes diários e alertas de inatividade (configuráveis).
- **Dark Mode**: Interface moderna que se adapta às suas preferências.

## 🚀 Tecnologias

- **Framework**: React 18 + Vite
- **Banco de Dados**: IndexedDB via [Dexie.js](https://dexie.org/)
- **Estilização**: Tailwind CSS v3
- **Gráficos**: [Recharts](https://recharts.org/)
- **PWA**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- **Ícones**: Lucide React

## 📦 Instalação e Desenvolvimento

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- npm ou yarn

### Configuração
1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

### Comandos
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera o build de produção (incluindo PWA).
- `npm run preview`: Visualiza o build de produção localmente.
- `npm run deploy`: Realiza o deploy para o GitHub Pages.

## 📱 PWA

Para instalar o TreadLog no seu dispositivo:
- **Android/Chrome**: Clique no menu (três pontos) e selecione "Instalar aplicativo".
- **iOS/Safari**: Clique no ícone de compartilhamento e selecione "Adicionar à Tela de Início".

## 🛠️ Arquitetura

O projeto segue uma estrutura **Feature-First**:
- `src/features`: Módulos por funcionalidade (Dashboard, History, Session, etc.)
- `src/core`: Lógica de banco de dados, modelos e utilitários.
- `src/hooks`: Hooks customizados para abstração de dados.
- `src/services`: Regras de negócio.
- `src/components/ui`: Componentes de interface reutilizáveis.

## 📄 Licença

Este projeto é de código aberto e está sob a licença MIT.
