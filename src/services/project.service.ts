import prisma from '../config/db';

interface ProjectData {
  name: string;
  tenderId: string;
  wardId: number;
  startDate: Date;
  endDate?: Date;
  status: string;
}

interface ProjectUpdateData {
  name?: string;
  tenderId?: string;
  wardId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
}

export class ProjectService {
  /**
   * Create a new project
   */
  async createProject(data: ProjectData) {
    const { name, tenderId, wardId, startDate, endDate, status } = data;
    
    // Check if ward exists
    const ward = await prisma.ward.findUnique({
      where: { id: wardId }
    });
    
    if (!ward) {
      throw new Error('Ward not found');
    }
    
    // Create new project
    const newProject = await prisma.project.create({
      data: {
        name,
        tenderId,
        wardId,
        startDate,
        endDate,
        status
      }
    });
    
    return newProject;
  }
  
  /**
   * Get all projects
   */
  async getAllProjects() {
    return prisma.project.findMany({
      include: {
        ward: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            roads: true,
            milestones: true
          }
        }
      }
    });
  }
  
  /**
   * Get project details by ID
   */
  async getProjectById(projectId: number) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        ward: {
          select: {
            id: true,
            name: true
          }
        },
        roads: true,
        milestones: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return project;
  }
  
  /**
   * Update project
   */
  async updateProject(projectId: number, data: ProjectUpdateData) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // If updating ward, check if ward exists
    if (data.wardId) {
      const ward = await prisma.ward.findUnique({
        where: { id: data.wardId }
      });
      
      if (!ward) {
        throw new Error('Ward not found');
      }
    }
    
    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        ward: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return updatedProject;
  }
  
  /**
   * Delete project
   */
  async deleteProject(projectId: number) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Delete project
    await prisma.project.delete({
      where: { id: projectId }
    });
    
    return { message: 'Project deleted successfully' };
  }
}