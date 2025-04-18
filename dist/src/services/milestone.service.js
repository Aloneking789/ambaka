"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MilestoneService = void 0;
const db_1 = __importDefault(require("../config/db"));
class MilestoneService {
    /**
     * Create a new milestone for a project
     */
    async createMilestone(data) {
        const { title, description, projectId, order } = data;
        // Check if project exists
        const project = await db_1.default.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new Error('Project not found');
        }
        // Create new milestone
        const newMilestone = await db_1.default.milestone.create({
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
    async getMilestonesByProject(projectId) {
        // Check if project exists
        const project = await db_1.default.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new Error('Project not found');
        }
        return db_1.default.milestone.findMany({
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
    async updateMilestone(milestoneId, data) {
        // Check if milestone exists
        const milestone = await db_1.default.milestone.findUnique({
            where: { id: milestoneId }
        });
        if (!milestone) {
            throw new Error('Milestone not found');
        }
        // Update milestone
        const updatedMilestone = await db_1.default.milestone.update({
            where: { id: milestoneId },
            data
        });
        return updatedMilestone;
    }
    /**
     * Delete a milestone
     */
    async deleteMilestone(milestoneId) {
        // Check if milestone exists
        const milestone = await db_1.default.milestone.findUnique({
            where: { id: milestoneId }
        });
        if (!milestone) {
            throw new Error('Milestone not found');
        }
        // Check if milestone has progress logs
        const progressLogsCount = await db_1.default.progressLog.count({
            where: { milestoneId }
        });
        if (progressLogsCount > 0) {
            throw new Error('Cannot delete milestone that has progress logs');
        }
        // Delete milestone
        await db_1.default.milestone.delete({
            where: { id: milestoneId }
        });
        return { message: 'Milestone deleted successfully' };
    }
}
exports.MilestoneService = MilestoneService;
