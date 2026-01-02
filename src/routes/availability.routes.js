/**
 * @file availability.routes.js
 * @description Rotas para gerenciamento de disponibilidades (horários/agenda).
 * @module Routes/Availability
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listAvailability,
  createAvailability,
  updateAvailability,
  toggleAvailabilityStatus,
  deleteAvailability
} from '../controllers/availability.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Availability
 *     description: Gerenciamento de disponibilidades de horário
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Availability:
 *       type: object
 *       required:
 *         - day_of_week
 *         - start_time
 *         - end_time
 *       properties:
 *         disp_id:
 *           type: string
 *           description: ID da disponibilidade
 *           example: "disp_01"
 *         day_of_week:
 *           type: integer
 *           description: Dia da semana (0 = Domingo, 6 = Sábado)
 *           example: 1
 *         start_time:
 *           type: string
 *           description: Horário inicial
 *           example: "08:00"
 *         end_time:
 *           type: string
 *           description: Horário final
 *           example: "12:00"
 *         active:
 *           type: boolean
 *           description: Indica se a disponibilidade está ativa
 *           example: true
 */

/**
 * Middleware de Segurança
 * Aplica a verificação de token (JWT) para todas as rotas abaixo.
 */
router.use(verifyToken);

/**
 * @swagger
 * /availability:
 *   get:
 *     summary: Lista todas as disponibilidades cadastradas
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de disponibilidades retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Availability'
 *       401:
 *         description: Não autorizado
 */
router.get('/', listAvailability);

/**
 * @swagger
 * /availability:
 *   post:
 *     summary: Cadastra uma nova disponibilidade de horário
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Availability'
 *     responses:
 *       201:
 *         description: Disponibilidade criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', createAvailability);

/**
 * @swagger
 * /availability/{disp_id}:
 *   patch:
 *     summary: Edita os dados de uma disponibilidade existente
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disp_id
 *         required: true
 *         description: ID da disponibilidade
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Availability'
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada com sucesso
 *       404:
 *         description: Disponibilidade não encontrada
 */
router.patch('/:disp_id', updateAvailability);

/**
 * @swagger
 * /availability/status/{disp_id}:
 *   patch:
 *     summary: Alterna o status da disponibilidade (ativa/inativa)
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disp_id
 *         required: true
 *         description: ID da disponibilidade
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status da disponibilidade alterado com sucesso
 *       404:
 *         description: Disponibilidade não encontrada
 */
router.patch('/status/:disp_id', toggleAvailabilityStatus);

/**
 * @swagger
 * /availability/{disp_id}:
 *   delete:
 *     summary: Exclui permanentemente uma disponibilidade
 *     tags:
 *       - Availability
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: disp_id
 *         required: true
 *         description: ID da disponibilidade
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disponibilidade excluída com sucesso
 *       404:
 *         description: Disponibilidade não encontrada
 */
router.delete('/:disp_id', deleteAvailability);

export default router;
