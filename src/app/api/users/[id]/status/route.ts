import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUserStatus } from '@/lib/db';
import { checkAdminPermission } from '@/lib/auth/auth';

// PUT /api/users/[id]/status - Update user status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin permission
    const { isAdmin } = await checkAdminPermission(request);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required to update user status' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['admin', 'mods', 'user'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "admin", "mods", or "user"' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from changing their own status
    const { user: currentUser } = await checkAdminPermission(request);
    if (currentUser && currentUser.id === userId) {
      return NextResponse.json(
        { error: 'Cannot change your own status' },
        { status: 400 }
      );
    }

    // Update user status
    const updatedUser = await updateUserStatus(userId, status);

    // Return user without password
    const { password, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user status:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Failed to update user status';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
