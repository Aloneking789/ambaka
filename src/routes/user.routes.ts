import { Router } from 'express';
import { UserController, validateRoleAssignment } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';
import { isAdmin, isSuperAdmin } from '../middlewares/roleCheck';

const router = Router();
const userController = new UserController();

/**
 * @route   GET /api/users
 * @desc    List all users (admin only)
 * @access  Private/Admin
 */
router.get('/', authenticate, isAdmin, userController.getAllUsers.bind(userController));

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', authenticate, userController.getUserById.bind(userController));

/**
 * @route   GET /api/users/ward/:wardId
 * @desc    Get users in a ward
 * @access  Private/Admin
 */
router.get('/ward/:wardId', authenticate, isAdmin, userController.getUsersByWard.bind(userController));

/**
 * @route   POST /api/users/assign-role
 * @desc    Assign or change role
 * @access  Private/SuperAdmin
 */
router.post('/assign-role', authenticate, isSuperAdmin, validateRoleAssignment, userController.assignRole.bind(userController));

export default router;