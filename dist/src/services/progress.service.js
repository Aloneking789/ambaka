"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const db_1 = __importDefault(require("../config/db"));
const fileUpload_1 = require("../utils/fileUpload");
class ProgressService {
    /**
     * Create a new progress log entry
     */
    async createProgressLog(data) {
        const { milestoneId, roadId, status, notes, photoFilename, createdBy } = data;
        // Check if milestone exists
        const milestone = await db_1.default.milestone.findUnique({
            where: { id: milestoneId },
            include: {
                project: true
            }
        });
        if (!milestone) {
            throw new Error('Milestone not found');
        }
        // Check if road exists and belongs to the same project
        const road = await db_1.default.road.findUnique({
            where: { id: roadId }
        });
        if (!road) {
            throw new Error('Road not found');
        }
        if (road.projectId !== milestone.projectId) {
            throw new Error('Road does not belong to the same project as milestone');
        }
        // Create new progress log
        const newProgressLog = await db_1.default.progressLog.create({
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
            newProgressLog.photoUrl = (0, fileUpload_1.getFileUrl)(photoFilename);
        }
        return newProgressLog;
    }
    /**
     * Get progress logs by project
     */
    async getProgressLogsByProject(projectId) {
        // Check if project exists
        const project = await db_1.default.project.findUnique({
            where: { id: projectId }
        });
        if (!project) {
            throw new Error('Project not found');
        }
        const logs = await db_1.default.progressLog.findMany({
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
                    photoUrl: (0, fileUpload_1.getFileUrl)(log.photoFilename)
                };
            }
            return log;
        });
        return logsWithPhotoUrls;
    }
    /**
     * Get progress logs by road
     */
    async getProgressLogsByRoad(roadId) {
        // Check if road exists
        const road = await db_1.default.road.findUnique({
            where: { id: roadId }
        });
        if (!road) {
            throw new Error('Road not found');
        }
        const logs = await db_1.default.progressLog.findMany({
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
                    photoUrl: (0, fileUpload_1.getFileUrl)(log.photoFilename)
                };
            }
            return log;
        });
        return logsWithPhotoUrls;
    }
    /**
     * Update progress log
     */
    async updateProgressLog(progressId, data) {
        // Check if progress log exists
        const progressLog = await db_1.default.progressLog.findUnique({
            where: { id: progressId }
        });
        if (!progressLog) {
            throw new Error('Progress log not found');
        }
        // If updating photo, delete old photo file
        if (data.photoFilename && progressLog.photoFilename) {
            try {
                await (0, fileUpload_1.removeFile)(progressLog.photoFilename);
            }
            catch (error) {
                console.error('Error removing old photo:', error);
            }
        }
        // Update progress log
        const updatedProgressLog = await db_1.default.progressLog.update({
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
            updatedProgressLog.photoUrl = (0, fileUpload_1.getFileUrl)(updatedProgressLog.photoFilename);
        }
        return updatedProgressLog;
    }
}
exports.ProgressService = ProgressService;
