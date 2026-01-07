/**
 * @file password.routes.js
 * @description Rotas para recuperação de senha (Esqueci minha senha / Resetar).
 * @module Routes/Password
 */

import { Router } from 'express';
import {
  forgotPassword,
  resetPassword
} from '../controllers/password.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Password
 *     description: Fluxo de recuperação de senha
 */

/**
 * @swagger
 * /password/forgot:
 *   post:
 *     summary: Solicita o e-mail de recuperação de senha
 *     description: Rota pública. O usuário envia o e-mail e, se existir, recebe um link com token.
 *     tags:
 *       - Password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: cliente@email.com
 *     responses:
 *       200:
 *         description: E-mail enviado com sucesso (ou simulado por segurança)
 *       404:
 *         description: E-mail não encontrado
 *       500:
 *         description: Erro ao enviar o e-mail
 */
router.post('/forgot', forgotPassword);

/**
 * @swagger
 * /password/reset/{token}:
 *   post:
 *     summary: Redefine a senha usando o token recebido
 *     description: Rota pública. O token vem pela URL e a nova senha pelo corpo da requisição.
 *     tags:
 *       - Password
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de recuperação gerado pelo sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NovaSenhaForte123!
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/reset/:token', resetPassword);

export default router;
