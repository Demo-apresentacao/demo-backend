# Demo Backend 🚀

O **Demo Backend** é uma API RESTful de alta performance desenvolvida para gerenciar um ecossistema completo de **serviços automotivos**, **agendamentos**, **gestão de frota** e **controle de usuários**.

A aplicação foi projetada para atender cenários reais de oficinas, centros automotivos e plataformas digitais que necessitam de **organização operacional**, **segurança**, **escalabilidade** e **facilidade de integração** com sistemas externos.

Construído com **Node.js** e a versão mais recente do **Express**, o projeto adota uma arquitetura **modular**, **bem desacoplada** e orientada a boas práticas de desenvolvimento, facilitando manutenção, evolução contínua e testes.  

O backend oferece suporte a autenticação segura via **JWT**, controle de permissões, documentação interativa com **Swagger**, integração com serviços de e-mail transacional e proteção contra ataques comuns, tornando-o adequado tanto para ambientes de **desenvolvimento** quanto de **produção**.

<br>

## 🛠️ Tecnologias e Dependências

### 🔹 Core
- **Node.js** (ES Modules)
- **Express 5.x** — Framework web rápido e minimalista
- **PostgreSQL (pg)** — Persistência de dados relacional

### 🔐 Segurança e Autenticação
- **JWT (JSON Web Token)** — Autenticação baseada em tokens
- **Bcrypt** — Hash seguro de senhas
- **Helmet** — Proteção de headers HTTP
- **Express Rate Limit** — Prevenção contra força bruta e DoS
- **CORS** — Controle de acesso entre origens

### 📚 Utilitários e Documentação
- **Swagger UI & JSDoc** — Documentação interativa da API
- **Resend** — Envio de e-mails transacionais
- **Dotenv** — Gerenciamento de variáveis de ambiente
- **Nodemon** — Hot reload em desenvolvimento

<br>

## 📁 Estrutura de Pastas

```text
├── src/
│   ├── config/          # Configurações de banco e serviços externos
│   ├── controllers/     # Regras de negócio (Auth, Serviços, Agendamentos)
│   ├── middlewares/     # Autenticação, validações e erros
│   ├── routes/          # Endpoints da API
│   ├── utils/           # Helpers (senha, e-mail, responses)
│   ├── app.js           # Configuração do Express
│   └── server.js        # Inicialização da aplicação
└── swagger.config.js    # Configuração do Swagger
```

<br>

## 🚀 Instalação e Execução

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Demo-apresentacao/demo-backend.git
cd demo-backend
npm install
```
<br>
### 2️⃣ Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`  
e configure as credenciais do banco de dados e serviços externos.

### 3️⃣ Executar a Aplicação

**Ambiente de Desenvolvimento**
```bash
npm run dev
```

**Ambiente de Produção**
```bash
npm start
```
<br>

## 📖 Documentação da API

A documentação interativa da API (Swagger) está disponível em:

```
http://localhost:PORTA/api-docs
```

<br>



## 🛡️ Segurança

A API implementa boas práticas de segurança, incluindo:

- 🔒 **Criptografia** — Senhas nunca são armazenadas em texto plano
- 🔑 **Proteção de Rotas** — Validação de JWT em endpoints sensíveis
- 🧼 **Sanitização** — Headers seguros (Helmet) e limitação de requisições por IP
<br>
<br>


## 👨‍💻 Desenvolvedores

### Matheus Mota Tonini
- GitHub: https://github.com/motaxyz  
- LinkedIn: https://www.linkedin.com/in/matheusmotatonini/

### Nei Junio Nogueira Gomes
- GitHub: https://github.com/NeiJunio  
- LinkedIn: https://www.linkedin.com/in/nei-junio-nogueira-gomes/

<br>

© 2026 - **Demo Apresentação**


