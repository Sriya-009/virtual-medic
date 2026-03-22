import express from 'express';
import { getAllUsers, getUserById, getUsersByRole, updateUser } from '../controllers/usersController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateUser, getAllUsers);
router.get('/:id', authenticateUser, getUserById);
router.get('/role/:role', authenticateUser, getUsersByRole);
router.put('/:id', authenticateUser, updateUser);

export default router;
