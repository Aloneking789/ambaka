"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_1 = require("../middlewares/auth");
const roleCheck_1 = require("../middlewares/roleCheck");
const router = (0, express_1.Router)();
const projectController = new project_controller_1.ProjectController();
/**
 * @route   POST /api/projects
 * @desc    Create a new project with ward and tender ID
 * @access  Private/Admin
 */
router.post('/', auth_1.authenticate, roleCheck_1.isAdmin, project_controller_1.validateProject, projectController.createProject.bind(projectController));
/**
 * @route   GET /api/projects
 * @desc    List all projects
 * @access  Private
 */
router.get('/', auth_1.authenticate, projectController.getAllProjects.bind(projectController));
/**
 * @route   GET /api/projects/:id
 * @desc    Get project details with roads and milestones
 * @access  Private
 */
router.get('/:id', auth_1.authenticate, projectController.getProjectById.bind(projectController));
/**
 * @route   PUT /api/projects/:id
 * @desc    Update project
 * @access  Private/Admin
 */
router.put('/:id', auth_1.authenticate, roleCheck_1.isAdmin, project_controller_1.validateProjectUpdate, projectController.updateProject.bind(projectController));
/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete project
 * @access  Private/Admin
 */
router.delete('/:id', auth_1.authenticate, roleCheck_1.isAdmin, projectController.deleteProject.bind(projectController));
exports.default = router;
