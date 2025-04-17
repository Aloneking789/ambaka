import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { ProjectService } from '../services/project.service';

const projectService = new ProjectService();

export const validateProject = [
  body('name').notEmpty().withMessage('Project name is required'),
  body('tenderId').notEmpty().withMessage('Tender ID is required'),
  body('wardId').isInt().withMessage('Valid ward ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('status').notEmpty().withMessage('Status is required'),
];

export const validateProjectUpdate = [
  body('name').optional(),
  body('tenderId').optional(),
  body('wardId').optional().isInt().withMessage('Valid ward ID is required'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('status').optional(),
];

export class ProjectController {
  /**
   * Create a new project
   */
  async createProject(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
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
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  /**
   * Get all projects
   */
  async getAllProjects(_req: Request, res: Response) {
    try {
      const projects = await projectService.getAllProjects();
      return res.status(200).json(projects);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  /**
   * Get project by ID
   */
  async getProjectById(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }
      
      const project = await projectService.getProjectById(projectId);
      return res.status(200).json(project);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  /**
   * Update project
   */
  async updateProject(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }
      
      const { name, tenderId, wardId, startDate, endDate, status } = req.body;
      
      const updateData: any = {};
      
      if (name !== undefined) updateData.name = name;
      if (tenderId !== undefined) updateData.tenderId = tenderId;
      if (wardId !== undefined) updateData.wardId = parseInt(wardId);
      if (startDate !== undefined) updateData.startDate = new Date(startDate);
      if (endDate !== undefined) updateData.endDate = new Date(endDate);
      if (status !== undefined) updateData.status = status;
      
      const updatedProject = await projectService.updateProject(projectId, updateData);
      return res.status(200).json(updatedProject);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  /**
   * Delete project
   */
  async deleteProject(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }
      
      const result = await projectService.deleteProject(projectId);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}