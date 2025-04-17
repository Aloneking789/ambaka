import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { ProgressService } from '../services/progress.service';
import { uploadImage } from '../utils/fileUpload';
import multer from 'multer';

const progressService = new ProgressService();

export const validateProgressLog = [
  body('milestoneId').isInt().withMessage('Valid milestone ID is required'),
  body('roadId').isInt().withMessage('Valid road ID is required'),
  body('status').notEmpty().withMessage('Status is required'),
];

export const validateProgressUpdate = [
  body('status').optional().notEmpty().withMessage('Status cannot be empty'),
];

export class ProgressController {
  /**
   * Upload milestone progress with photo
   */
  async createProgressLog(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { milestoneId, roadId, status, notes } = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      // Get photo filename if uploaded
      const photoFilename = req.file ? req.file.filename : undefined;
      
      const progressLog = await progressService.createProgressLog({
        milestoneId: parseInt(milestoneId),
        roadId: parseInt(roadId),
        status,
        notes,
        photoFilename,
        createdBy: userId
      });
      
      return res.status(201).json(progressLog);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
  
  /**
   * View all progress logs by project
   */
  async getProgressLogsByProject(req: Request, res: Response) {
    try {
      const projectId = parseInt(req.params.projectId);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ message: 'Invalid project ID' });
      }
      
      const progressLogs = await progressService.getProgressLogsByProject(projectId);
      return res.status(200).json(progressLogs);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  /**
   * View progress by road
   */
  async getProgressLogsByRoad(req: Request, res: Response) {
    try {
      const roadId = parseInt(req.params.roadId);
      
      if (isNaN(roadId)) {
        return res.status(400).json({ message: 'Invalid road ID' });
      }
      
      const progressLogs = await progressService.getProgressLogsByRoad(roadId);
      return res.status(200).json(progressLogs);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  /**
   * Update status/notes/photo
   */
  async updateProgressLog(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const progressId = parseInt(req.params.id);
      
      if (isNaN(progressId)) {
        return res.status(400).json({ message: 'Invalid progress log ID' });
      }
      
      const { status, notes } = req.body;
      
      // Get photo filename if uploaded
      const photoFilename = req.file ? req.file.filename : undefined;
      
      const updateData: any = {};
      
      if (status !== undefined) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;
      if (photoFilename !== undefined) updateData.photoFilename = photoFilename;
      
      const updatedProgress = await progressService.updateProgressLog(progressId, updateData);
      return res.status(200).json(updatedProgress);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Handle file upload errors
   */
  handleUploadError(err: Error, req: Request, res: Response, next: Function) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ 
        message: 'Server error during file upload', 
        error: err.message 
      });
    }
    
    next();
  }
}