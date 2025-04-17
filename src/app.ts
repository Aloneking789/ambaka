import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { ENV, UPLOAD_PATH } from './config/env';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import wardRoutes from './routes/ward.routes';
import projectRoutes from './routes/project.routes';
import roadRoutes from './routes/road.routes';
import milestoneRoutes from './routes/milestone.routes';
import progressRoutes from './routes/progress.routes';
import auditRoutes from './routes/audit.routes';

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS policy
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body
app.use(morgan('dev')); // HTTP request logger

// Serve uploaded files
app.use(`/${ENV.UPLOAD_DIR}`, express.static(UPLOAD_PATH));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/roads', roadRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/audit', auditRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
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
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

export default app;