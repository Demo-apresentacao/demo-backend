# Urban Backend 🚗✨

Backend do sistema **Urban**, uma plataforma web de agendamentos voltada para estética automotiva.

Este projeto foi estruturado com foco em **organização, escalabilidade e boas práticas**, servindo como base para um produto real (não apenas um projeto acadêmico).

---

## 📌 Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL (Neon – futuramente)
- JavaScript (ES Modules)
- Nodemon
- Dotenv

---

## 📂 Estrutura do projeto

```txt
src/
├─ config/        # Configurações globais (ex: banco de dados)
├─ routes/        # Definição das rotas da API
├─ controllers/   # Controllers (req/res)
├─ services/      # Regras de negócio
├─ middlewares/   # Middlewares (auth, erros, etc)
├─ utils/         # Funções utilitárias reutilizáveis
│
├─ app.js         # Configuração do Express
└─ server.js      # Inicialização do servidor

Arquitetura

O projeto segue uma separação clara de responsabilidades:
Routes: apenas definem os endpoints
Controllers: recebem a requisição e retornam a resposta
Services: concentram a regra de negócio
Config: infraestrutura (banco, variáveis)
Middlewares: autenticação, tratamento de erros
Utils: funções auxiliares

Essa abordagem facilita:
Manutenção
Escalabilidade
Testes
Evolução para modelo SaaS


▶️ Como rodar o projeto localmente
1. Instalar dependências
npm install

2. Criar arquivo .env
PORT=3000
# DATABASE_URL será configurado futuramente

3. Rodar em modo desenvolvimento
npm run dev


Servidor disponível em:

http://localhost:3000

🔍 Rota de teste (health check)
GET /health


Resposta esperada:

{
  "status": "ok",
  "message": "API is running"
}

