"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const milestone_controller_1 = require("../controllers/milestone.controller");
const auth_1 = require("../middlewares/auth");
const roleCheck_1 = require("../middlewares/roleCheck");
const router = (0, express_1.Router)();
const milestoneController = new milestone_controller_1.MilestoneController();
/**
 * @route   POST /api/milestones
 * @desc    Create a milestone for a project
 * @access  Private/Admin
 */
router.post('/', auth_1.authenticate, roleCheck_1.isAdmin, milestone_controller_1.validateMilestone, milestoneController.createMilestone.bind(milestoneController));
/**
 * @route   GET /api/milestones/project/:projectId
 * @desc    Get milestones by project
 * @access  Private
 */
router.get('/project/:projectId', auth_1.authenticate, milestoneController.getMilestonesByProject.bind(milestoneController));
/**
 * @route   PUT /api/milestones/:id
 * @desc    Update milestone
 * @access  Private/Admin
 */
router.put('/:id', auth_1.authenticate, roleCheck_1.isAdmin, milestone_controller_1.validateMilestoneUpdate, milestoneController.updateMilestone.bind(milestoneController));
/**
 * @route   DELETE /api/milestones/:id
 * @desc    Delete milestone
 * @access  Private/Admin
 */
router.delete('/:id', auth_1.authenticate, roleCheck_1.isAdmin, milestoneController.deleteMilestone.bind(milestoneController));
exports.default = router;
