/**
 * @file vehicles.routes.js
 * @description Rotas para gerenciamento de veículos.
 * @module Routes/Vehicles
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/checkPermission.middleware.js';

import {
  listVehicles,
  getVehicleById,
  createVehicle,
  deleteVehicle,
  updateVehicleByAdmin,
  toggleVehicleStatus
} from '../controllers/vehicles.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Vehicles
 *     description: Gerenciamento de veículos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       required:
 *         - plate
 *         - model
 *       properties:
 *         id:
 *           type: string
 *           example: "veic_01"
 *         plate:
 *           type: string
 *           example: "ABC-1234"
 *         model:
 *           type: string
 *           example: "Onix"
 *         brand:
 *           type: string
 *           example: "Chevrolet"
 *         year:
 *           type: integer
 *           example: 2022
 *         active:
 *           type: boolean
 *           example: true
 */

/**
 * Middleware de Segurança
 * Aplica verificação de token (JWT) para todas as rotas abaixo.
 */
router.use(verifyToken);

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Lista todos os veículos cadastrados
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de veículos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
router.get(
  '/',
  checkPermission('veiculos.listar'),
  listVehicles
);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Busca um veículo pelo ID
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Veículo encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Veículo não encontrado
 */
router.get(
  '/:id',
  checkPermission('veiculos.visualizar'),
  getVehicleById
);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Cadastra um novo veículo
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       201:
 *         description: Veículo criado com sucesso
 */
router.post(
  '/',
  checkPermission('veiculos.criar'),
  createVehicle
);

/**
 * @swagger
 * /vehicles/{veic_id}:
 *   patch:
 *     summary: Atualiza dados de um veículo
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: veic_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Veículo atualizado com sucesso
 *       404:
 *         description: Veículo não encontrado
 */
router.patch(
  '/:veic_id',
  checkPermission('veiculos.editar'),
  updateVehicleByAdmin
);

/**
 * @swagger
 * /vehicles/{veic_id}/status:
 *   patch:
 *     summary: Ativa ou desativa um veículo
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: veic_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status do veículo alterado com sucesso
 *       404:
 *         description: Veículo não encontrado
 */
router.patch(
  '/:veic_id/status',
  checkPermission('veiculos.inativar'),
  toggleVehicleStatus
);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Remove um veículo do sistema
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Veículo removido com sucesso
 *       404:
 *         description: Veículo não encontrado
 */
router.delete(
  '/:id',
  checkPermission('veiculos.inativar'),
  deleteVehicle
);

export default router;