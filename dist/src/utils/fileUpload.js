"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFile = exports.getFileUrl = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
// Ensure upload directory exists
if (!fs_1.default.existsSync(env_1.UPLOAD_PATH)) {
    fs_1.default.mkdirSync(env_1.UPLOAD_PATH, { recursive: true });
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, env_1.UPLOAD_PATH);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const fileExtension = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
    },
});
// File filter for images
const imageFileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, JPG, and PNG are allowed.'));
    }
};
// Export configured multer instance for image uploads
exports.uploadImage = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: imageFileFilter,
});
// Get publicly accessible URL for a file
const getFileUrl = (filename) => {
    return `/uploads/${filename}`;
};
exports.getFileUrl = getFileUrl;
// Remove a file
const removeFile = (filename) => {
    return new Promise((resolve, reject) => {
        const filePath = path_1.default.join(env_1.UPLOAD_PATH, filename);
        fs_1.default.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.removeFile = removeFile;
