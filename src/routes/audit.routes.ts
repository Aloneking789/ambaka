import { Router } from 'express';
import { AuditController, validatePagination } from '../controllers/audit.controller';
import { authenticate } from '../middlewares/auth';
import { isAuditor, isSuperAdmin } from '../middlewares/roleCheck';

const router = Router();
const auditController = new AuditController();

/**
 * @route   GET /api/audit
 * @desc    Get all audit logs (super admin only)
 * @access  Private/SuperAdmin
 */
router.get(
  '/',
  authenticate,
  isSuperAdmin,
  validatePagination,
  auditController.getAllLogs.bind(auditController)
);

/**
 * @route   GET /api/audit/user/:userId
 * @desc    Get audit logs by user
 * @access  Private/Auditor
 */
router.get(
  '/user/:userId',
  authenticate,
  isAuditor,
  validatePagination,
  auditController.getLogsByUser.bind(auditController)
);

export default router;