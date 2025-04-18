"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.validateRoleAssignment = void 0;
const express_validator_1 = require("express-validator");
const user_service_1 = require("../services/user.service");
const client_1 = require("@prisma/client");
const userService = new user_service_1.UserService();
exports.validateRoleAssignment = [
    (0, express_validator_1.body)('userId').notEmpty().withMessage('User ID is required'),
    (0, express_validator_1.body)('role').isIn(Object.values(client_1.UserRole)).withMessage('Invalid role'),
];
class UserController {
    /**
     * Get all users (admin only)
     */
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    /**
     * Get user by ID
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    /**
     * Get users by ward
     */
    async getUsersByWard(req, res) {
        try {
            const wardId = parseInt(req.params.wardId);
            if (isNaN(wardId)) {
                return res.status(400).json({ message: 'Invalid ward ID' });
            }
            const users = await userService.getUsersByWard(wardId);
            return res.status(200).json(users);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    /**
     * Assign or change user role
     */
    async assignRole(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { userId, role, wardId } = req.body;
            const updatedUser = await userService.assignRole({
                userId,
                role,
                wardId: wardId ? parseInt(wardId) : undefined
            });
            return res.status(200).json(updatedUser);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.UserController = UserController;
