# Database Setup Guide

## Overview

Project ini telah diintegrasikan dengan PostgreSQL database menggunakan Vercel Postgres. Database memiliki struktur tabel `listPembelian` dengan kolom-kolom yang sesuai dengan kebutuhan aplikasi.

## Database Schema

```sql
CREATE TABLE listPembelian (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    deskripsi VARCHAR(500),
    harga DECIMAL(10,2),
    stok INTEGER DEFAULT 0,
    total_harga DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Vercel Database

1. Deploy project ke Vercel:

   ```bash
   npx vercel
   ```

2. Di Vercel Dashboard:
   - Go to Storage → Create Database
   - Pilih "Postgres"
   - Database akan otomatis terhubung dengan environment variable `POSTGRES_URL`

### 3. Run Migration

1. Deploy project ke Vercel
2. Visit `/migrate` untuk migrasi data statis ke database
3. Atau gunakan API endpoint: `POST /api/migrate`

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `GET /api/products/[id]` - Get product by ID
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/products/search?q=query` - Search products

### Migration

- `POST /api/migrate` - Migrate static data to database

## Pages

### `/products`

- Menampilkan daftar produk dari database
- Fitur: Add, Edit, Delete products
- Real-time updates

### `/migrate`

- Halaman untuk migrasi data statis ke database
- Warning dan konfirmasi sebelum migrasi

## Components

### `ProductListDB`

- Menampilkan daftar produk dari database
- Loading states dan error handling
- CRUD operations

### `AddProductForm`

- Form untuk menambah produk baru
- Modal form dengan validasi
- Real-time integration dengan database

### `useProducts` Hook

- Custom hook untuk manage state produk
- CRUD operations
- Loading dan error states

## Database Functions

### `getAllProducts()`

Mengambil semua produk dari database

### `getProductById(id)`

Mengambil produk berdasarkan ID

### `createProduct(productData)`

Membuat produk baru

### `updateProduct(id, productData)`

Update produk yang sudah ada

### `deleteProduct(id)`

Menghapus produk

### `searchProducts(query)`

Mencari produk berdasarkan nama atau deskripsi

## Environment Variables

Vercel akan otomatis menyediakan:

- `POSTGRES_URL` - Connection string ke database
- `POSTGRES_PRISMA_URL` - Prisma connection string
- `POSTGRES_URL_NON_POOLING` - Non-pooling connection string

## Development

### Local Development

Untuk development lokal, Anda bisa menggunakan:

1. Vercel CLI dengan database remote
2. Local PostgreSQL dengan connection string

### Testing

- Test API endpoints menggunakan Postman atau curl
- Test UI components di `/products` dan `/migrate`

## Troubleshooting

### Common Issues

1. **Database connection error**: Pastikan `POSTGRES_URL` sudah di-set di Vercel
2. **Migration failed**: Pastikan tabel `listPembelian` sudah dibuat
3. **CORS issues**: API routes sudah dikonfigurasi dengan benar

### Debug Steps

1. Check Vercel function logs
2. Verify database connection
3. Test API endpoints secara terpisah
4. Check browser console untuk error

## Next Steps

1. **Deploy ke Vercel**: `npx vercel`
2. **Setup Database**: Create Postgres database di Vercel
3. **Run Migration**: Visit `/migrate` untuk migrasi data
4. **Test Application**: Visit `/products` untuk test functionality

## Security Notes

- API routes sudah include basic validation
- Database queries menggunakan parameterized queries untuk mencegah SQL injection
- Environment variables di-manage oleh Vercel secara otomatis
