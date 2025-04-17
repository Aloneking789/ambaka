import prisma from '../config/db';

interface WardData {
  name: string;
}

export class WardService {
  /**
   * Create a new ward
   */
  async createWard(data: WardData) {
    const { name } = data;
    
    // Create new ward
    const newWard = await prisma.ward.create({
      data: { name }
    });
    
    return newWard;
  }
  
  /**
   * Get all wards
   */
  async getAllWards() {
    return prisma.ward.findMany({
      include: {
        _count: {
          select: {
            projects: true,
            users: true
          }
        }
      }
    });
  }
  
  /**
   * Get ward details with associated projects
   */
  async getWardById(wardId: number) {
    const ward = await prisma.ward.findUnique({
      where: { id: wardId },
      include: {
        projects: {
          select: {
            id: true,
            name: true,
            tenderId: true,
            startDate: true,
            endDate: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            _count: {
              select: {
                roads: true,
                milestones: true
              }
            }
          }
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            projects: true,
            users: true
          }
        }
      }
    });
    
    if (!ward) {
      throw new Error('Ward not found');
    }
    
    return ward;
  }
}