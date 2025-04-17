import { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { UserService } from '../services/user.service';
import { UserRole } from '@prisma/client';

const userService = new UserService();

export const validateRoleAssignment = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role').isIn(Object.values(UserRole)).withMessage('Invalid role'),
];

export class UserController {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  /**
   * Get users by ward
   */
  async getUsersByWard(req: Request, res: Response) {
    try {
      const wardId = parseInt(req.params.wardId);
      
      if (isNaN(wardId)) {
        return res.status(400).json({ message: 'Invalid ward ID' });
      }
      
      const users = await userService.getUsersByWard(wardId);
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  }
  
  /**
   * Assign or change user role
   */
  async assignRole(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { userId, role, wardId } = req.body;
      
      const updatedUser = await userService.assignRole({
        userId,
        role,
        wardId: wardId ? parseInt(wardId) : undefined
      });
      
      return res.status(200).json(updatedUser);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}