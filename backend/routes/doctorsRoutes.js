import express from 'express';
import { getAllDoctors, getDoctorById, getDoctorsBySpecialization, updateDoctor } from '../controllers/doctorsController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateUser, getAllDoctors);
router.get('/:id', authenticateUser, getDoctorById);
router.get('/specialization/:specialization', authenticateUser, getDoctorsBySpecialization);
router.put('/:id', authenticateUser, updateDoctor);

export default router;
