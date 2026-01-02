/**
 * @file agendaServiceStatus.routes.js
 * @description Rotas para gerenciamento das situações (status) dos serviços de agenda.
 * @module Routes/AgendaServiceStatus
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  listAgendaServiceStatus,
  createAgendaServiceStatus,
  updateAgendaServiceStatus,
  deleteAgendaServiceStatus
} from '../controllers/agendaServiceStatus.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: AgendaServiceStatus
 *     description: Gerenciamento de situações/status possíveis para agendamentos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AgendaServiceStatus:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-gerado do status
 *           example: "status_01"
 *         name:
 *           type: string
 *           description: "Nome do status (ex: Agendado, Cancelado)"
 *           example: "Confirmado"
 *         description:
 *           type: string
 *           description: "Descrição detalhada do que este status representa"
 *           example: "Cliente confirmou a presença via mensagem"
 */

router.use(verifyToken);

/**
 * @swagger
 * /agenda-services-status:
 *   get:
 *     summary: Lista todas as situações (status) da agenda
 *     tags:
 *       - AgendaServiceStatus
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de status retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AgendaServiceStatus'
 *       401:
 *         description: Não autorizado
 */
router.get('/', listAgendaServiceStatus);

/**
 * @swagger
 * /agenda-services-status:
 *   post:
 *     summary: Cadastra uma nova situação de serviço
 *     tags:
 *       - AgendaServiceStatus
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendaServiceStatus'
 *     responses:
 *       201:
 *         description: Status criado com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.post('/', createAgendaServiceStatus);

/**
 * @swagger
 * /agenda-services-status/{id}:
 *   patch:
 *     summary: Atualiza uma situação de serviço existente
 *     tags:
 *       - AgendaServiceStatus
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do status a ser atualizado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendaServiceStatus'
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *       404:
 *         description: Status não encontrado
 */
router.patch('/:id', updateAgendaServiceStatus);

/**
 * @swagger
 * /agenda-services-status/{id}:
 *   delete:
 *     summary: Exclui uma situação de serviço
 *     tags:
 *       - AgendaServiceStatus
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do status a ser excluído
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status removido com sucesso
 *       404:
 *         description: Status não encontrado
 */
router.delete('/:id', deleteAgendaServiceStatus);

export default router;
