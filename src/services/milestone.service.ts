import prisma from '../config/db';

interface MilestoneData {
  title: string;
  description?: string;
  projectId: number;
  order: number;
}

interface MilestoneUpdateData {
  title?: string;
  description?: string;
  order?: number;
}

export class MilestoneService {
  /**
   * Create a new milestone for a project
   */
  async createMilestone(data: MilestoneData) {
    const { title, description, projectId, order } = data;
    
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Create new milestone
    const newMilestone = await prisma.milestone.create({
      data: {
        title,
        description,
        projectId,
        order
      }
    });
    
    return newMilestone;
  }
  
  /**
   * Get milestones by project
   */
  async getMilestonesByProject(projectId: number) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return prisma.milestone.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            progressLogs: true
          }
        }
      }
    });
  }
  
  /**
   * Update a milestone
   */
  async updateMilestone(milestoneId: number, data: MilestoneUpdateData) {
    // Check if milestone exists
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId }
    });
    
    if (!milestone) {
      throw new Error('Milestone not found');
    }
    
    // Update milestone
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data
    });
    
    return updatedMilestone;
  }
  
  /**
   * Delete a milestone
   */
  async deleteMilestone(milestoneId: number) {
    // Check if milestone exists
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId }
    });
    
    if (!milestone) {
      throw new Error('Milestone not found');
    }
    
    // Check if milestone has progress logs
    const progressLogsCount = await prisma.progressLog.count({
      where: { milestoneId }
    });
    
    if (progressLogsCount > 0) {
      throw new Error('Cannot delete milestone that has progress logs');
    }
    
    // Delete milestone
    await prisma.milestone.delete({
      where: { id: milestoneId }
    });
    
    return { message: 'Milestone deleted successfully' };
  }
}