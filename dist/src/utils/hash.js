"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePasswords = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Hash a password using bcrypt
 */
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
/**
 * Compare a plain password with a hashed password
 */
const comparePasswords = async (plainPassword, hashedPassword) => {
    return bcryptjs_1.default.compare(plainPassword, hashedPassword);
};
exports.comparePasswords = comparePasswords;
