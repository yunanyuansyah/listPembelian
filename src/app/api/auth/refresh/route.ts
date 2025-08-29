import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, refreshAccessToken } from '@/lib/auth/jwt';
import { getUserById } from '@/lib/db';
// import { createAuthResponse } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Verify the refresh token
    const decoded = verifyToken(refreshToken);
    
    // Get user from database
    const user = await getUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password from user object
    const { password: _password, ...userWithoutPassword } = user;

    // Generate new access token
    const newAccessToken = refreshAccessToken(refreshToken, userWithoutPassword);

    return NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Token has expired' || error.message === 'Invalid token') {
        return NextResponse.json(
          { error: 'Invalid or expired refresh token' },
          { status: 401 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}
