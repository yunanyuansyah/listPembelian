import { NextRequest, NextResponse } from 'next/server';
import { verifyUser } from '@/lib/db';
import { generateTokenPair } from '@/lib/auth/jwt';
import { createAuthResponse } from '@/lib/auth/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify user credentials (password comparison is now handled securely with bcrypt)
    const user = await verifyUser(email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user without password
    const { password: _password, ...userWithoutPassword } = user;
    
    // Generate JWT tokens
    const tokens = generateTokenPair(userWithoutPassword);
    
    // Create response with tokens
    const response = createAuthResponse(
      true,
      'Login successful',
      userWithoutPassword,
      tokens
    );
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}
