import { Router } from 'express';
import { RoadController, validateRoad } from '../controllers/road.controller';
import { authenticate } from '../middlewares/auth';
import { isFieldEngineer } from '../middlewares/roleCheck';

const router = Router();
const roadController = new RoadController();

/**
 * @route   POST /api/roads
 * @desc    Create a road entry
 * @access  Private/FieldEngineer
 */
router.post('/', authenticate, isFieldEngineer, validateRoad, roadController.createRoad.bind(roadController));

/**
 * @route   GET /api/roads/project/:projectId
 * @desc    Get roads under a project
 * @access  Private
 */
router.get('/project/:projectId', authenticate, roadController.getRoadsByProject.bind(roadController));

/**
 * @route   GET /api/roads/:id
 * @desc    Get road detail with geo-location
 * @access  Private
 */
router.get('/:id', authenticate, roadController.getRoadById.bind(roadController));

export default router;