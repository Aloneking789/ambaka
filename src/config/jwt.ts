import jwt from 'jsonwebtoken';
import { ENV } from './env';

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};