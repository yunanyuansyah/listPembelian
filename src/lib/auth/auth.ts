import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt';
import { getUserById } from '../db';

export interface User {
  id: number;
  nama: string;
  email: string;
  password: string;
  nomor: string;
  status: 'admin' | 'mods' | 'user';
  created_at: Date;
  updated_at: Date;
}

export function isAdmin(user: User | null): boolean {
  return user?.status === 'admin';
}

export function isModerator(user: User | null): boolean {
  return user?.status === 'mods';
}

export function isAdminOrModerator(user: User | null): boolean {
  return user?.status === 'admin' || user?.status === 'mods';
}

export function isUser(user: User | null): boolean {
  return user?.status === 'user';
}

// For API routes - check if user is admin
export async function checkAdminPermission(request: NextRequest): Promise<{ isAdmin: boolean; user: User | null }> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return { isAdmin: false, user: null };
    }
    
    const decoded = verifyToken(token);
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return { isAdmin: false, user: null };
    }
    
    return {
      isAdmin: user.status === 'admin',
      user: user
    };
  } catch (error) {
    console.error('Error checking admin permission:', error);
    return { isAdmin: false, user: null };
  }
}

// For API routes - check if user is admin or moderator
export async function checkAdminOrModeratorPermission(request: NextRequest): Promise<{ isAdminOrModerator: boolean; user: User | null }> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return { isAdminOrModerator: false, user: null };
    }
    
    const decoded = verifyToken(token);
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return { isAdminOrModerator: false, user: null };
    }
    
    return {
      isAdminOrModerator: user.status === 'admin' || user.status === 'mods',
      user: user
    };
  } catch (error) {
    console.error('Error checking admin or moderator permission:', error);
    return { isAdminOrModerator: false, user: null };
  }
}
