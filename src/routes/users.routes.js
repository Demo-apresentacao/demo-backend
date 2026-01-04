/**
 * @file users.routes.js
 * @description Rotas para gerenciamento de usuários do sistema.
 * @module Routes/Users
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import { 
  listUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  updateUserStatus,
  deleteUser,
  getUserVehicles
} from '../controllers/users.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gerenciamento de usuários do sistema
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
router.post('/', createUser);


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           example: "user_01"
 *         name:
 *           type: string
 *           example: "João Silva"
 *         email:
 *           type: string
 *           example: "joao@email.com"
 *         active:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-01-01T10:00:00.000Z"
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários cadastrados
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', listUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém os dados de um usuário pelo ID
 *     tags:
 *       - Users
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
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', getUserById);


/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Atualiza parcialmente os dados de um usuário
 *     tags:
 *       - Users
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.patch('/:id', updateUser);

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Ativa ou desativa um usuário
 *     tags:
 *       - Users
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
 *         description: Status do usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.patch('/:id/status', updateUserStatus);

/**
 * @swagger
 * /users/{id}/vehicles:
 *   get:
 *     summary: Lista os veículos associados a um usuário
 *     tags:
 *       - Users
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
 *         description: Lista de veículos retornada com sucesso
 */
router.get('/:id/vehicles', getUserVehicles);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário do sistema
 *     tags:
 *       - Users
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
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', deleteUser);

export default router;
