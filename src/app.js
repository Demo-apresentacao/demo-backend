// Configuração principal do Express
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Só carrega .env se NÃO for produção
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Inicializa conexão com o banco
import './config/db.js';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas
import healthRoutes from './routes/health.routes.js';
import usersRoutes from './routes/users.routes.js';
import vehiclesRoutes from './routes/vehicles.routes.js';
import servicesRoutes from './routes/services.routes.js';
import availabilityRoutes from './routes/availability.routes.js';
import unavailabilityRoutes from './routes/unavailability.routes.js';
import vehicleUsersRoutes from './routes/vehicleUsers.routes.js';
import agendaServicesRoutes from './routes/agendaServices.routes.js';
import agendaServiceStatusRoutes from './routes/agendaServiceStatus.routes.js';
import agendamentosRoutes from './routes/agendamentos.routes.js';
import categoriesRoutes from './routes/categories.routes.js';
import serviceCategoriesRoutes from './routes/serviceCategories.routes.js';
import brandsRoutes from './routes/brands.routes.js';
import modelsRoutes from './routes/models.routes.js';

app.use('/health', healthRoutes); // Health check da API
app.use('/users', usersRoutes); // Usuários
app.use('/vehicles', vehiclesRoutes); // Veículos
app.use('/services', servicesRoutes); // Serviços
app.use('/availability', availabilityRoutes); // Disponibilidade
app.use('/unavailability', unavailabilityRoutes); // Indisponibilidade
app.use('/vehicle-users', vehicleUsersRoutes); // Associação veículo-usuário
app.use('/agenda-services', agendaServicesRoutes); // Agenda de serviços
app.use('/agenda-services-status', agendaServiceStatusRoutes); // Situações da agenda de serviços
app.use('/agendamentos', agendamentosRoutes); // Agendamentos
app.use('/categories', categoriesRoutes); // Categorias
app.use('/service-categories', serviceCategoriesRoutes); // Categorias de serviços
app.use('/brands', brandsRoutes); // Marcas
app.use('/models', modelsRoutes); // Modelos

// Middleware global de erro
import { errorHandler } from './middlewares/error.middleware.js';
app.use(errorHandler);

export default app;