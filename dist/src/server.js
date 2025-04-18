"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = __importDefault(require("./config/db"));
// Start the server
const server = app_1.default.listen(env_1.ENV.PORT, () => {
    console.log(`Server running on port ${env_1.ENV.PORT}`);
    console.log(`API Documentation available at http://localhost:${env_1.ENV.PORT}/`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Close server & exit process
    server.close(() => process.exit(1));
});
// Handle SIGTERM signal
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received');
    // Close server gracefully
    server.close(async () => {
        // Disconnect Prisma client
        await db_1.default.$disconnect();
        console.log('Process terminated');
        process.exit(0);
    });
});
exports.default = server;
