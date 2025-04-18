"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditController = exports.validatePagination = void 0;
const express_validator_1 = require("express-validator");
const audit_service_1 = require("../services/audit.service");
const auditService = new audit_service_1.AuditService();
exports.validatePagination = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
class AuditController {
    /**
     * Get all audit logs (super admin only)
     */
    async getAllLogs(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            const logs = await auditService.getAllLogs(page, limit);
            return res.status(200).json(logs);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    /**
     * Get logs by user
     */
    async getLogsByUser(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { userId } = req.params;
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 50;
            const logs = await auditService.getLogsByUser(userId, page, limit);
            return res.status(200).json(logs);
        }
        catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }
}
exports.AuditController = AuditController;
