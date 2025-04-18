"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ward_controller_1 = require("../controllers/ward.controller");
const auth_1 = require("../middlewares/auth");
const roleCheck_1 = require("../middlewares/roleCheck");
const router = (0, express_1.Router)();
const wardController = new ward_controller_1.WardController();
/**
 * @route   POST /api/wards
 * @desc    Create a new ward
 * @access  Private/Admin
 */
router.post('/', auth_1.authenticate, roleCheck_1.isAdmin, ward_controller_1.validateWard, wardController.createWard.bind(wardController));
/**
 * @route   GET /api/wards
 * @desc    Get all wards
 * @access  Private
 */
router.get('/', auth_1.authenticate, wardController.getAllWards.bind(wardController));
/**
 * @route   GET /api/wards/:id
 * @desc    Get ward details with projects
 * @access  Private
 */
router.get('/:id', auth_1.authenticate, wardController.getWardById.bind(wardController));
exports.default = router;
