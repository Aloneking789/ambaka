import prisma from '../config/db';
import { UserRole } from '@prisma/client';
import { hashPassword } from '../utils/hash';

interface RoleAssignment {
  userId: string;
  role: UserRole;
  wardId?: number;
}

export class UserService {
  /**
   * Get all users (for admins)
   */
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        wardId: true,
        ward: {
          select: {
            id: true,
            name: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        wardId: true,
        ward: {
          select: {
            id: true,
            name: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }
  
  /**
   * Get users by ward ID
   */
  async getUsersByWard(wardId: number) {
    // Check if ward exists
    const ward = await prisma.ward.findUnique({
      where: { id: wardId }
    });
    
    if (!ward) {
      throw new Error('Ward not found');
    }
    
    return prisma.user.findMany({
      where: { wardId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
  
  /**
   * Assign or change user role
   */
  async assignRole(data: RoleAssignment) {
    const { userId, role, wardId } = data;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // If assigning to a ward, check if ward exists
    if (wardId) {
      const ward = await prisma.ward.findUnique({
        where: { id: wardId }
      });
      
      if (!ward) {
        throw new Error('Ward not found');
      }
    }
    
    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        wardId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        wardId: true,
        ward: {
          select: {
            id: true,
            name: true
          }
        },
        updatedAt: true
      }
    });
    
    return updatedUser;
  }
}