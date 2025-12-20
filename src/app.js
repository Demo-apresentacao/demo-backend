import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
import healthRoutes from './routes/health.routes.js';
app.use('/health', healthRoutes);

import { errorHandler } from './middlewares/error.middleware.js';

app.use(errorHandler);

export default app;