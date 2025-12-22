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

app.use('/health', healthRoutes); // Health check da API
app.use('/users', usersRoutes); // Usuários
app.use('/vehicles', vehiclesRoutes); // Veículos
app.use('/services', servicesRoutes); // Serviços
app.use('/availability', availabilityRoutes); // Disponibilidade
app.use('/unavailability', unavailabilityRoutes); // Indisponibilidade
app.use('/vehicle-users', vehicleUsersRoutes); // Associação veículo-usuário

// Middleware global de erro
import { errorHandler } from './middlewares/error.middleware.js';
app.use(errorHandler);

export default app;