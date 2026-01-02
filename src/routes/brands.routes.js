/**
 * @file brands.routes.js
 * @description Rotas para gerenciamento de marcas (brands).
 * @module Routes/Brands
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listBrands,
  listBrandsByCategory,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brands.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Brands
 *     description: Gerenciamento de marcas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID da marca
 *           example: "brand_01"
 *         name:
 *           type: string
 *           description: Nome da marca
 *           example: "Toyota"
 *         category_id:
 *           type: string
 *           description: ID da categoria associada
 *           example: "cat_01"
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Lista todas as marcas
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de marcas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Não autorizado
 */
router.get('/', listBrands);

/**
 * @swagger
 * /brands/category/{cat_id}:
 *   get:
 *     summary: Lista marcas por categoria
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cat_id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista filtrada por categoria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/category/:cat_id', listBrandsByCategory);

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Cadastra uma nova marca
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       201:
 *         description: Marca criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', createBrand);

/**
 * @swagger
 * /brands/{id}:
 *   patch:
 *     summary: Atualiza parcialmente uma marca existente
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da marca
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       200:
 *         description: Marca atualizada com sucesso
 *       404:
 *         description: Marca não encontrada
 */
router.patch('/:id', updateBrand);

/**
 * @swagger
 * /brands/{id}:
 *   delete:
 *     summary: Exclui uma marca
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da marca
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Marca removida com sucesso
 *       404:
 *         description: Marca não encontrada
 */
router.delete('/:id', deleteBrand);

export default router;
