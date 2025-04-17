import { Router } from 'express';
import { WardController, validateWard } from '../controllers/ward.controller';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/roleCheck';

const router = Router();
const wardController = new WardController();

/**
 * @route   POST /api/wards
 * @desc    Create a new ward
 * @access  Private/Admin
 */
router.post('/', authenticate, isAdmin, validateWard, wardController.createWard.bind(wardController));

/**
 * @route   GET /api/wards
 * @desc    Get all wards
 * @access  Private
 */
router.get('/', authenticate, wardController.getAllWards.bind(wardController));

/**
 * @route   GET /api/wards/:id
 * @desc    Get ward details with projects
 * @access  Private
 */
router.get('/:id', authenticate, wardController.getWardById.bind(wardController));

export default router;