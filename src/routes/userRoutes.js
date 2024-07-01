import express from 'express';
import { registerUser,otpVerification,newPassword,userSignIn,forgot} from '../controllers/userController.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// Register a new user
router.post('/register', registerUser);

//user otp verification
router.post('/otp', otpVerification);

//reset password
router.post("/reset",newPassword);

//sign in 
router.post("/sign_in",userSignIn);

//forgot password
router.post("/forgot",forgot);

export default router;
