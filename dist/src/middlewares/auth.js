"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../config/jwt");
/**
 * Authentication middleware to verify JWT tokens
 */
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = (0, jwt_1.verifyToken)(token);
        req.user = {
            userId: decodedToken.userId,
            role: decodedToken.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticate = authenticate;
