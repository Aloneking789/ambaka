"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WardService = void 0;
const db_1 = __importDefault(require("../config/db"));
class WardService {
    /**
     * Create a new ward
     */
    async createWard(data) {
        const { name } = data;
        // Create new ward
        const newWard = await db_1.default.ward.create({
            data: { name }
        });
        return newWard;
    }
    /**
     * Get all wards
     */
    async getAllWards() {
        return db_1.default.ward.findMany({
            include: {
                _count: {
                    select: {
                        projects: true,
                        users: true
                    }
                }
            }
        });
    }
    /**
     * Get ward details with associated projects
     */
    async getWardById(wardId) {
        const ward = await db_1.default.ward.findUnique({
            where: { id: wardId },
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        tenderId: true,
                        startDate: true,
                        endDate: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                roads: true,
                                milestones: true
                            }
                        }
                    }
                },
                users: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                _count: {
                    select: {
                        projects: true,
                        users: true
                    }
                }
            }
        });
        if (!ward) {
            throw new Error('Ward not found');
        }
        return ward;
    }
}
exports.WardService = WardService;
