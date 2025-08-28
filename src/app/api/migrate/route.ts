import { NextResponse } from 'next/server';
import { migrateData } from '@/scripts/migrate-data';

// POST /api/migrate - Migrate static data to database
export async function POST() {
  try {
    const result = await migrateData();
    return NextResponse.json({
      message: 'Data migration completed successfully',
      ...result
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to migrate data' },
      { status: 500 }
    );
  }
}
