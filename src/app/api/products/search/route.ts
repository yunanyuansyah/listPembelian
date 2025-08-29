import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/db';

// GET /api/products/search?q=query - Search products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const products = await searchProducts(query);
    return NextResponse.json(products);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
