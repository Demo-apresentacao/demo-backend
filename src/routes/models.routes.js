import { Router } from 'express';
import modelsController from '../controllers/models.controller.js';

const router = Router();

// GET > Lista todos os modelos
router.get('/', modelsController.getAllModels);

// GET > Lista modelos por marca 
router.get('/brand/:mar_id', modelsController.getModelsByBrand);

// GET > Lista modelos por categoria e marca
router.get('/category/:cat_id/brand/:mar_id', modelsController.getModelsByCategoryAndBrand);

// Cadastra um novo modelo
router.post('/', modelsController.createModel);

// Edita um modelo
router.patch('/:mod_id', modelsController.updateModel);

// Exclui um modelo
router.delete('/:mod_id', modelsController.deleteModel);

export default router;