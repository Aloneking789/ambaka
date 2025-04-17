import prisma from '../config/db';

interface AuditLogData {
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  userId: string;
}

export class AuditService {
  /**
   * Log an action for auditing
   */
  async logAction(data: AuditLogData) {
    const { action, entityType, entityId, details, userId } = data;
    
    // Create new audit log
    const auditLog = await prisma.auditLog.create({
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
      prisma.auditLog.findMany({
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
      prisma.auditLog.count()
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
  async getLogsByUser(userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
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
      prisma.auditLog.count({
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