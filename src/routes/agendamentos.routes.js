import { Router } from 'express';
import {
  listAgendamentos,
  createAgendamento,
  updateAgendamento,
  updateAgendamentoStatus
} from '../controllers/agendamentos.controller.js';

const router = Router();

// GET /agendamentos
router.get('/', listAgendamentos);

// POST /agendamentos
router.post('/', createAgendamento);

// PUT /agendamentos/:id
router.put('/:id', updateAgendamento);

// PATCH /agendamentos/:id/status
router.patch('/:id/status', updateAgendamentoStatus);

export default router;