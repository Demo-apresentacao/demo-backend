import { Router } from 'express';
import {
  listBrands,
  listBrandsByCategory,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brands.controller.js';

const router = Router();

/**
 * GET /brands
 * Lista todas as marcas
 */
router.get('/', listBrands);

/**
 * GET /brands/category/:cat_id
 * Lista marcas por categoria
 */
router.get('/category/:cat_id', listBrandsByCategory);

/**
 * POST /brands
 * Cadastra uma nova marca
 */
router.post('/', createBrand);

/**
 * PUT /brands/:id
 * Atualiza uma marca
 */
router.put('/:id', updateBrand);

/**
 * DELETE /brands/:id
 * Exclui uma marca
 */
router.delete('/:id', deleteBrand);

export default router;