import { Router } from 'express';
import { ProgressController, validateProgressLog, validateProgressUpdate } from '../controllers/progress.controller';
import { authenticate } from '../middlewares/auth';
import { isFieldEngineer } from '../middlewares/roleCheck';
import { uploadImage } from '../utils/fileUpload';

const router = Router();
const progressController = new ProgressController();

/**
 * @route   POST /api/progress
 * @desc    Upload milestone progress with photo
 * @access  Private/FieldEngineer
 */
router.post(
  '/',
  authenticate,
  isFieldEngineer,
  uploadImage.single('photo'),
  progressController.handleUploadError.bind(progressController),
  validateProgressLog,
  progressController.createProgressLog.bind(progressController)
);

/**
 * @route   GET /api/progress/project/:projectId
 * @desc    View all progress logs for a project
 * @access  Private
 */
router.get(
  '/project/:projectId',
  authenticate,
  progressController.getProgressLogsByProject.bind(progressController)
);

/**
 * @route   GET /api/progress/road/:roadId
 * @desc    View progress by road
 * @access  Private
 */
router.get(
  '/road/:roadId',
  authenticate,
  progressController.getProgressLogsByRoad.bind(progressController)
);

/**
 * @route   PUT /api/progress/:id
 * @desc    Update status/notes/photo
 * @access  Private/FieldEngineer
 */
router.put(
  '/:id',
  authenticate,
  isFieldEngineer,
  uploadImage.single('photo'),
  progressController.handleUploadError.bind(progressController),
  validateProgressUpdate,
  progressController.updateProgressLog.bind(progressController)
);

export default router;