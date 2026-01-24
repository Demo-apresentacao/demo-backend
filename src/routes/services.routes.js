/**
 * @file services.routes.js
 * @description Rotas para gerenciamento de serviços oferecidos.
 * @module Routes/Services
 */

import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

import {
  listServices,
  listServicesByCategory,
  getServiceById,
  createService,
  updateService,
  getServicesByVehicle,
  toggleServiceStatus,
  deleteService
} from '../controllers/services.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Services
 *     description: Gerenciamento de serviços
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category_id
 *       properties:
 *         id:
 *           type: string
 *           example: "serv_01"
 *         name:
 *           type: string
 *           example: "Troca de óleo"
 *         description:
 *           type: string
 *           example: "Troca completa de óleo e filtro"
 *         price:
 *           type: number
 *           example: 120.5
 *         category_id:
 *           type: string
 *           example: "cat_serv_01"
 *         active:
 *           type: boolean
 *           example: true
 */

 /**
  * Middleware de Segurança
  * Aplica a verificação de token (JWT) para todas as rotas abaixo.
  */
router.use(verifyToken);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Lista todos os serviços cadastrados
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de serviços retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/', listServices);

/**
 * @swagger
 * /services/category/{cat_serv_id}:
 *   get:
 *     summary: Lista serviços por categoria
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cat_serv_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de serviços filtrados por categoria
 */
router.get('/category/:cat_serv_id', listServicesByCategory);

/**
 * @swagger
 * /services/{serv_id}:
 *   get:
 *     summary: Busca um serviço pelo ID
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serv_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *       404:
 *         description: Serviço não encontrado
 */
router.get('/:serv_id', getServiceById);

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Cadastra um novo serviço
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 */
router.post('/', createService);

/**
 * @swagger
 * /services/{serv_id}:
 *   patch:
 *     summary: Atualiza parcialmente um serviço
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serv_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Serviço atualizado com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.patch('/:serv_id', updateService);

/**
 * @swagger
 * /services/{serv_id}/status:
 *   patch:
 *     summary: Ativa ou desativa um serviço
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serv_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status do serviço alterado com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.patch('/:serv_id/status', toggleServiceStatus);

/**
 * @swagger
 * /services/{serv_id}:
 *   delete:
 *     summary: Remove um serviço
 *     tags:
 *       - Services
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serv_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Serviço removido com sucesso
 *       404:
 *         description: Serviço não encontrado
 */
router.delete('/:serv_id', deleteService);

router.get('/vehicle/:veic_usu_id', getServicesByVehicle);

export default router;
