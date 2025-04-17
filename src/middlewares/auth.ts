import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../config/jwt';

// Extend Express Request interface to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = verifyToken(token);
    
    req.user = {
      userId: decodedToken.userId,
      role: decodedToken.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};