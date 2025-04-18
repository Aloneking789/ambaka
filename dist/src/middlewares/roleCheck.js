"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuditor = exports.isFieldEngineer = exports.isWardAdmin = exports.isSuperAdmin = exports.checkRole = void 0;
const client_1 = require("@prisma/client");
/**
 * Middleware to restrict access based on user roles
 * @param allowedRoles - Array of roles that are allowed to access the endpoint
 */
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const userRole = req.user.role;
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: 'Access denied. You do not have permission to perform this action.'
            });
        }
        next();
    };
};
exports.checkRole = checkRole;
// Specific role check middleware functions
exports.isSuperAdmin = (0, exports.checkRole)([client_1.UserRole.SUPER_ADMIN]);
exports.isWardAdmin = (0, exports.checkRole)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.WARD_ADMIN]);
exports.isFieldEngineer = (0, exports.checkRole)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.WARD_ADMIN, client_1.UserRole.FIELD_ENGINEER]);
exports.isAuditor = (0, exports.checkRole)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.AUDITOR]);
exports.isAdmin = (0, exports.checkRole)([client_1.UserRole.SUPER_ADMIN, client_1.UserRole.WARD_ADMIN]);
