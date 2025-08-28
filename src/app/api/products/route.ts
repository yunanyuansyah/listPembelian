import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, deskripsi, harga, stok, total_harga } = body;

    // Validation
    if (!nama) {
      return NextResponse.json(
        { error: 'Nama is required' },
        { status: 400 }
      );
    }

    const product = await createProduct({
      nama,
      deskripsi: deskripsi || null,
      harga: harga || null,
      stok: stok || 0,
      total_harga: total_harga || null,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
