import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

/**
 * Middleware to restrict access based on user roles
 * @param allowedRoles - Array of roles that are allowed to access the endpoint
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role as UserRole;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Access denied. You do not have permission to perform this action.' 
      });
    }

    next();
  };
};

// Specific role check middleware functions
export const isSuperAdmin = checkRole([UserRole.SUPER_ADMIN]);
export const isWardAdmin = checkRole([UserRole.SUPER_ADMIN, UserRole.WARD_ADMIN]);
export const isFieldEngineer = checkRole([UserRole.SUPER_ADMIN, UserRole.WARD_ADMIN, UserRole.FIELD_ENGINEER]);
export const isAuditor = checkRole([UserRole.SUPER_ADMIN, UserRole.AUDITOR]);
export const isAdmin = checkRole([UserRole.SUPER_ADMIN, UserRole.WARD_ADMIN]);