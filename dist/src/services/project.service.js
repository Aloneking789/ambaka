"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const db_1 = __importDefault(require("../config/db"));
class ProjectService {
    /**
     * Create a new project
     */
    async createProject(data) {
        const { name, tenderId, wardId, startDate, endDate, status } = data;
        // Check if ward exists
        const ward = await db_1.default.ward.findUnique({
            where: { id: wardId }
        });
        if (!ward) {
            throw new Error('Ward not found');
        }
        // Create new project
        const newProject = await db_1.default.project.create({
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
        return db_1.default.project.findMany({
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
    async getProjectById(projectId) {
        const project = await db_1.default.project.findUnique({
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
    async updateProject(projectId, data) {
        // Check if project exists
        const project = await db_1.default.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new Error('Project not found');
        }
        // If updating ward, check if ward exists
        if (data.wardId) {
            const ward = await db_1.default.ward.findUnique({
                where: { id: data.wardId }
            });
            if (!ward) {
                throw new Error('Ward not found');
            }
        }
        // Update project
        const updatedProject = await db_1.default.project.update({
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
    async deleteProject(projectId) {
        // Check if project exists
        const project = await db_1.default.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new Error('Project not found');
        }
        // Delete project
        await db_1.default.project.delete({
            where: { id: projectId }
        });
        return { message: 'Project deleted successfully' };
    }
}
exports.ProjectService = ProjectService;
