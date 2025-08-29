# Troubleshooting Guide

## Error 500: Failed to create product

Jika Anda mengalami error 500 saat mencoba menambahkan product, ikuti langkah-langkah berikut:

### 1. Periksa Environment Variables

Pastikan file `.env.local` sudah dibuat dan berisi konfigurasi database yang benar:

```bash
# Jalankan setup environment
node setup-env.js
```

### 2. Setup Database

Pastikan PostgreSQL sudah berjalan dan database sudah dibuat:

```bash
# Buat database
psql -U [username] -c "CREATE DATABASE listbarang_db;"

# Setup tabel dan data
psql -U [username] -d listbarang_db -f database-setup.sql
```

### 3. Periksa Koneksi Database

Pastikan PostgreSQL service berjalan:

```bash
# Windows
net start postgresql

# Linux/Mac
sudo systemctl start postgresql
```

### 4. Restart Development Server

Setelah setup environment variables:

```bash
npm run dev
```

### 5. Periksa Log Error

Lihat console browser dan terminal untuk error message yang lebih detail.

### 6. Test Database Connection

Anda bisa test koneksi database dengan mengunjungi:

- `http://localhost:3000/api/products` (GET) - untuk melihat semua products
- `http://localhost:3000/api/test-env` - untuk test environment variables

## Common Issues

### Issue 1: Environment Variables Not Found

**Error**: "Database not configured"
**Solution**: Jalankan `node setup-env.js` dan restart server

### Issue 2: Database Connection Failed

**Error**: "Failed to create product" dengan detail connection error
**Solution**:

1. Pastikan PostgreSQL berjalan
2. Periksa username/password di `.env.local`
3. Pastikan database `listbarang_db` sudah dibuat

### Issue 3: Table Not Found

**Error**: "relation 'listPembelian' does not exist"
**Solution**: Jalankan `psql -U [username] -d listbarang_db -f database-setup.sql`

### Issue 4: Permission Denied

**Error**: "permission denied for database"
**Solution**: Pastikan user PostgreSQL memiliki permission untuk database

## Quick Fix Commands

```bash
# 1. Setup environment
node setup-env.js

# 2. Create database (ganti [username] dengan username PostgreSQL Anda)
psql -U [username] -c "CREATE DATABASE listbarang_db;"

# 3. Setup tables
psql -U [username] -d listbarang_db -f database-setup.sql

# 4. Restart server
npm run dev
```

## Default Database Credentials

Jika menggunakan setup default:

- **Host**: localhost
- **Port**: 5432
- **Database**: listbarang_db
- **Username**: (sesuai input saat setup)
- **Password**: (sesuai input saat setup)

## Sample Data

Database akan diisi dengan sample data:

- 8 sample products
- 4 sample users (1 admin, 3 users)

## Support

Jika masih mengalami masalah, periksa:

1. Console browser untuk error details
2. Terminal untuk server logs
3. PostgreSQL logs untuk database errors

