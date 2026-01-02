/**
 * @file categories.routes.js
 * @description Rotas para gerenciamento de categorias.
 * @module Routes/Categories
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Gerenciamento de categorias
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID da categoria
 *           example: "cat_01"
 *         name:
 *           type: string
 *           description: Nome da categoria
 *           example: "SUV"
 *         description:
 *           type: string
 *           description: Descrição da categoria
 *           example: "Veículos utilitários esportivos"
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista todas as categorias
 *     tags:
 *       - Categories
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
 *                 $ref: '#/components/schemas/Category'
 *       401:
 *         description: Não autorizado
 */
router.get('/', listCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cadastra uma nova categoria
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma categoria existente
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.patch('/:id', updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', deleteCategory);

export default router;
