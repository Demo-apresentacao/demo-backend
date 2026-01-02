/**
 * @file agendaServices.routes.js
 * @description Definição das rotas para gerenciamento de serviços da agenda.
 * @module Routes/AgendaServices
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listAgendaServices,
  createAgendaService,
  updateAgendaService,
  deleteAgendaService
} from '../controllers/agendaServices.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: AgendaServices
 *     description: Gerenciamento de serviços agendados
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AgendaService:
 *       type: object
 *       required:
 *         - service_id
 *         - date_time
 *       properties:
 *         agend_serv_id:
 *           type: string
 *           description: ID do serviço agendado
 *           example: "agend_01"
 *         service_id:
 *           type: string
 *           description: ID do serviço
 *           example: "serv_01"
 *         date_time:
 *           type: string
 *           format: date-time
 *           description: Data e hora do serviço
 *           example: "2025-01-10T14:00:00.000Z"
 *         status:
 *           type: string
 *           description: Status do agendamento
 *           example: "pendente"
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /agenda-services:
 *   get:
 *     summary: Lista todos os serviços agendados
 *     tags:
 *       - AgendaServices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AgendaService'
 *       401:
 *         description: Não autorizado
 */
router.get('/', listAgendaServices);

/**
 * @swagger
 * /agenda-services:
 *   post:
 *     summary: Cadastra um novo serviço na agenda
 *     tags:
 *       - AgendaServices
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendaService'
 *     responses:
 *       201:
 *         description: Serviço agendado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', createAgendaService);

/**
 * @swagger
 * /agenda-services/{agend_serv_id}:
 *   patch:
 *     summary: Atualiza um serviço agendado existente
 *     tags:
 *       - AgendaServices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agend_serv_id
 *         required: true
 *         description: ID do serviço agendado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendaService'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.patch('/:agend_serv_id', updateAgendaService);

/**
 * @swagger
 * /agenda-services/{agend_serv_id}:
 *   delete:
 *     summary: Remove um serviço agendado
 *     tags:
 *       - AgendaServices
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: agend_serv_id
 *         required: true
 *         description: ID do serviço agendado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço removido com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.delete('/:agend_serv_id', deleteAgendaService);

export default router;
