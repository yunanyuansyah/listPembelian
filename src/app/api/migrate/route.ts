import { NextResponse } from 'next/server';
import { createProduct } from '@/lib/db';
import { products } from '@/data/products';

// POST /api/migrate - Migrate static data to database
export async function POST() {
  try {
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const product of products) {
      try {
        await createProduct({
          nama: product.nama,
          deskripsi: product.deskripsi,
          harga: product.harga,
          stok: product.stok,
          total_harga: product.harga * product.stok,
          image_path: product.image
        });
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Failed to migrate ${product.nama}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      message: 'Data migration completed',
      successCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to migrate data' },
      { status: 500 }
    );
  }
}
