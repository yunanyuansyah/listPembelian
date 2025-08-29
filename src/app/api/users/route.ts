import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/db';
import { checkAdminOrModeratorPermission, checkAdminPermission } from '@/lib/auth/auth';
import { validatePassword } from '@/lib/auth/password';

// GET /api/users - Get all users (admin or moderator)
export async function GET(request: NextRequest) {
  try {
    // Check admin or moderator permission
    const { isAdminOrModerator } = await checkAdminOrModeratorPermission(request);
    if (!isAdminOrModerator) {
      return NextResponse.json(
        { error: 'Admin or Moderator access required to view users' },
        { status: 403 }
      );
    }

    const users = await getAllUsers();
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check admin permission (only admin can create users)
    const { isAdmin } = await checkAdminPermission(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required to create users' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { nama, email, password, nomor, status } = body;

    // Validation
    if (!nama || !email || !password || !nomor) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Create new user
    const newUser = await createUser({
      nama,
      email,
      password,
      nomor,
      status: status || 'user'
    });

    // Return user without password
    const { password: _password, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
