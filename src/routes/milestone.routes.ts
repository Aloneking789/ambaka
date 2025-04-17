import { Router } from 'express';
import { MilestoneController, validateMilestone, validateMilestoneUpdate } from '../controllers/milestone.controller';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/roleCheck';

const router = Router();
const milestoneController = new MilestoneController();

/**
 * @route   POST /api/milestones
 * @desc    Create a milestone for a project
 * @access  Private/Admin
 */
router.post('/', authenticate, isAdmin, validateMilestone, milestoneController.createMilestone.bind(milestoneController));

/**
 * @route   GET /api/milestones/project/:projectId
 * @desc    Get milestones by project
 * @access  Private
 */
router.get('/project/:projectId', authenticate, milestoneController.getMilestonesByProject.bind(milestoneController));

/**
 * @route   PUT /api/milestones/:id
 * @desc    Update milestone
 * @access  Private/Admin
 */
router.put('/:id', authenticate, isAdmin, validateMilestoneUpdate, milestoneController.updateMilestone.bind(milestoneController));

/**
 * @route   DELETE /api/milestones/:id
 * @desc    Delete milestone
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, isAdmin, milestoneController.deleteMilestone.bind(milestoneController));

export default router;