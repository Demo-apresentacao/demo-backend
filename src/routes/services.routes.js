import { Router } from 'express';
import {
  listServices,
  listServicesByCategory,
  getServiceById,
  createService,
  updateService,
  toggleServiceStatus,
  deleteService
} from '../controllers/services.controller.js';

const router = Router();

// GET /services
// Lista todos os serviços
router.get('/', listServices);

// GET /services/category/:cat_serv_id
// Lista serviços por categoria
router.get('/category/:cat_serv_id', listServicesByCategory);

// GET /services/:serv_id
// Busca um serviço pelo ID
router.get('/:serv_id', getServiceById);

// POST /services
// Cadastra um novo serviço
router.post('/', createService);

// PUT /services/:serv_id
// Atualiza os dados de um serviço
router.put('/:serv_id', updateService);

// PATCH /services/:serv_id/status
// Ativa ou desativa um serviço
router.patch('/:serv_id/status', toggleServiceStatus);

// DELETE /services/:serv_id
// Remove um serviço
router.delete('/:serv_id', deleteService);

export default router;