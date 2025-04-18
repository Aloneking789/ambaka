"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = exports.validateProjectUpdate = exports.validateProject = void 0;
const express_validator_1 = require("express-validator");
const project_service_1 = require("../services/project.service");
const projectService = new project_service_1.ProjectService();
exports.validateProject = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Project name is required'),
    (0, express_validator_1.body)('tenderId').notEmpty().withMessage('Tender ID is required'),
    (0, express_validator_1.body)('wardId').isInt().withMessage('Valid ward ID is required'),
    (0, express_validator_1.body)('startDate').isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('status').notEmpty().withMessage('Status is required'),
];
exports.validateProjectUpdate = [
    (0, express_validator_1.body)('name').optional(),
    (0, express_validator_1.body)('tenderId').optional(),
    (0, express_validator_1.body)('wardId').optional().isInt().withMessage('Valid ward ID is required'),
    (0, express_validator_1.body)('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    (0, express_validator_1.body)('endDate').optional().isISO8601().withMessage('Valid end date is required'),
    (0, express_validator_1.body)('status').optional(),
];
class ProjectController {
    /**
     * Create a new project
     */
    async createProject(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, tenderId, wardId, startDate, endDate, status } = req.body;
            const newProject = await projectService.createProject({
                name,
                tenderId,
                wardId: parseInt(wardId),
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : undefined,
                status
            });
            return res.status(201).json(newProject);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    /**
     * Get all projects
     */
    async getAllProjects(_req, res) {
        try {
            const projects = await projectService.getAllProjects();
            return res.status(200).json(projects);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    /**
     * Get project by ID
     */
    async getProjectById(req, res) {
        try {
            const projectId = parseInt(req.params.id);
            if (isNaN(projectId)) {
                return res.status(400).json({ message: 'Invalid project ID' });
            }
            const project = await projectService.getProjectById(projectId);
            return res.status(200).json(project);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
    /**
     * Update project
     */
    async updateProject(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const projectId = parseInt(req.params.id);
            if (isNaN(projectId)) {
                return res.status(400).json({ message: 'Invalid project ID' });
            }
            const { name, tenderId, wardId, startDate, endDate, status } = req.body;
            const updateData = {};
            if (name !== undefined)
                updateData.name = name;
            if (tenderId !== undefined)
                updateData.tenderId = tenderId;
            if (wardId !== undefined)
                updateData.wardId = parseInt(wardId);
            if (startDate !== undefined)
                updateData.startDate = new Date(startDate);
            if (endDate !== undefined)
                updateData.endDate = new Date(endDate);
            if (status !== undefined)
                updateData.status = status;
            const updatedProject = await projectService.updateProject(projectId, updateData);
            return res.status(200).json(updatedProject);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    /**
     * Delete project
     */
    async deleteProject(req, res) {
        try {
            const projectId = parseInt(req.params.id);
            if (isNaN(projectId)) {
                return res.status(400).json({ message: 'Invalid project ID' });
            }
            const result = await projectService.deleteProject(projectId);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.ProjectController = ProjectController;
