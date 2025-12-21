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

app.use('/health', healthRoutes);
app.use('/users', usersRoutes);
app.use('/vehicles', vehiclesRoutes);

// Middleware de erro
import { errorHandler } from './middlewares/error.middleware.js';
app.use(errorHandler);

export default app;