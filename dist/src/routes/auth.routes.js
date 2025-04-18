"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', auth_controller_1.validateSignup, authController.signup.bind(authController));
/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post('/login', auth_controller_1.validateLogin, authController.login.bind(authController));
/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth_1.authenticate, authController.getProfile.bind(authController));
exports.default = router;
