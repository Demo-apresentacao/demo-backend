/**
 * @file vehicleUsers.routes.js
 * @description Rotas para gerenciamento da associação (vínculo) entre usuários e veículos.
 * @module Routes/VehicleUsers
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listVehicleUsers,
  listUsersByVehicle,
  listVehiclesByUser,
  createVehicleUser,
  updateVehicleUser,
  deleteVehicleUser
} from '../controllers/vehicleUsers.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: VehicleUsers
 *     description: Associação entre usuários e veículos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VehicleUser:
 *       type: object
 *       required:
 *         - user_id
 *         - vehicle_id
 *       properties:
 *         id:
 *           type: string
 *           example: "vu_01"
 *         user_id:
 *           type: string
 *           example: "user_01"
 *         vehicle_id:
 *           type: string
 *           example: "veic_01"
 *         role:
 *           type: string
 *           example: "owner"
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /vehicle-users:
 *   get:
 *     summary: Lista todas as associações entre veículos e usuários
 *     tags:
 *       - VehicleUsers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VehicleUser'
 */
router.get('/', listVehicleUsers);

/**
 * @swagger
 * /vehicle-users/vehicle/{vehicleId}:
 *   get:
 *     summary: Lista usuários vinculados a um veículo
 *     tags:
 *       - VehicleUsers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuários vinculados ao veículo
 */
router.get('/vehicle/:vehicleId', listUsersByVehicle);

/**
 * @swagger
 * /vehicle-users/user/{userId}:
 *   get:
 *     summary: Lista veículos vinculados a um usuário
 *     tags:
 *       - VehicleUsers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Veículos vinculados ao usuário
 */
router.get('/user/:userId', listVehiclesByUser);

/**
 * @swagger
 * /vehicle-users:
 *   post:
 *     summary: Cria uma nova associação entre usuário e veículo
 *     tags:
 *       - VehicleUsers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleUser'
 *     responses:
 *       201:
 *         description: Associação criada com sucesso
 */
router.post('/', createVehicleUser);

/**
 * @swagger
 * /vehicle-users/{id}:
 *   patch:
 *     summary: Atualiza uma associação existente
 *     tags:
 *       - VehicleUsers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VehicleUser'
 *     responses:
 *       200:
 *         description: Associação atualizada com sucesso
 */
router.patch('/:id', updateVehicleUser);

/**
 * @swagger
 * /vehicle-users/{id}:
 *   delete:
 *     summary: Remove a associação entre usuário e veículo
 *     tags:
 *       - VehicleUsers
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
 *         description: Associação removida com sucesso
 */
router.delete('/:id', deleteVehicleUser);

export default router;
