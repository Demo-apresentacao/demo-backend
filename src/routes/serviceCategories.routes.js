/**
 * @file serviceCategories.routes.js
 * @description Rotas para gerenciamento das categorias de serviços.
 * @module Routes/ServiceCategories
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory
} from '../controllers/serviceCategories.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: ServiceCategories
 *     description: Gerenciamento de categorias de serviços
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ServiceCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID da categoria de serviço
 *           example: "serv_cat_01"
 *         name:
 *           type: string
 *           description: Nome da categoria de serviço
 *           example: "Lavagem"
 *         description:
 *           type: string
 *           description: Descrição da categoria
 *           example: "Serviços de lavagem e limpeza"
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /service-categories:
 *   get:
 *     summary: Lista todas as categorias de serviços
 *     tags:
 *       - ServiceCategories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ServiceCategory'
 *       401:
 *         description: Não autorizado
 */
router.get('/', listServiceCategories);

/**
 * @swagger
 * /service-categories:
 *   post:
 *     summary: Cadastra uma nova categoria de serviço
 *     tags:
 *       - ServiceCategories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceCategory'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', createServiceCategory);

/**
 * @swagger
 * /service-categories/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma categoria de serviço
 *     tags:
 *       - ServiceCategories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria de serviço
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceCategory'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.patch('/:id', updateServiceCategory);

/**
 * @swagger
 * /service-categories/{id}:
 *   delete:
 *     summary: Remove uma categoria de serviço
 *     tags:
 *       - ServiceCategories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria de serviço
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', deleteServiceCategory);

export default router;
