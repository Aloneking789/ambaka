"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const db_1 = __importDefault(require("../config/db"));
const jwt_1 = require("../config/jwt");
const hash_1 = require("../utils/hash");
const client_1 = require("@prisma/client");
class AuthService {
    /**
     * Register a new user
     */
    async signup(data) {
        const { name, email, password, role = client_1.UserRole.WARD_ADMIN, wardId } = data;
        // Check if user already exists
        const existingUser = await db_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hash the password
        const hashedPassword = await (0, hash_1.hashPassword)(password);
        // Create new user
        const newUser = await db_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                wardId
            }
        });
        // Generate JWT token
        const payload = {
            userId: newUser.id,
            role: newUser.role
        };
        const token = (0, jwt_1.generateToken)(payload);
        return {
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                wardId: newUser.wardId
            },
            token
        };
    }
    /**
     * Authenticate a user and return token
     */
    async login(data) {
        const { email, password } = data;
        // Find user by email
        const user = await db_1.default.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // Validate password
        const isPasswordValid = await (0, hash_1.comparePasswords)(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Generate JWT token
        const payload = {
            userId: user.id,
            role: user.role
        };
        const token = (0, jwt_1.generateToken)(payload);
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                wardId: user.wardId
            },
            token
        };
    }
    /**
     * Get current user profile
     */
    async getUserProfile(userId) {
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
                }
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.AuthService = AuthService;
