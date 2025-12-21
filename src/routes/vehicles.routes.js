import { Router } from 'express';
import {
  listVehicles,
  getVehicleById,
  createVehicle,
  deleteVehicle,
  updateVehicleByAdmin,
  updateVehicleByUser,
  updateVehicleStatus
} from '../controllers/vehicles.controller.js';

const router = Router();

// GET /vehicles
router.get('/', listVehicles);

// GET /vehicles/:id
router.get('/:id', getVehicleById);

// POST /vehicles
router.post('/', createVehicle);

// DELETE /vehicles/:id
router.delete('/:id', deleteVehicle);

// PATCH /vehicles/:veic_id (admin)
router.patch('/:veic_id', updateVehicleByAdmin);

// PATCH /vehicles/user/:veic_id (usuário)
router.patch('/user/:veic_id', updateVehicleByUser);

// PATCH /vehicles/:id/status
router.patch('/:id/status', updateVehicleStatus);

export default router;
