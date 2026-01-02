/**
 * @file models.routes.js
 * @description Rotas para gerenciamento de modelos.
 * @module Routes/Models
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  getAllModels,
  getModelsByBrand,
  getModelsByCategoryAndBrand,
  createModel,
  updateModel,
  deleteModel
} from '../controllers/models.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Models
 *     description: Gerenciamento de modelos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Model:
 *       type: object
 *       required:
 *         - name
 *         - brand_id
 *       properties:
 *         mod_id:
 *           type: string
 *           description: ID do modelo
 *           example: "mod_01"
 *         name:
 *           type: string
 *           description: Nome do modelo
 *           example: "Corolla"
 *         brand_id:
 *           type: string
 *           description: ID da marca
 *           example: "brand_01"
 *         category_id:
 *           type: string
 *           description: ID da categoria
 *           example: "cat_01"
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /models:
 *   get:
 *     summary: Lista todos os modelos
 *     tags:
 *       - Models
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de modelos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Model'
 *       401:
 *         description: Não autorizado
 */
router.get('/', getAllModels);

/**
 * @swagger
 * /models/brand/{mar_id}:
 *   get:
 *     summary: Lista modelos por marca
 *     tags:
 *       - Models
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mar_id
 *         required: true
 *         description: ID da marca
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Modelos filtrados por marca
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Model'
 */
router.get('/brand/:mar_id', getModelsByBrand);

/**
 * @swagger
 * /models/category/{cat_id}/brand/{mar_id}:
 *   get:
 *     summary: Lista modelos por categoria e marca
 *     tags:
 *       - Models
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cat_id
 *         required: true
 *         description: ID da categoria
 *         schema:
 *           type: string
 *       - in: path
 *         name: mar_id
 *         required: true
 *         description: ID da marca
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Modelos filtrados por categoria e marca
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Model'
 */
router.get('/category/:cat_id/brand/:mar_id', getModelsByCategoryAndBrand);

/**
 * @swagger
 * /models:
 *   post:
 *     summary: Cadastra um novo modelo
 *     tags:
 *       - Models
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Model'
 *     responses:
 *       201:
 *         description: Modelo criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', createModel);

/**
 * @swagger
 * /models/{mod_id}:
 *   patch:
 *     summary: Atualiza parcialmente um modelo existente
 *     tags:
 *       - Models
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mod_id
 *         required: true
 *         description: ID do modelo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Model'
 *     responses:
 *       200:
 *         description: Modelo atualizado com sucesso
 *       404:
 *         description: Modelo não encontrado
 */
router.patch('/:mod_id', updateModel);

/**
 * @swagger
 * /models/{mod_id}:
 *   delete:
 *     summary: Exclui um modelo
 *     tags:
 *       - Models
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mod_id
 *         required: true
 *         description: ID do modelo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Modelo removido com sucesso
 *       404:
 *         description: Modelo não encontrado
 */
router.delete('/:mod_id', deleteModel);

export default router;
