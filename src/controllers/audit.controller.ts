import { Request, Response } from 'express';
import { query, param, validationResult } from 'express-validator';
import { AuditService } from '../services/audit.service';

const auditService = new AuditService();

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

export class AuditController {
  /**
   * Get all audit logs (super admin only)
   */
  async getAllLogs(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const logs = await auditService.getAllLogs(page, limit);
      return res.status(200).json(logs);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  /**
   * Get logs by user
   */
  async getLogsByUser(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { userId } = req.params;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const logs = await auditService.getLogsByUser(userId, page, limit);
      return res.status(200).json(logs);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}