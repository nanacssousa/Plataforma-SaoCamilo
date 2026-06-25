# Plataforma São Camilo 💧🏃

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_API-D97757?style=for-the-badge&logo=anthropic&logoColor=white)

---

## 📖 Sobre o Projeto

A **Plataforma São Camilo** é um sistema de monitoramento clínico-esportivo da hidratação de atletas de alto rendimento, desenvolvido para otimizar a performance e a segurança por meio do acompanhamento contínuo de dados fisiológicos e dos níveis de hidratação durante o treino.

Trata-se de um projeto acadêmico desenvolvido por alunos de **Inteligência Artificial e Ciência de Dados**, unindo a aplicação prática de engenharia de software à área da saúde e do desempenho esportivo.

---

## ⚙️ Como Funciona?

A plataforma centraliza informações em tempo real e organiza o acompanhamento do atleta ao longo de **três momentos do treino**:

- **PRÉ** — avaliação inicial antes da atividade;
- **MONITORAMENTO** — acompanhamento contínuo durante o esforço;
- **PÓS** — análise de recuperação após o treino.

Em cada momento, um **agente de inteligência artificial** (via Anthropic Claude API) gera análises e recomendações baseadas nos dados coletados, apoiando a comissão técnica na tomada de decisão. O sistema ainda integra **dados climáticos e índice de calor** (via Open-Meteo API) para contextualizar o esforço de acordo com as condições do ambiente.

O acesso é organizado por **perfis de usuário**, cada um com seu painel dedicado:

- 👟 **Treinador** — gestão das sessões de treino e acompanhamento das equipes;
- 🩺 **Médico** — visão clínica dos dados fisiológicos e de hidratação;
- 🛠️ **Administrador** — gestão geral da plataforma, equipes e usuários.

---

## ✨ Principais Funcionalidades

- **Monitoramento de hidratação em tempo real** ao longo de todo o ciclo de treino;
- **Gestão de sessões** estruturada nos momentos PRÉ, MONITORAMENTO e PÓS;
- **Análises e recomendações por IA** em cada etapa, com base em evidências;
- **Integração com dados climáticos e índice de calor** para contextualizar o esforço;
- **Controle de acesso por perfil** (Treinador, Médico e Administrador) com dashboards dedicados;
- **Histórico por equipe e atleta** para acompanhamento e auditoria das sessões.

---

## 🧩 Arquitetura e Stack

| Camada | Tecnologia |
| --- | --- |
| Aplicativo Mobile | React Native (Expo) + TypeScript |
| Back-end | Node.js + Express |
| Banco de Dados | MySQL 8.0 |
| Camada de IA | Anthropic Claude API |
| Dados Climáticos | Open-Meteo API |
| Versionamento | Git + GitHub |

---

## 🚀 Como Iniciar o Projeto

### 1. Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 20 LTS** — recomendado via [nvm](https://github.com/nvm-sh/nvm) (ou nvm-windows). Versões mais novas, como a 24, podem apresentar incompatibilidades com o Metro bundler;
- **MySQL 8.0** em execução na sua máquina;
- Aplicativo **Expo Go** no smartphone (Google Play ou App Store) ou um emulador configurado.

### 2. Clonar o Repositório

```bash
git clone https://github.com/nanacssousa/Plataforma-SaoCamilo.git
cd Plataforma-SaoCamilo
```

### 3. Configurar o Banco de Dados

Crie o banco no MySQL e execute o script de seed para popular as tabelas iniciais:

```sql
CREATE DATABASE saocamilo;
```

> Em seguida, rode o arquivo de seed do projeto para criar e popular as tabelas.

### 4. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do back-end com as credenciais do banco e as chaves de API:

```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=saocamilo

ANTHROPIC_API_KEY=sua_chave_da_api
```

### 5. Instalar Dependências e Rodar

**Back-end:**

```bash
npm install
npm start
```

**Mobile (Expo):**

```bash
npm install
npx expo start -c
```

Após a inicialização do Expo, um **QR Code** será exibido no terminal:

- **No celular:** abra o app **Expo Go** e escaneie o QR Code;
- **No emulador:** pressione `a` (Android) ou `i` (iOS) no terminal.

---

## 👥 Equipe

Projeto desenvolvido por:

- Ayanna Christine Silva de Sousa
- Enzo Pizzoni de Sette
- Felipe Salero Idalgo 
- Julia Bolzan Gnan
- Wesley Daglio Nunes

**Orientação:** Prof. Rudolf Theoderich Buhler

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.

© 2026 — Plataforma São Camilo. Todos os direitos reservados.