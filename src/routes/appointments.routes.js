/**
 * @file appointments.routes.js
 * @description Rotas para gerenciamento de agendamentos (consultas/compromissos).
 * @module Routes/Appointments
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment
} from '../controllers/appointments.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Gerenciamento de agendamentos (consultas/compromissos)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - user_id
 *         - date_time
 *       properties:
 *         id:
 *           type: string
 *           description: ID do agendamento
 *           example: "appt_01"
 *         user_id:
 *           type: string
 *           description: ID do usuário
 *           example: "user_01"
 *         date_time:
 *           type: string
 *           format: date-time
 *           description: "Data e hora do agendamento"
 *           example: "2024-12-30T15:00:00.000Z"
 *         status:
 *           type: string
 *           description: "Status do agendamento (agendado, cancelado, concluído)"
 *           example: "agendado"
 *         notes:
 *           type: string
 *           description: Observações adicionais
 *           example: "Cliente solicitou atendimento rápido"
 */

/**
 * Middleware de Segurança
 * Aplica a verificação de token (JWT) para todas as rotas abaixo.
 */
router.use(verifyToken);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Não autorizado
 */
router.get('/', listAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Busca um agendamento específico pelo ID
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Agendamento não encontrado
 */
router.get('/:id', getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza os dados de um agendamento existente
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *       404:
 *         description: Agendamento não encontrado
 */
router.put('/:id', updateAppointment);

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancela um agendamento
 *     description: "Rota específica para alteração de status do agendamento para cancelado"
 *     tags:
 *       - Appointments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do agendamento a ser cancelado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 *       404:
 *         description: Agendamento não encontrado
 */
router.patch('/:id/cancel', cancelAppointment);

export default router;
