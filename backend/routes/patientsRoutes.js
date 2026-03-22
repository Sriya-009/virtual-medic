import express from 'express';
import { getAllPatients, getPatientById, updatePatient } from '../controllers/patientsController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateUser, getAllPatients);
router.get('/:id', authenticateUser, getPatientById);
router.put('/:id', authenticateUser, updatePatient);

export default router;
