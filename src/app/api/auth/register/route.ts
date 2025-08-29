import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { validatePassword } from '@/lib/auth/password';
import { generateTokenPair } from '@/lib/auth/jwt';
import { createAuthResponse } from '@/lib/auth/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, email, password, confirmPassword, nomor } = body;

    // Validation
    if (!nama || !email || !password || !confirmPassword || !nomor) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create new user (password will be hashed in createUser function)
    const newUser = await createUser({
      nama,
      email,
      password,
      nomor,
      status: 'user'
    });

    // Return user without password
    const { password: _password, ...userWithoutPassword } = newUser;
    
    // Generate JWT tokens for automatic login after registration
    const tokens = generateTokenPair(userWithoutPassword);
    
    // Create response with tokens
    const response = createAuthResponse(
      true,
      'User created successfully',
      userWithoutPassword,
      tokens
    );
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
