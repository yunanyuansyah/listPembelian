import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      POSTGRES_HOST: !!process.env.POSTGRES_HOST,
      POSTGRES_PORT: !!process.env.POSTGRES_PORT,
      POSTGRES_DATABASE: !!process.env.POSTGRES_DATABASE,
      POSTGRES_USERNAME: !!process.env.POSTGRES_USERNAME,
      POSTGRES_PASSWORD: !!process.env.POSTGRES_PASSWORD,
      NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json({
      message: 'Environment variables check',
      environment: envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to check environment variables' },
      { status: 500 }
    );
  }
}

