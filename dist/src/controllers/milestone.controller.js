"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneController = exports.validateMilestoneUpdate = exports.validateMilestone = void 0;
const express_validator_1 = require("express-validator");
const milestone_service_1 = require("../services/milestone.service");
const milestoneService = new milestone_service_1.MilestoneService();
exports.validateMilestone = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Title is required'),
    (0, express_validator_1.body)('projectId').isInt().withMessage('Valid project ID is required'),
    (0, express_validator_1.body)('order').isInt({ min: 1 }).withMessage('Order must be a positive integer')
];
exports.validateMilestoneUpdate = [
    (0, express_validator_1.body)('title').optional().notEmpty().withMessage('Title cannot be empty'),
    (0, express_validator_1.body)('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer')
];
class MilestoneController {
    /**
     * Create a milestone for a project
     */
    async createMilestone(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { title, description, projectId, order } = req.body;
            const newMilestone = await milestoneService.createMilestone({
                title,
                description,
                projectId: parseInt(projectId),
                order: parseInt(order)
            });
            return res.status(201).json(newMilestone);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    /**
     * Get milestones by project
     */
    async getMilestonesByProject(req, res) {
        try {
            const projectId = parseInt(req.params.projectId);
            if (isNaN(projectId)) {
                return res.status(400).json({ message: 'Invalid project ID' });
            }
            const milestones = await milestoneService.getMilestonesByProject(projectId);
            return res.status(200).json(milestones);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    /**
     * Update milestone
     */
    async updateMilestone(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const milestoneId = parseInt(req.params.id);
            if (isNaN(milestoneId)) {
                return res.status(400).json({ message: 'Invalid milestone ID' });
            }
            const { title, description, order } = req.body;
            const updateData = {};
            if (title !== undefined)
                updateData.title = title;
            if (description !== undefined)
                updateData.description = description;
            if (order !== undefined)
                updateData.order = parseInt(order);
            const updatedMilestone = await milestoneService.updateMilestone(milestoneId, updateData);
            return res.status(200).json(updatedMilestone);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    /**
     * Delete milestone
     */
    async deleteMilestone(req, res) {
        try {
            const milestoneId = parseInt(req.params.id);
            if (isNaN(milestoneId)) {
                return res.status(400).json({ message: 'Invalid milestone ID' });
            }
            const result = await milestoneService.deleteMilestone(milestoneId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.MilestoneController = MilestoneController;
