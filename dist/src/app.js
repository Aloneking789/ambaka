"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const ward_routes_1 = __importDefault(require("./routes/ward.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const road_routes_1 = __importDefault(require("./routes/road.routes"));
const milestone_routes_1 = __importDefault(require("./routes/milestone.routes"));
const progress_routes_1 = __importDefault(require("./routes/progress.routes"));
const audit_routes_1 = __importDefault(require("./routes/audit.routes"));
// Initialize express app
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)()); // CORS policy
app.use(express_1.default.json()); // Parse JSON request body
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded request body
app.use((0, morgan_1.default)('dev')); // HTTP request logger
// Serve uploaded files
app.use(`/${env_1.ENV.UPLOAD_DIR}`, express_1.default.static(env_1.UPLOAD_PATH));
// API routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/wards', ward_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/roads', road_routes_1.default);
app.use('/api/milestones', milestone_routes_1.default);
app.use('/api/progress', progress_routes_1.default);
app.use('/api/audit', audit_routes_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Geo Road Tracking API',
        version: '1.0.0',
        endpoints: [
            '/api/auth',
            '/api/users',
            '/api/wards',
            '/api/projects',
            '/api/roads',
            '/api/milestones',
            '/api/progress',
            '/api/audit'
        ]
    });
});
// 404 route handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
exports.default = app;
