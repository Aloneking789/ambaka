"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_controller_1 = require("../controllers/audit.controller");
const auth_1 = require("../middlewares/auth");
const roleCheck_1 = require("../middlewares/roleCheck");
const router = (0, express_1.Router)();
const auditController = new audit_controller_1.AuditController();
/**
 * @route   GET /api/audit
 * @desc    Get all audit logs (super admin only)
 * @access  Private/SuperAdmin
 */
router.get('/', auth_1.authenticate, roleCheck_1.isSuperAdmin, audit_controller_1.validatePagination, auditController.getAllLogs.bind(auditController));
/**
 * @route   GET /api/audit/user/:userId
 * @desc    Get audit logs by user
 * @access  Private/Auditor
 */
router.get('/user/:userId', auth_1.authenticate, roleCheck_1.isAuditor, audit_controller_1.validatePagination, auditController.getLogsByUser.bind(auditController));
exports.default = router;
