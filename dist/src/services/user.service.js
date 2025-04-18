"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = __importDefault(require("../config/db"));
class UserService {
    /**
     * Get all users (for admins)
     */
    async getAllUsers() {
        return db_1.default.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                wardId: true,
                ward: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });
    }
    /**
     * Get user by ID
     */
    async getUserById(userId) {
        const user = await db_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                wardId: true,
                ward: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    /**
     * Get users by ward ID
     */
    async getUsersByWard(wardId) {
        // Check if ward exists
        const ward = await db_1.default.ward.findUnique({
            where: { id: wardId }
        });
        if (!ward) {
            throw new Error('Ward not found');
        }
        return db_1.default.user.findMany({
            where: { wardId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
    }
    /**
     * Assign or change user role
     */
    async assignRole(data) {
        const { userId, role, wardId } = data;
        // Check if user exists
        const user = await db_1.default.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // If assigning to a ward, check if ward exists
        if (wardId) {
            const ward = await db_1.default.ward.findUnique({
                where: { id: wardId }
            });
            if (!ward) {
                throw new Error('Ward not found');
            }
        }
        // Update user role
        const updatedUser = await db_1.default.user.update({
            where: { id: userId },
            data: {
                role,
                wardId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                wardId: true,
                ward: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                updatedAt: true
            }
        });
        return updatedUser;
    }
}
exports.UserService = UserService;
