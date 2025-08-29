import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt';
import { getUserById } from '../db';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number;
    email: string;
    status: 'admin' | 'mods' | 'user';
  };
}

/**
 * Middleware to authenticate JWT tokens
 * @param request - Next.js request object
 * @returns User object if authenticated, null otherwise
 */
export async function authenticateToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return null;
    }
    
    const decoded = verifyToken(token);
    return decoded;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Middleware to check if user is admin
 * @param request - Next.js request object
 * @returns True if user is admin, false otherwise
 */
export async function requireAdmin(request: NextRequest): Promise<boolean> {
  const user = await authenticateToken(request);
  return user?.status === 'admin';
}

/**
 * Middleware to check if user is admin or moderator
 * @param request - Next.js request object
 * @returns True if user is admin or moderator, false otherwise
 */
export async function requireAdminOrModerator(request: NextRequest): Promise<boolean> {
  const user = await authenticateToken(request);
  return user?.status === 'admin' || user?.status === 'mods';
}

/**
 * Middleware to check if user is authenticated
 * @param request - Next.js request object
 * @returns True if user is authenticated, false otherwise
 */
export async function requireAuth(request: NextRequest): Promise<boolean> {
  const user = await authenticateToken(request);
  return user !== null;
}

/**
 * Get user from request with full user data
 * @param request - Next.js request object
 * @returns User object with full data or null
 */
export async function getUserFromRequest(request: NextRequest) {
  try {
    const tokenData = await authenticateToken(request);
    if (!tokenData) return null;
    
    const user = await getUserById(tokenData.userId);
    if (!user) return null;
    
    // Remove password from user object
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting user from request:', error);
    return null;
  }
}

/**
 * Create authentication response helper
 * @param success - Whether authentication was successful
 * @param message - Response message
 * @param user - User data (if successful)
 * @param tokens - Token pair (if successful)
 */
export function createAuthResponse(
  success: boolean,
  message: string,
  user?: {
    id: number;
    email: string;
    nama: string;
    nomor: string;
    status: string;
  },
  tokens?: { accessToken: string; refreshToken: string }
) {
  if (success && user && tokens) {
    return {
      success: true,
      message,
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
  
  return {
    success: false,
    message
  };
}
