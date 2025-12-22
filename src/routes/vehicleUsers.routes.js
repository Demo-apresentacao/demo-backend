import { Router } from 'express';
import {
  listVehicleUsers,
  listUsersByVehicle,
  listVehiclesByUser,
  createVehicleUser,
  updateVehicleUser,
  deleteVehicleUser
} from '../controllers/vehicleUsers.controller.js';

const router = Router();

// GET /vehicle-users → Lista todas as associações
router.get('/', listVehicleUsers);

// GET /vehicle-users/vehicle/:vehicleId → Usuários de um veículo
router.get('/vehicle/:vehicleId', listUsersByVehicle);

// GET /vehicle-users/user/:userId → Veículos de um usuário
router.get('/user/:userId', listVehiclesByUser);

// POST /vehicle-users → Cria associação
router.post('/', createVehicleUser);

// PATCH /vehicle-users/:id → Atualiza associação
router.patch('/:id', updateVehicleUser);

// DELETE /vehicle-users/:id → Remove associação
router.delete('/:id', deleteVehicleUser);

export default router;