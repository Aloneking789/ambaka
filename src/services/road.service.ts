import prisma from '../config/db';
import { validateCoordinates } from '../utils/geo';

interface RoadData {
  name: string;
  lengthKm: number;
  latitude: number;
  longitude: number;
  projectId: number;
}

export class RoadService {
  /**
   * Create a new road entry
   */
  async createRoad(data: RoadData) {
    const { name, lengthKm, latitude, longitude, projectId } = data;
    
    // Validate coordinates
    if (!validateCoordinates(latitude, longitude)) {
      throw new Error('Invalid coordinates');
    }
    
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Create new road
    const newRoad = await prisma.road.create({
      data: {
        name,
        lengthKm,
        latitude,
        longitude,
        projectId
      }
    });
    
    return newRoad;
  }
  
  /**
   * Get roads by project
   */
  async getRoadsByProject(projectId: number) {
    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    return prisma.road.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  /**
   * Get road by ID with geolocation
   */
  async getRoadById(roadId: number) {
    const road = await prisma.road.findUnique({
      where: { id: roadId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            wardId: true,
            ward: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    if (!road) {
      throw new Error('Road not found');
    }
    
    return road;
  }
}