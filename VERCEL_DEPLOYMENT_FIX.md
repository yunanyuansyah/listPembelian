# Fix Vercel Deployment Issues

## 🚨 Masalah yang Ditemukan

Error 500 pada endpoint `/api/auth/login` dan `/api/auth/register` disebabkan oleh:

1. **Missing Environment Variables** - Tidak ada konfigurasi environment variables di Vercel
2. **Database Connection** - Aplikasi tidak bisa connect ke database
3. **SSL Configuration** - Konfigurasi SSL untuk production

## ✅ Solusi yang Sudah Diterapkan

### 1. File Konfigurasi Vercel

- ✅ Dibuat `vercel.json` untuk konfigurasi deployment
- ✅ Set maxDuration untuk API functions

### 2. Database Configuration

- ✅ Update `src/lib/db.ts` untuk SSL production
- ✅ Auto-detect production environment

### 3. Environment Variables Template

- ✅ Dibuat `env.example` sebagai template

## 🔧 Langkah-langkah Fix di Vercel

### Step 1: Setup Database di Vercel

1. **Buka Vercel Dashboard**
2. **Pilih project Anda**
3. **Go to Storage tab**
4. **Create new Postgres database**
5. **Copy connection string**

### Step 2: Set Environment Variables

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

```env
POSTGRES_URL=postgresql://username:password@host:port/database_name
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
NODE_ENV=production
```

### Step 3: Setup Database Schema

Setelah database dibuat, jalankan SQL script untuk membuat tabel:

```sql
-- Buat tabel users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nomor VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('admin', 'mods', 'user')) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel listPembelian
CREATE TABLE listPembelian (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    deskripsi VARCHAR(500),
    harga DECIMAL(10,2),
    stok INTEGER DEFAULT 0,
    total_harga DECIMAL(10,2),
    image_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buat indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_nomor ON users(nomor);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_listPembelian_nama ON listPembelian(nama);
```

### Step 4: Redeploy

1. **Commit changes** ke repository
2. **Push** ke GitHub
3. **Vercel akan auto-deploy**

## 🧪 Testing

Setelah deployment, test endpoint berikut:

```bash
# Test login
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test register
curl -X POST https://your-domain.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test User","email":"test@example.com","password":"password123","confirmPassword":"password123","nomor":"+6281234567890"}'
```

## 🔍 Debugging

### Check Vercel Logs

1. **Vercel Dashboard** → **Functions** tab
2. **Click pada function** yang error
3. **View logs** untuk detail error

### Common Issues

1. **Database Connection Error**

   - Check `POSTGRES_URL` format
   - Ensure database is accessible

2. **SSL Certificate Error**

   - Update `ssl: { rejectUnauthorized: false }` in db.ts

3. **Environment Variables Not Set**
   - Double-check all required env vars are set
   - Redeploy after setting env vars

## 📋 Checklist

- [ ] Database created in Vercel
- [ ] Environment variables set
- [ ] Database schema created
- [ ] Code pushed to repository
- [ ] Vercel auto-deployed
- [ ] Test login endpoint
- [ ] Test register endpoint
- [ ] Test other API endpoints

## 🎯 Expected Result

Setelah semua langkah di atas:

- ✅ Login endpoint working (200 response)
- ✅ Register endpoint working (200 response)
- ✅ Database connection established
- ✅ JWT tokens generated properly
- ✅ User authentication working

## 📞 Support

Jika masih ada masalah:

1. Check Vercel function logs
2. Verify environment variables
3. Test database connection manually
4. Check network connectivity
