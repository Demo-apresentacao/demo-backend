// Configuração principal do Express
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

// 1. Verifique se o caminho está certo:
// Se o swagger.config.js está na RAIZ e este arquivo está em 'src/', use '../'
import swaggerSpecs from '../swagger.config.js'; 

// Só carrega .env se NÃO for produção
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Inicializa conexão com o banco
import './config/db.js';

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://urban-front-2.vercel.app" // Sua URL de produção do Front
];

// 2. Atualização Importante no CORS
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
  // ADICIONE ISSO: Permite que o Front envie o Token no header
  allowedHeaders: ['Content-Type', 'Authorization'], 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Rota para a documentação (Pode ficar aqui ou depois das rotas, tanto faz)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rotas
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
import healthRoutes from './routes/health.routes.js';

// Rota de healthcheck (Keep-Alive)
app.use('/health', healthRoutes);

app.use('/users', usersRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/services', servicesRoutes);
app.use('/availability', availabilityRoutes);
app.use('/unavailability', unavailabilityRoutes);
app.use('/vehicle-users', vehicleUsersRoutes);
app.use('/agenda-services', agendaServicesRoutes);
app.use('/agenda-services-status', agendaServiceStatusRoutes); // Ajustei o nome para bater com o padrão
app.use('/appointments', appointmentsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/service-categories', serviceCategoriesRoutes);
app.use('/brands', brandsRoutes);
app.use('/models', modelsRoutes);

// 3. MUDANÇA RECOMENDADA: Prefixo '/auth'
// No frontend chamamos api.post('/auth/login'). 
// Se deixar '/login', o front teria que chamar api.post('/login') ou api.post('/login/').
app.use('/auth', loginRoutes); 

// Mantive o padrão, mas verifique se suas rotas de dashboard começam com '/' ou '/dashboard'
app.use('/api/dashboard', dashboardRoutes); 

// Middleware global de erro
import { errorHandler } from './middlewares/error.middleware.js';
app.use(errorHandler);

export default app;