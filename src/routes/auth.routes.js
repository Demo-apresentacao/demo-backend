/**
 * @file auth.routes.js
 * @description Rotas de autenticação e permissões.
 * @module Routes/Auth
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { login, getMe } from '../controllers/auth.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação e controle de permissões
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - senha
 *       properties:
 *         email:
 *           type: string
 *           example: usuario@email.com
 *         senha:
 *           type: string
 *           example: 123456
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 85
 *         nome:
 *           type: string
 *           example: Administrador
 *         email:
 *           type: string
 *           example: admin@email.com
 *         permissoes:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - models.listar
 *             - models.criar
 *             - models.editar
 *             - models.excluir
 */

/**
 * ======================================================
 * LOGIN
 * ======================================================
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna token JWT
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', login);


/**
 * ======================================================
 * USUÁRIO AUTENTICADO + PERMISSÕES
 * ======================================================
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna dados do usuário autenticado com permissões
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Não autorizado
 */
router.get('/me', verifyToken, getMe);

export default router;