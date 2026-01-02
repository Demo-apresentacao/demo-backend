/**
 * @file login.routes.js
 * @description Rotas para autenticação e login de usuários.
 * @module Routes/Login
 */

import { Router } from 'express';
import { login } from '../controllers/login.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Autenticação e geração de token JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "usuario@email.com"
 *         password:
 *           type: string
 *           example: "123456"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT de acesso
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "user_01"
 *             name:
 *               type: string
 *               example: "João Silva"
 *             email:
 *               type: string
 *               example: "usuario@email.com"
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login e retorna um token JWT
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
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/', login);

export default router;
