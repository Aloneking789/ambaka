"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOAD_PATH = exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
exports.ENV = {
    PORT: Number(process.env.PORT) || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads'
};
exports.UPLOAD_PATH = path_1.default.join(__dirname, '..', '..', exports.ENV.UPLOAD_DIR);
