

# Agente de IA Adaptável: Guia Completo de Implementação e Deployment

## 1. Introdução

Este documento fornece um guia abrangente para a implementação e deployment de um **Agente de IA Adaptável**. O objetivo é criar uma solução funcional e facilmente configurável, permitindo que o usuário integre seu próprio token de IA e personalize o prompt do agente. A arquitetura é dividida em um servidor de backend (MCP) para gerenciar a lógica da IA e uma interface web interativa para a interação do usuário.

## 2. Arquitetura do Sistema

O Agente de IA Adaptável é composto por três componentes principais que trabalham em conjunto para fornecer uma experiência de conversação inteligente e contextualizada:

### 2.1. Servidor MCP (Backend)

O **Model Context Protocol (MCP) Server** atua como o cérebro do agente. Desenvolvido em Python utilizando o framework Flask, ele é responsável por:

*   **Receber e Processar Requisições:** Intercepta as mensagens do usuário enviadas pela interface web.
*   **Gerenciamento de Contexto:** Mantém um histórico das conversas para cada usuário, garantindo que as respostas da IA sejam coerentes e relevantes ao longo do diálogo. Isso é crucial para a capacidade do agente de "lembrar" interações anteriores.
*   **Interação com APIs de IA:** Conecta-se a modelos de linguagem grandes (LLMs) externos, como OpenAI, enviando o contexto da conversa e recebendo as respostas geradas.
*   **Configuração Dinâmica:** Permite a configuração em tempo de execução de chaves de API e prompts do sistema, tornando o agente altamente adaptável a diferentes modelos e personas.

### 2.2. Modelo de Linguagem Grande (LLM)

O sistema é projetado para ser **agnóstico ao LLM**, o que significa que pode ser facilmente adaptado para funcionar com diferentes provedores de IA que ofereçam uma API compatível (por exemplo, OpenAI, Google Gemini, etc.). A comunicação é feita via API, onde o servidor MCP envia o histórico da conversa e o prompt do sistema para o LLM, que então gera uma resposta.

### 2.3. Interface Web (Frontend)

A interface do usuário é construída com **React**, HTML, CSS e JavaScript, proporcionando uma experiência interativa e responsiva. Suas principais funcionalidades incluem:

*   **Chat Interativo:** Um campo de entrada para o usuário digitar mensagens e uma área de exibição para o histórico da conversa.
*   **Configurações:** Uma seção dedicada onde o usuário pode inserir sua chave de API da IA, personalizar o prompt inicial do agente e definir a URL do backend.
*   **Gerenciamento de Conversa:** Botões para enviar mensagens e resetar o contexto da conversa, permitindo iniciar um novo diálogo a qualquer momento.
*   **Design Moderno:** Utiliza componentes Shadcn/UI e Tailwind CSS para um visual limpo e profissional.

## 3. Pré-requisitos

Para configurar e executar o Agente de IA Adaptável, você precisará dos seguintes softwares instalados em seu sistema:

