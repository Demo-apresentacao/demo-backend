import { Router } from 'express';
import { listUsers } from '../controllers/users.controller.js';

const router = Router();

// GET /users
router.get('/', listUsers);

export default router;
