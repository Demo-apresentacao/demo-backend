/**
 * @file categories.routes.js
 * @description Rotas para gerenciamento de categorias de veículos para serviços
 * @module Routes/CategoriesVehiclesForServices
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  getCategoriesVehiclesForServices
} from '../controllers/categoriesVehiclesForServices.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories Vehicles for Services
 *   description: Gerenciamento de categorias de veículos vinculadas a serviços
 */

/**
 * @swagger
 * /categories-vehicles-for-services:
 *   get:
 *     summary: Listar categorias de veículos para serviços
 *     description: Retorna todas as categorias de veículos disponíveis para serviços cadastrados
 *     tags:
 *       - Categories Vehicles for Services
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
 *                 $ref: '#/components/schemas/CategoryVehicleForService'
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       500:
 *         description: Erro interno do servidor
 */

router.use(verifyToken);
router.get(
  '/',
  getCategoriesVehiclesForServices
);

export default router;