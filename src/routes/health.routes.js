import { Router } from 'express';
import { checkHealth } from '../controllers/health.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Verificação de status da API (Keep-Alive)
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verifica se a API está online
 *     description: Endpoint utilizado para monitoramento e keep-alive da aplicação
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API online e operante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: API online e operante.
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', checkHealth);

export default router;
