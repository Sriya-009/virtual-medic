import express from 'express';
import { getAllPharmacists, getPharmacistById, updatePharmacist } from '../controllers/pharmacistsController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateUser, getAllPharmacists);
router.get('/:id', authenticateUser, getPharmacistById);
router.put('/:id', authenticateUser, updatePharmacist);

export default router;
