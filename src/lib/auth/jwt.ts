import * as jwt from 'jsonwebtoken';
import { User } from '@/types/database';

// JWT secret key - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; // 7 days default
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d'; // 30 days for refresh token

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface JWTPayload {
  userId: number;
  email: string;
  status: 'admin' | 'mods' | 'user';
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token for user
 * @param user - User object
 * @returns JWT access token
 */
export function generateAccessToken(user: Omit<User, 'password'>): string {
  try {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      status: user.status
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'listbarang-app',
      audience: 'listbarang-users'
    } as jwt.SignOptions);
  } catch (error) {
    console.error('Error generating access token:', error);
    throw new Error('Failed to generate access token');
  }
}

/**
 * Generate refresh token for user
 * @param user - User object
 * @returns JWT refresh token
 */
export function generateRefreshToken(user: Omit<User, 'password'>): string {
  try {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      status: user.status
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'listbarang-app',
      audience: 'listbarang-users'
    } as jwt.SignOptions);
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
}

/**
 * Generate both access and refresh tokens
 * @param user - User object
 * @returns Object containing both tokens
 */
export function generateTokenPair(user: Omit<User, 'password'>): TokenPair {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
}

/**
 * Verify and decode JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'listbarang-app',
      audience: 'listbarang-users'
    } as jwt.VerifyOptions) as JWTPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      console.error('Error verifying token:', error);
      throw new Error('Failed to verify token');
    }
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Check if token is expired
 * @param token - JWT token
 * @returns True if token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (_error) {
    return true;
  }
}

/**
 * Get token expiration time
 * @param token - JWT token
 * @returns Expiration timestamp or null
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded?.exp || null;
  } catch (_error) {
    return null;
  }
}

/**
 * Refresh access token using refresh token
 * @param refreshToken - Refresh token
 * @param user - User object
 * @returns New access token
 */
export function refreshAccessToken(refreshToken: string, user: Omit<User, 'password'>): string {
  try {
    // Verify the refresh token first
    const decoded = verifyToken(refreshToken);
    
    // Check if the user ID matches
    if (decoded.userId !== user.id) {
      throw new Error('Invalid refresh token');
    }
    
    // Generate new access token
    return generateAccessToken(user);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token');
  }
}
