import { Router } from 'express';
import { 
    listUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    updateUserStatus,
    deleteUser,
    getUserVehicles
} from '../controllers/users.controller.js';

const router = Router();

router.get('/', listUsers);         // Rota para listar todos os usuários
router.get('/:id', getUserById);    // Rota para obter um usuário por ID
router.post('/', createUser);       // Rota para criar um novo usuário
router.put('/:id', updateUser);     // Rota para atualizar um usuário
router.delete('/:id', deleteUser);  // Rota para deletar um usuário
router.patch('/:id/status', updateUserStatus); // Rota para atualizar o status do usuário
router.get('/:id/vehicles', getUserVehicles); // Rota para obter veículos associados a um usuário

export default router;