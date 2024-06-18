import express from 'express';
import { registerAdmin, login, getAdminById, getAllAdmins, updateAdmin } from '../controllers/admin.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register a new admin
router.post('/register', registerAdmin);

// Login admin
router.post('/login', login);

// Get all admin profiles (Protected route example)
router.get('/', auth, getAllAdmins);

// Get admin by ID
router.get('/:id', getAdminById);

// Update admin by ID
router.put('/:id', updateAdmin);

export default router;
