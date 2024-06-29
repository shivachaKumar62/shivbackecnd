import express from 'express';
import { registerUser,otpVerification,newPassword } from '../controllers/userController.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// Register a new user
router.post('/register', registerUser);

//user otp verification
router.post('/otp', otpVerification);

//forgot password
router.post("/forgot",newPassword);


export default router;
