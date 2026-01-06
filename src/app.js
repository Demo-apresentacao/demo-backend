// Configuração principal do Express
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import swaggerSpecs from '../swagger.config.js'; 

// Só carrega .env se NÃO for produção
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Inicializa conexão com o banco
import './config/db.js';

const app = express();

// [SEGURANÇA] Confia no proxy do Render para obter o IP real do usuário.
// Essencial para o Rate Limiting funcionar corretamente atrás de Load Balancers.
app.set('trust proxy', 1);

// [SEGURANÇA] Helmet adiciona cabeçalhos de proteção HTTP (XSS, Sniffing, etc)
app.use(helmet());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://urban-front-2.vercel.app" // URL de produção do Front
];

// Configuração do CORS
app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sem origin (Postman, Render healthcheck etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  // Permite que o Front envie o Token no header Authorization
  allowedHeaders: ['Content-Type', 'Authorization'], 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// [SEGURANÇA] Limiter Geral (Para todas as rotas)
// Proteção contra ataques de negação de serviço (DoS) simples
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requests por IP neste intervalo
  standardHeaders: true, 
  legacyHeaders: false,
  message: "Muitas requisições criadas a partir deste IP, tente novamente mais tarde."
});

// Aplica o limiter geral na aplicação toda
app.use(globalLimiter);

// [SEGURANÇA] Limiter Específico para Login (Proteção contra Brute Force)
// Regra mais rígida apenas para tentativas de autenticação
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Apenas 5 tentativas neste intervalo
  message: {
    status: 'error',
    message: "Muitas tentativas de login. Tente novamente em 15 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());

// Documentação da API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Importação de Rotas
import usersRoutes from './routes/users.routes.js';
import vehiclesRoutes from './routes/vehicles.routes.js';
import servicesRoutes from './routes/services.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import unavailabilityRoutes from './routes/unavailability.routes.js';
import vehicleUsersRoutes from './routes/vehicleUsers.routes.js';
import agendaServicesRoutes from './routes/agendaServices.routes.js';
import agendaServiceStatusRoutes from './routes/agendaServiceStatus.routes.js';
import appointmentsRoutes from './routes/appointments.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import serviceCategoriesRoutes from './routes/serviceCategories.routes.js';
import brandsRoutes from './routes/brands.routes.js';
import modelsRoutes from './routes/models.routes.js';
import loginRoutes from './routes/login.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

// Definição das Rotas
app.use('/users', usersRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/services', servicesRoutes);
app.use('/availability', availabilityRoutes);
app.use('/unavailability', unavailabilityRoutes);
app.use('/vehicle-users', vehicleUsersRoutes);
app.use('/agenda-services', agendaServicesRoutes);
app.use('/agenda-services-status', agendaServiceStatusRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/service-categories', serviceCategoriesRoutes);
app.use('/brands', brandsRoutes);
app.use('/models', modelsRoutes);

// Rotas de Autenticação (Aplica o limiter rígido aqui)
app.use('/auth', loginLimiter, loginRoutes); 

// Rotas do Dashboard
app.use('/api/dashboard', dashboardRoutes); 

// Middleware global de erro
import { errorHandler } from './middlewares/error.middleware.js';
app.use(errorHandler);

export default app;


/**
 * ==============================================================================
 * 🛡️ DOCUMENTAÇÃO DE SEGURANÇA DO APP
 * ==============================================================================
 * * 1. RATE LIMITING (BLOQUEIO DE REQUISIÇÕES):
 * -------------------------------------------
 * - Como funciona: O sistema conta requisições por IP dentro de uma janela de tempo (15 min).
 * - Regra Geral: Usuários podem fazer até 100 requisições a cada 15 min.
 * - Regra de Login: Usuários podem errar o login no máximo 5 vezes a cada 15 min.
 * - Bloqueio: Se exceder, recebe erro 429. O desbloqueio é automático após o tempo passar.
 * - Reset Manual: Reiniciar o servidor no Render zera a contagem de todos imediatamente.
 * 
 * * 2. HELMET (CABEÇALHOS HTTP):
 * ----------------------------
 * - O que faz: Adiciona e remove headers HTTP para proteger o app de ataques conhecidos.
 * - Ocultação (Security through Obscurity): Remove o header 'X-Powered-By: Express'. 
 * Isso dificulta que atacantes saibam que seu backend é Node/Express e explorem falhas específicas.
 * - Anti-Clickjacking: Impede que seu site seja aberto dentro de um <iframe> (sites falsos).
 * - XSS & Sniffing: Força o navegador a ser mais rigoroso com scripts e tipos de arquivos.
 * ==============================================================================
 */