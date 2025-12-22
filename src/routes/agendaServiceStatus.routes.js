import { Router } from 'express';
import {
  listAgendaServiceStatus,
  createAgendaServiceStatus,
  updateAgendaServiceStatus,
  deleteAgendaServiceStatus
} from '../controllers/agendaServiceStatus.controller.js';

const router = Router();

// GET /agenda-services-status
// Lista todas as situações da agenda de serviços
router.get('/', listAgendaServiceStatus);

// POST /agenda-services-status
// Cadastra uma nova situação
router.post('/', createAgendaServiceStatus);

// PUT /agenda-services-status/:id
// Atualiza uma situação
router.put('/:id', updateAgendaServiceStatus);

// DELETE /agenda-services-status/:id
// Exclui uma situação
router.delete('/:id', deleteAgendaServiceStatus);

export default router;