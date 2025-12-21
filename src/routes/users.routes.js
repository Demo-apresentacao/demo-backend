import { Router } from 'express';
import {
    listUsers,
    getUserById,
    createUser,
    updateUser,
    toggleUserStatus,
    deleteUser
} from '../controllers/users.controller.js';

const router = Router();

//   GET /users → lista usuários
router.get('/', listUsers);

//  GET /users/:id → busca usuário por id
router.get('/:id', getUserById);

//  POST /users → cria usuário
router.post('/', createUser);

//  PATCH /users/:id → edita usuário 
router.patch('/:id', updateUser);

//  PATCH /users/:id/status → ativa/desativa usuário
router.patch('/:id/status', toggleUserStatus);

//  DELETE /users/:id → exclui usuário 
router.delete('/:id', deleteUser);

export default router;
