"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadService = void 0;
const db_1 = __importDefault(require("../config/db"));
const geo_1 = require("../utils/geo");
class RoadService {
    /**
     * Create a new road entry
     */
    async createRoad(data) {
        const { name, lengthKm, latitude, longitude, projectId } = data;
        // Validate coordinates
        if (!(0, geo_1.validateCoordinates)(latitude, longitude)) {
            throw new Error('Invalid coordinates');
        }
        // Check if project exists
        const project = await db_1.default.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new Error('Project not found');
        }
        // Create new road
        const newRoad = await db_1.default.road.create({
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
    async getRoadsByProject(projectId) {
        // Check if project exists
        const project = await db_1.default.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return db_1.default.road.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' }
        });
    }
    /**
     * Get road by ID with geolocation
     */
    async getRoadById(roadId) {
        const road = await db_1.default.road.findUnique({
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
exports.RoadService = RoadService;
