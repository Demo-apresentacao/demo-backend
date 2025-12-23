import { Router } from 'express';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js';

const router = Router();

// GET /categories
// Lista todas as categorias
router.get('/', listCategories);

// POST /categories
// Cadastra uma nova categoria
router.post('/', createCategory);

// PUT /categories/:id
// Atualiza uma categoria
router.put('/:id', updateCategory);

// DELETE /categories/:id
// Remove uma categoria
router.delete('/:id', deleteCategory);

export default router;