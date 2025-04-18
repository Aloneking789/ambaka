"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.validateLogin = exports.validateSignup = void 0;
const express_validator_1 = require("express-validator");
const auth_service_1 = require("../services/auth.service");
const authService = new auth_service_1.AuthService();
exports.validateSignup = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
exports.validateLogin = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'),
];
class AuthController {
    /**
     * Register a new user
     */
    async signup(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await authService.signup(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    /**
     * Login a user
     */
    async login(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const result = await authService.login(req.body);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }
    /**
     * Get current user profile
     */
    async getProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Not authenticated' });
            }
            const user = await authService.getUserProfile(userId);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.AuthController = AuthController;
