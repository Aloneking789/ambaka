import { Router } from 'express';
import { AuthController, validateLogin, validateSignup } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', validateSignup, authController.signup.bind(authController));

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', validateLogin, authController.login.bind(authController));

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.getProfile.bind(authController));

export default router;