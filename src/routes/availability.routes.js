import { Router } from 'express';
import {
  listAvailability,
  createAvailability,
  updateAvailability,
  toggleAvailabilityStatus,
  deleteAvailability
} from '../controllers/availability.controller.js';

const router = Router();

// GET /availability
// Lista todas as disponibilidades
router.get('/', listAvailability);

// POST /availability
// Cadastra uma nova disponibilidade
router.post('/', createAvailability);

// PATCH /availability/:disp_id
// Edita uma disponibilidade
router.patch('/:disp_id', updateAvailability);

// PATCH /availability/status/:disp_id
// Habilita ou desabilita uma disponibilidade
router.patch('/status/:disp_id', toggleAvailabilityStatus);

// DELETE /availability/:disp_id
// Exclui uma disponibilidade
router.delete('/:disp_id', deleteAvailability);

export default router;