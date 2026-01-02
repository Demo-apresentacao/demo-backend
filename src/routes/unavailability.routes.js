/**
 * @file unavailability.routes.js
 * @description Rotas para gerenciamento de indisponibilidades (bloqueios de agenda).
 * @module Routes/Unavailability
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listUnavailability,
  createUnavailability,
  updateUnavailability,
  toggleUnavailabilityStatus,
  deleteUnavailability
} from '../controllers/unavailability.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Unavailability
 *     description: Gerenciamento de indisponibilidades da agenda
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Unavailability:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *       properties:
 *         id:
 *           type: string
 *           example: "indisp_01"
 *         start_date:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T08:00:00.000Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           example: "2025-01-10T18:00:00.000Z"
 *         reason:
 *           type: string
 *           example: "Feriado"
 *         active:
 *           type: boolean
 *           example: true
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /unavailability:
 *   get:
 *     summary: Lista todas as indisponibilidades cadastradas
 *     tags:
 *       - Unavailability
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de indisponibilidades retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Unavailability'
 */
router.get('/', listUnavailability);

/**
 * @swagger
 * /unavailability:
 *   post:
 *     summary: Cadastra uma nova indisponibilidade na agenda
 *     tags:
 *       - Unavailability
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unavailability'
 *     responses:
 *       201:
 *         description: Indisponibilidade criada com sucesso
 */
router.post('/', createUnavailability);

/**
 * @swagger
 * /unavailability/{indisp_id}:
 *   patch:
 *     summary: Atualiza parcialmente uma indisponibilidade
 *     tags:
 *       - Unavailability
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: indisp_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Unavailability'
 *     responses:
 *       200:
 *         description: Indisponibilidade atualizada com sucesso
 *       404:
 *         description: Indisponibilidade não encontrada
 */
router.patch('/:indisp_id', updateUnavailability);

/**
 * @swagger
 * /unavailability/{indisp_id}/status:
 *   patch:
 *     summary: Ativa ou desativa uma indisponibilidade
 *     tags:
 *       - Unavailability
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: indisp_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status da indisponibilidade alterado com sucesso
 *       404:
 *         description: Indisponibilidade não encontrada
 */
router.patch('/:indisp_id/status', toggleUnavailabilityStatus);

/**
 * @swagger
 * /unavailability/{indisp_id}:
 *   delete:
 *     summary: Remove uma indisponibilidade da agenda
 *     tags:
 *       - Unavailability
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: indisp_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Indisponibilidade removida com sucesso
 *       404:
 *         description: Indisponibilidade não encontrada
 */
router.delete('/:indisp_id', deleteUnavailability);

export default router;
