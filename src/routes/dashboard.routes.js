/**
 * @file dashboard.routes.js
 * @description Rotas para obtenção de dados e estatísticas do painel principal (Dashboard).
 * @module Routes/Dashboard
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import { getDashboardStats } from '../controllers/dashboard.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Dashboard
 *     description: Estatísticas e métricas do painel principal
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Retorna estatísticas gerais do dashboard
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estatísticas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                   example: 120
 *                 totalAppointments:
 *                   type: integer
 *                   example: 45
 *                 totalRevenue:
 *                   type: number
 *                   example: 15230.50
 *       401:
 *         description: Não autorizado
 */
router.get('/stats', getDashboardStats);

export default router;
