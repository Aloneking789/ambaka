"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const db_1 = __importDefault(require("../config/db"));
class AuditService {
    /**
     * Log an action for auditing
     */
    async logAction(data) {
        const { action, entityType, entityId, details, userId } = data;
        // Create new audit log
        const auditLog = await db_1.default.auditLog.create({
            data: {
                action,
                entityType,
                entityId,
                details: details ? JSON.stringify(details) : null,
                userId
            }
        });
        return auditLog;
    }
    /**
     * Get all audit logs (for super admin)
     */
    async getAllLogs(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            db_1.default.auditLog.findMany({
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            db_1.default.auditLog.count()
        ]);
        // Parse JSON details if present
        const formattedLogs = logs.map(log => ({
            ...log,
            details: log.details ? JSON.parse(log.details) : null
        }));
        return {
            logs: formattedLogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    /**
     * Get logs by user
     */
    async getLogsByUser(userId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        // Check if user exists
        const user = await db_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const [logs, total] = await Promise.all([
            db_1.default.auditLog.findMany({
                where: { userId },
                skip,
                take: limit,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            db_1.default.auditLog.count({
                where: { userId }
            })
        ]);
        // Parse JSON details if present
        const formattedLogs = logs.map(log => ({
            ...log,
            details: log.details ? JSON.parse(log.details) : null
        }));
        return {
            logs: formattedLogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
exports.AuditService = AuditService;