*   **Python 3.8+:** Para o servidor backend.
*   **Node.js 18+:** Para o ambiente de desenvolvimento frontend (React).
*   **pnpm:** Um gerenciador de pacotes rápido e eficiente para Node.js (alternativa ao npm/yarn).
*   **Chave de API de um LLM:** Uma chave de API válida de um provedor de IA (ex: OpenAI) para que o agente possa gerar respostas. Você pode obter uma chave de API da OpenAI em [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

## 4. Configuração e Execução do Backend (Servidor MCP)

Siga os passos abaixo para configurar e iniciar o servidor MCP:

### 4.1. Navegar para o Diretório do Projeto

Primeiro, navegue até o diretório `agente_ia` onde os arquivos do backend estão localizados:

```bash
cd agente_ia
```

### 4.2. Instalar Dependências

Instale as bibliotecas Python necessárias usando `pip`:

```bash
pip3 install -r requirements.txt
```

### 4.3. Configurar a Chave da API da IA

O servidor utiliza um arquivo `.env` para carregar a chave da API do OpenAI. Você deve ter um arquivo chamado `.env` no diretório `agente_ia` com o seguinte conteúdo:

```
OPENAI_API_KEY="SUA_CHAVE_OPENAI_AQUI"
```

**Substitua `"SUA_CHAVE_OPENAI_AQUI"` pela sua chave de API real da OpenAI.**

Alternativamente, você pode definir a chave da API diretamente na interface web do frontend, que sobrescreverá a variável de ambiente para a sessão atual.

### 4.4. Executar o Servidor Backend

Inicie o servidor Flask. Ele será executado na porta `5000` por padrão:

```bash
python3 app.py
```

Você verá uma mensagem indicando que o servidor está rodando, geralmente em `http://127.0.0.1:5000` ou `http://0.0.0.0:5000`.

## 5. Configuração e Execução do Frontend (Interface Web)

Siga os passos abaixo para configurar e iniciar a interface web:

### 5.1. Navegar para o Diretório do Frontend

Em um novo terminal, navegue até o diretório da interface web:

```bash
cd agente_ia/agente-ia-interface
```

### 5.2. Instalar Dependências

Instale as dependências do Node.js usando `pnpm`:

```bash
pnpm install
```

### 5.3. Executar o Servidor de Desenvolvimento do Frontend

Inicie o servidor de desenvolvimento do React. Ele geralmente será executado na porta `5173`:

```bash
pnpm run dev --host
```

O `--host` permite que a aplicação seja acessível externamente, o que é útil para testes em diferentes dispositivos ou para deployment.

Abra seu navegador e acesse a URL fornecida (ex: `http://localhost:5173`).

## 6. Utilização do Agente de IA

Ao acessar a interface web, você poderá interagir com o agente:

1.  **Configurar Chave da API e Prompt:** Clique no ícone de engrenagem (⚙️) no canto superior direito para abrir as configurações. Insira sua chave de API da OpenAI e personalize o prompt do agente. Certifique-se de que a **URL do Backend** esteja correta (padrão: `http://localhost:5000`). Clique em "Salvar Configurações".
2.  **Iniciar Conversa:** Digite sua mensagem no campo de texto na parte inferior e pressione Enter ou clique no botão de envio (✈️).
3.  **Gerenciamento de Contexto:** O agente manterá o contexto da conversa automaticamente. Se desejar iniciar uma nova conversa do zero, clique no ícone de lixeira (🗑️) para resetar o contexto.

## 7. Deployment

Para tornar seu Agente de IA Adaptável acessível publicamente, você precisará implantar tanto o backend quanto o frontend.

### 7.1. Deployment do Backend (Servidor MCP)

O servidor Flask pode ser implantado em várias plataformas. Algumas opções populares incluem:

*   **Heroku:** Uma plataforma PaaS (Platform as a Service) que facilita o deployment de aplicações Python. Você precisaria de um `Procfile` e possivelmente um `gunicorn` para servir a aplicação.
*   **Render:** Outra PaaS similar ao Heroku, com bom suporte para aplicações Python.
*   **VPS (Servidor Privado Virtual):** Para maior controle, você pode implantar em um VPS (ex: DigitalOcean, AWS EC2, Google Cloud Compute Engine) usando um servidor web como Nginx ou Apache e um WSGI como Gunicorn.
*   **Vercel/Netlify Functions:** Para cenários serverless, você pode adaptar o Flask para rodar como uma função serverless, embora isso exija algumas modificações.

**Exemplo Básico de Deployment com Gunicorn (para VPS ou Docker):**

1.  **Instale Gunicorn:**
    ```bash
pip3 install gunicorn
    ```
2.  **Crie um `Procfile` (para Heroku/Render) ou execute diretamente:**
    ```
web: gunicorn app:app -w 4 -b 0.0.0.0:5000
    ```
    Isso iniciará o servidor Flask usando Gunicorn com 4 workers na porta 5000.

### 7.2. Deployment do Frontend (Interface Web)

A aplicação React é uma aplicação estática após a construção e pode ser hospedada em serviços de hospedagem estática ou junto com o backend.

*   **Vercel:** Ótima para aplicações React, oferece deployment contínuo a partir do GitHub.
*   **Netlify:** Similar ao Vercel, com fácil integração e CDN global.
*   **GitHub Pages:** Uma opção gratuita para projetos pessoais ou de código aberto.
*   **Firebase Hosting:** Para projetos que já utilizam o ecossistema Firebase.
*   **Junto com o Backend:** Você pode configurar seu servidor Flask para servir os arquivos estáticos do React após a construção.

**Passos para Construir o Frontend:**

1.  No diretório `agente_ia/agente-ia-interface`, execute o comando de build:
    ```bash
pnpm run build
    ```
2.  Isso criará uma pasta `dist` com os arquivos estáticos otimizados para produção. Você pode então fazer o upload do conteúdo desta pasta para o seu serviço de hospedagem estática preferido.

## 8. Considerações de Segurança

*   **Chaves de API:** Nunca exponha suas chaves de API diretamente no código frontend ou em repositórios públicos. Use variáveis de ambiente e garanta que o backend as carregue de forma segura.
*   **Validação de Entrada:** Implemente validação robusta para todas as entradas do usuário no backend para prevenir ataques como injeção de prompt.
*   **Gerenciamento de Sessão:** Em um ambiente de produção, o gerenciamento de contexto de conversa (`conversation_history`) deve ser persistente e seguro, utilizando bancos de dados ou serviços de cache (Redis) em vez de variáveis em memória do servidor Flask.

## 9. Funcionalidades Futuras e Melhorias

*   **Suporte a Múltiplos LLMs:** Adicionar opções para escolher entre diferentes modelos de IA (Gemini, Claude, etc.) diretamente na interface.
*   **Personalização Avançada:** Permitir que o usuário salve diferentes prompts e configurações de agente.
*   **Autenticação de Usuários:** Implementar um sistema de login para gerenciar contextos de conversa de forma mais segura e personalizada.
*   **Streaming de Respostas:** Melhorar a experiência do usuário exibindo as respostas da IA em tempo real, à medida que são geradas.
*   **Integração com Ferramentas (Tools):** Expandir o servidor MCP para incluir a capacidade do agente de usar ferramentas externas (pesquisa na web, calculadoras, etc.) para responder a perguntas mais complexas.

---

**Autor:** Manus AI
**Data:** 10 de Outubro de 2025

