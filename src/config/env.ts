import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

export const ENV = {
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads'
};

export const UPLOAD_PATH = path.join(__dirname, '..', '..', ENV.UPLOAD_DIR);