"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const road_controller_1 = require("../controllers/road.controller");
const auth_1 = require("../middlewares/auth");
const roleCheck_1 = require("../middlewares/roleCheck");
const router = (0, express_1.Router)();
const roadController = new road_controller_1.RoadController();
/**
 * @route   POST /api/roads
 * @desc    Create a road entry
 * @access  Private/FieldEngineer
 */
router.post('/', auth_1.authenticate, roleCheck_1.isFieldEngineer, road_controller_1.validateRoad, roadController.createRoad.bind(roadController));
/**
 * @route   GET /api/roads/project/:projectId
 * @desc    Get roads under a project
 * @access  Private
 */
router.get('/project/:projectId', auth_1.authenticate, roadController.getRoadsByProject.bind(roadController));
/**
 * @route   GET /api/roads/:id
 * @desc    Get road detail with geo-location
 * @access  Private
 */
router.get('/:id', auth_1.authenticate, roadController.getRoadById.bind(roadController));
exports.default = router;
