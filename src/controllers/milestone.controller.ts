import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { MilestoneService } from '../services/milestone.service';

const milestoneService = new MilestoneService();

export const validateMilestone = [
  body('title').notEmpty().withMessage('Title is required'),
  body('projectId').isInt().withMessage('Valid project ID is required'),
  body('order').isInt({ min: 1 }).withMessage('Order must be a positive integer')
];

export const validateMilestoneUpdate = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('order').optional().isInt({ min: 1 }).withMessage('Order must be a positive integer')
];

export class MilestoneController {
  /**
   * Create a milestone for a project
   */
  async createMilestone(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
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
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  /**
   * Get milestones by project
   */
  async getMilestonesByProject(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.projectId);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }
      
      const milestones = await milestoneService.getMilestonesByProject(projectId);
      return res.status(200).json(milestones);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  /**
   * Update milestone
   */
  async updateMilestone(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const milestoneId = parseInt(req.params.id);
      
      if (isNaN(milestoneId)) {
        return res.status(400).json({ message: 'Invalid milestone ID' });
      }
      
      const { title, description, order } = req.body;
      
      const updateData: any = {};
      
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (order !== undefined) updateData.order = parseInt(order);
      
      const updatedMilestone = await milestoneService.updateMilestone(milestoneId, updateData);
      return res.status(200).json(updatedMilestone);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  /**
   * Delete milestone
   */
  async deleteMilestone(req: Request, res: Response) {
    try {
      const milestoneId = parseInt(req.params.id);
      
      if (isNaN(milestoneId)) {
        return res.status(400).json({ message: 'Invalid milestone ID' });
      }
      
      const result = await milestoneService.deleteMilestone(milestoneId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}