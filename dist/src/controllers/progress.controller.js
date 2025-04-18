"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressController = exports.validateProgressUpdate = exports.validateProgressLog = void 0;
const express_validator_1 = require("express-validator");
const progress_service_1 = require("../services/progress.service");
const multer_1 = __importDefault(require("multer"));
const progressService = new progress_service_1.ProgressService();
exports.validateProgressLog = [
    (0, express_validator_1.body)('milestoneId').isInt().withMessage('Valid milestone ID is required'),
    (0, express_validator_1.body)('roadId').isInt().withMessage('Valid road ID is required'),
    (0, express_validator_1.body)('status').notEmpty().withMessage('Status is required'),
];
exports.validateProgressUpdate = [
    (0, express_validator_1.body)('status').optional().notEmpty().withMessage('Status cannot be empty'),
];
class ProgressController {
    /**
     * Upload milestone progress with photo
     */
    async createProgressLog(req, res) {
        var _a;
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { milestoneId, roadId, status, notes } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Not authenticated' });
            }
            // Get photo filename if uploaded
            const photoFilename = req.file ? req.file.filename : undefined;
            const progressLog = await progressService.createProgressLog({
                milestoneId: parseInt(milestoneId),
                roadId: parseInt(roadId),
                status,
                notes,
                photoFilename,
                createdBy: userId
            });
            return res.status(201).json(progressLog);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    /**
     * View all progress logs by project
     */
    async getProgressLogsByProject(req, res) {
        try {
            const projectId = parseInt(req.params.projectId);
            if (isNaN(projectId)) {
                return res.status(400).json({ message: 'Invalid project ID' });
            }
            const progressLogs = await progressService.getProgressLogsByProject(projectId);
            return res.status(200).json(progressLogs);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    /**
     * View progress by road
     */
    async getProgressLogsByRoad(req, res) {
        try {
            const roadId = parseInt(req.params.roadId);
            if (isNaN(roadId)) {
                return res.status(400).json({ message: 'Invalid road ID' });
            }
            const progressLogs = await progressService.getProgressLogsByRoad(roadId);
            return res.status(200).json(progressLogs);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    /**
     * Update status/notes/photo
     */
    async updateProgressLog(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const progressId = parseInt(req.params.id);
            if (isNaN(progressId)) {
                return res.status(400).json({ message: 'Invalid progress log ID' });
            }
            const { status, notes } = req.body;
            // Get photo filename if uploaded
            const photoFilename = req.file ? req.file.filename : undefined;
            const updateData = {};
            if (status !== undefined)
                updateData.status = status;
            if (notes !== undefined)
                updateData.notes = notes;
            if (photoFilename !== undefined)
                updateData.photoFilename = photoFilename;
            const updatedProgress = await progressService.updateProgressLog(progressId, updateData);
            return res.status(200).json(updatedProgress);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    /**
     * Handle file upload errors
     */
    handleUploadError(err, req, res, next) {
        if (err instanceof multer_1.default.MulterError) {
            // A Multer error occurred when uploading
            return res.status(400).json({
                message: 'File upload error',
                error: err.message
            });
        }
        else if (err) {
            // An unknown error occurred
            return res.status(500).json({
                message: 'Server error during file upload',
                error: err.message
            });
        }
        next();
    }
}
exports.ProgressController = ProgressController;
