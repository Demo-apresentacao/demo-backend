// Rotas relacionadas à saúde da API (health check)

import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller.js';

const router = Router();

router.get('/', healthCheck);

export default router;