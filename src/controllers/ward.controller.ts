import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { WardService } from '../services/ward.service';

const wardService = new WardService();

export const validateWard = [
  body('name').notEmpty().withMessage('Ward name is required'),
];

export class WardController {
  /**
   * Create a new ward
   */
  async createWard(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { name } = req.body;
      const newWard = await wardService.createWard({ name });
      
      return res.status(201).json(newWard);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  /**
   * Get all wards
   */
  async getAllWards(_req: Request, res: Response) {
    try {
      const wards = await wardService.getAllWards();
      return res.status(200).json(wards);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  /**
   * Get ward by ID with projects
   */
  async getWardById(req: Request, res: Response) {
    try {
      const wardId = parseInt(req.params.id);
      
      if (isNaN(wardId)) {
        return res.status(400).json({ message: 'Invalid ward ID' });
      }
      
      const ward = await wardService.getWardById(wardId);
      return res.status(200).json(ward);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
}