import { Router } from 'express';
import {
  listUnavailability,
  createUnavailability,
  updateUnavailability,
  toggleUnavailabilityStatus,
  deleteUnavailability
} from '../controllers/unavailability.controller.js';

const router = Router();

// GET /unavailability → Lista todas as indisponibilidades
router.get('/', listUnavailability);

// POST /unavailability → Cadastra uma nova indisponibilidade
router.post('/', createUnavailability);

// PATCH /unavailability/:indisp_id → Edita a data da indisponibilidade
router.patch('/:indisp_id', updateUnavailability);

// PATCH /unavailability/status/:indisp_id → Ativa ou desativa a indisponibilidade
router.patch('/status/:indisp_id', toggleUnavailabilityStatus);

// DELETE /unavailability/:indisp_id → Remove a indisponibilidade
router.delete('/:indisp_id', deleteUnavailability);

export default router;
