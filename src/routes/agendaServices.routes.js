import { Router } from 'express';
import {
  listAgendaServices,
  createAgendaService,
  updateAgendaService,
  deleteAgendaService
} from '../controllers/agendaServices.controller.js';

const router = Router();

// GET /agenda-services → Lista todos os serviços agendados
router.get('/', listAgendaServices);

// POST /agenda-services → Cadastra um serviço na agenda
router.post('/', createAgendaService);

// PATCH /agenda-services/:agend_serv_id → Atualiza um serviço agendado
router.patch('/:agend_serv_id', updateAgendaService);

// DELETE /agenda-services/:agend_serv_id → Remove um serviço agendado
router.delete('/:agend_serv_id', deleteAgendaService);

export default router;