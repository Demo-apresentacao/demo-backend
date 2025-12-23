import { Router } from 'express';
import { login } from '../controllers/login.controller.js';

const router = Router();

/**
 * POST /auth/login
 * Realiza o login do usuário
 */
router.post('/', login);

export default router;
