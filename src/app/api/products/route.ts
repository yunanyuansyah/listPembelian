import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';
import { checkAdminOrModeratorPermission } from '@/lib/auth/auth';
import fs from 'fs';
import path from 'path';

// GET /api/products - Get all products
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    // Check admin or moderator permission
    const { isAdminOrModerator } = await checkAdminOrModeratorPermission(request);
    if (!isAdminOrModerator) {
      return NextResponse.json(
        { error: 'Admin or Moderator access required to create products' },
        { status: 403 }
      );
    }
    // Check if request is FormData (file upload) or JSON
    const contentType = request.headers.get('content-type') || '';
    
    let nama, deskripsi, harga, stok, total_harga, imageFile;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData (file upload)
      const formData = await request.formData();
      nama = formData.get('nama') as string;
      deskripsi = formData.get('deskripsi') as string;
      harga = parseFloat(formData.get('harga') as string);
      stok = parseInt(formData.get('stok') as string);
      total_harga = parseFloat(formData.get('total_harga') as string);
      imageFile = formData.get('image') as File | null;
      
      console.log('FormData received:', { nama, deskripsi, harga, stok, total_harga, hasImage: !!imageFile });
    } else {
      // Handle JSON (backward compatibility)
      const body = await request.json();
      ({ nama, deskripsi, harga, stok, total_harga } = body);
      imageFile = null;
      
      console.log('JSON received:', { nama, deskripsi, harga, stok, total_harga });
    }

    // Validation
    if (!nama) {
      return NextResponse.json(
        { error: 'Nama is required' },
        { status: 400 }
      );
    }

    // Handle image upload if present
    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
      console.log('Image file received:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type
      });
      
      try {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Generate unique filename
        const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Convert file to buffer and save
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        fs.writeFileSync(filePath, buffer);
        
        imagePath = `/uploads/${fileName}`;
        console.log('Image saved to:', imagePath);
      } catch (error) {
        console.error('Error saving image:', error);
        // Continue without image if save fails
        imagePath = null;
      }
    }

    // Check if database connection is available
    if (!process.env.POSTGRES_URL) {
      console.error('Database connection string not found');
      return NextResponse.json(
        { error: 'Database not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const product = await createProduct({
      nama,
      deskripsi: deskripsi || null,
      harga: harga || null,
      stok: stok || 0,
      total_harga: total_harga || null,
      image_path: imagePath,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: errorMessage,
        suggestion: 'Please check your database connection and try again.'
      },
      { status: 500 }
    );
  }
}
