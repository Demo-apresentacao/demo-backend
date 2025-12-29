import { Router } from 'express';
import { 
    listAppointments, 
    getAppointmentById, 
    createAppointment, 
    updateAppointment, 
    cancelAppointment 
} from '../controllers/appointments.controller.js';

const router = Router();

router.get('/', listAppointments);
router.get('/:id', getAppointmentById);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.patch('/:id/cancel', cancelAppointment); // Rota especial para cancelar

export default router;