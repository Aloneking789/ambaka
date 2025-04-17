import prisma from '../config/db';
import { JwtPayload, generateToken } from '../config/jwt';
import { hashPassword, comparePasswords } from '../utils/hash';
import { UserRole } from '@prisma/client';

interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  wardId?: number;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    wardId: number | null;
  };
  token: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const { name, email, password, role = UserRole.WARD_ADMIN, wardId } = data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        wardId
      }
    });
    
    // Generate JWT token
    const payload: JwtPayload = {
      userId: newUser.id,
      role: newUser.role
    };
    
    const token = generateToken(payload);
    
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
  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Validate password
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const payload: JwtPayload = {
      userId: user.id,
      role: user.role
    };
    
    const token = generateToken(payload);
    
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
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
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