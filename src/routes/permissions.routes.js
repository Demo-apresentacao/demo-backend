/**
 * @file permissions.routes.js
 * @description Rotas para gerenciamento de permissões.
 * @module Routes/Permissions
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkPermission } from '../middlewares/checkPermission.middleware.js';

import { getAllPermissions } from '../controllers/permissions.controller.js';


const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Permissions
 *     description: Gerenciamento de permissões
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - per_chave
 *       properties:
 *         per_id:
 *           type: integer
 *           description: ID da permissão
 *           example: 1
 *         per_chave:
 *           type: string
 *           description: Chave única da permissão
 *           example: usuarios.listar
 *         per_descricao:
 *           type: string
 *           description: Descrição da permissão
 *           example: Visualizar lista de usuários
 */

/**
 * Middleware de Segurança
 * Aplica a verificação de token (JWT) para todas as rotas abaixo.
 */
router.use(verifyToken);

router.get(
    '/',
    checkPermission('permissoes.listar'),
    getAllPermissions
);

export default router;