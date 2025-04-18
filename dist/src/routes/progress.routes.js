"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("../controllers/progress.controller");
const auth_1 = require("../middlewares/auth");
const roleCheck_1 = require("../middlewares/roleCheck");
const fileUpload_1 = require("../utils/fileUpload");
const router = (0, express_1.Router)();
const progressController = new progress_controller_1.ProgressController();
/**
 * @route   POST /api/progress
 * @desc    Upload milestone progress with photo
 * @access  Private/FieldEngineer
 */
router.post('/', auth_1.authenticate, roleCheck_1.isFieldEngineer, fileUpload_1.uploadImage.single('photo'), progressController.handleUploadError.bind(progressController), progress_controller_1.validateProgressLog, progressController.createProgressLog.bind(progressController));
/**
 * @route   GET /api/progress/project/:projectId
 * @desc    View all progress logs for a project
 * @access  Private
 */
router.get('/project/:projectId', auth_1.authenticate, progressController.getProgressLogsByProject.bind(progressController));
/**
 * @route   GET /api/progress/road/:roadId
 * @desc    View progress by road
 * @access  Private
 */
router.get('/road/:roadId', auth_1.authenticate, progressController.getProgressLogsByRoad.bind(progressController));
/**
 * @route   PUT /api/progress/:id
 * @desc    Update status/notes/photo
 * @access  Private/FieldEngineer
 */
router.put('/:id', auth_1.authenticate, roleCheck_1.isFieldEngineer, fileUpload_1.uploadImage.single('photo'), progressController.handleUploadError.bind(progressController), progress_controller_1.validateProgressUpdate, progressController.updateProgressLog.bind(progressController));
exports.default = router;
