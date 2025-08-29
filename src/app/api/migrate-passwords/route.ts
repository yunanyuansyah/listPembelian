import { NextRequest, NextResponse } from 'next/server';
import { migratePasswords, checkPasswordMigrationStatus } from '@/lib/migrate-passwords';

export async function GET(_request: NextRequest) {
  try {
    // Check migration status
    const status = await checkPasswordMigrationStatus();
    
    return NextResponse.json({
      message: 'Password migration status',
      ...status
    });
  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json(
      { error: 'Failed to check migration status' },
      { status: 500 }
    );
  }
}

export async function POST(_request: NextRequest) {
  try {
    // Run password migration
    await migratePasswords();
    
    return NextResponse.json({
      message: 'Password migration completed successfully'
    });
  } catch (error) {
    console.error('Error running password migration:', error);
    return NextResponse.json(
      { error: 'Failed to run password migration' },
      { status: 500 }
    );
  }
}
