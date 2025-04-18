"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const roleCheck_1 = require("../middlewares/roleCheck");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
/**
 * @route   GET /api/users
 * @desc    List all users (admin only)
 * @access  Private/Admin
 */
router.get('/', auth_1.authenticate, roleCheck_1.isAdmin, userController.getAllUsers.bind(userController));
/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', auth_1.authenticate, userController.getUserById.bind(userController));
/**
 * @route   GET /api/users/ward/:wardId
 * @desc    Get users in a ward
 * @access  Private/Admin
 */
router.get('/ward/:wardId', auth_1.authenticate, roleCheck_1.isAdmin, userController.getUsersByWard.bind(userController));
/**
 * @route   POST /api/users/assign-role
 * @desc    Assign or change role
 * @access  Private/SuperAdmin
 */
router.post('/assign-role', auth_1.authenticate, roleCheck_1.isSuperAdmin, user_controller_1.validateRoleAssignment, userController.assignRole.bind(userController));
exports.default = router;
