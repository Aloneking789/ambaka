import { Router } from 'express';
import { ProjectController, validateProject, validateProjectUpdate } from '../controllers/project.controller';
import { authenticate } from '../middlewares/auth';
import { isAdmin } from '../middlewares/roleCheck';

const router = Router();
const projectController = new ProjectController();

/**
 * @route   POST /api/projects
 * @desc    Create a new project with ward and tender ID
 * @access  Private/Admin
 */
router.post('/', authenticate, isAdmin, validateProject, projectController.createProject.bind(projectController));

/**
 * @route   GET /api/projects
 * @desc    List all projects
 * @access  Private
 */
router.get('/', authenticate, projectController.getAllProjects.bind(projectController));

/**
 * @route   GET /api/projects/:id
 * @desc    Get project details with roads and milestones
 * @access  Private
 */
router.get('/:id', authenticate, projectController.getProjectById.bind(projectController));

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private/Admin
 */
router.put('/:id', authenticate, isAdmin, validateProjectUpdate, projectController.updateProject.bind(projectController));

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, isAdmin, projectController.deleteProject.bind(projectController));

export default router;