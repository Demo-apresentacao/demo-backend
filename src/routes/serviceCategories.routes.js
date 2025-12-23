import { Router } from 'express';
import {
  listServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory
} from '../controllers/serviceCategories.controller.js';

const router = Router();

/**
 * GET /service-categories
 * Lista todas as categorias de serviços
 */
router.get('/', listServiceCategories);

/**
 * POST /service-categories
 * Cadastra uma nova categoria de serviço
 */
router.post('/', createServiceCategory);

/**
 * PUT /service-categories/:id
 * Atualiza uma categoria de serviço
 */
router.put('/:id', updateServiceCategory);

/**
 * DELETE /service-categories/:id
 * Remove uma categoria de serviço
 */
router.delete('/:id', deleteServiceCategory);

export default router;