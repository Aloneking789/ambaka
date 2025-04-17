import prisma from '../config/db';
import { getFileUrl, removeFile } from '../utils/fileUpload';

interface ProgressData {
  milestoneId: number;
  roadId: number;
  status: string;
  notes?: string;
  photoFilename?: string;
  createdBy: string;
}

interface ProgressUpdateData {
  status?: string;
  notes?: string;
  photoFilename?: string;
}

export class ProgressService {
  /**
   * Create a new progress log entry
   */
  async createProgressLog(data: ProgressData) {
    const { milestoneId, roadId, status, notes, photoFilename, createdBy } = data;
    
    // Check if milestone exists
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: {
        project: true
      }
    });
    
    if (!milestone) {
      throw new Error('Milestone not found');
    }
    
    // Check if road exists and belongs to the same project
    const road = await prisma.road.findUnique({
      where: { id: roadId }
    });
    
    if (!road) {
      throw new Error('Road not found');
    }
    
    if (road.projectId !== milestone.projectId) {
      throw new Error('Road does not belong to the same project as milestone');
    }
    
    // Create new progress log
    const newProgressLog = await prisma.progressLog.create({
      data: {
        milestoneId,
        roadId,
        status,
        notes,
        photoFilename,
        createdById: createdBy
      },
      include: {
        milestone: {
          select: {
            id: true,
            title: true
          }
        },
        road: {
          select: {
            id: true,
            name: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Add photo URL if photoFilename is provided
    if (photoFilename) {
      (newProgressLog as any).photoUrl = getFileUrl(photoFilename);
    }
    
    return newProgressLog;
  }
  
  /**
   * Get progress logs by project
   */
  async getProgressLogsByProject(projectId: number) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    const logs = await prisma.progressLog.findMany({
      where: {
        milestone: {
          projectId
        }
      },
      include: {
        milestone: {
          select: {
            id: true,
            title: true,
            projectId: true
          }
        },
        road: {
          select: {
            id: true,
            name: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Add photo URLs
    const logsWithPhotoUrls = logs.map(log => {
      if (log.photoFilename) {
        return {
          ...log,
          photoUrl: getFileUrl(log.photoFilename)
        };
      }
      return log;
    });
    
    return logsWithPhotoUrls;
  }
  
  /**
   * Get progress logs by road
   */
  async getProgressLogsByRoad(roadId: number) {
    // Check if road exists
    const road = await prisma.road.findUnique({
      where: { id: roadId }
    });
    
    if (!road) {
      throw new Error('Road not found');
    }
    
    const logs = await prisma.progressLog.findMany({
      where: { roadId },
      include: {
        milestone: {
          select: {
            id: true,
            title: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Add photo URLs
    const logsWithPhotoUrls = logs.map(log => {
      if (log.photoFilename) {
        return {
          ...log,
          photoUrl: getFileUrl(log.photoFilename)
        };
      }
      return log;
    });
    
    return logsWithPhotoUrls;
  }
  
  /**
   * Update progress log
   */
  async updateProgressLog(progressId: number, data: ProgressUpdateData) {
    // Check if progress log exists
    const progressLog = await prisma.progressLog.findUnique({
      where: { id: progressId }
    });
    
    if (!progressLog) {
      throw new Error('Progress log not found');
    }
    
    // If updating photo, delete old photo file
    if (data.photoFilename && progressLog.photoFilename) {
      try {
        await removeFile(progressLog.photoFilename);
      } catch (error) {
        console.error('Error removing old photo:', error);
      }
    }
    
    // Update progress log
    const updatedProgressLog = await prisma.progressLog.update({
      where: { id: progressId },
      data,
      include: {
        milestone: {
          select: {
            id: true,
            title: true
          }
        },
        road: {
          select: {
            id: true,
            name: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Add photo URL if photoFilename exists
    if (updatedProgressLog.photoFilename) {
      (updatedProgressLog as any).photoUrl = getFileUrl(updatedProgressLog.photoFilename);
    }
    
    return updatedProgressLog;
  }
}