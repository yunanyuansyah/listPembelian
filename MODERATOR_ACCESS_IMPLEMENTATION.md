# Implementasi Akses Moderator

## Ringkasan

Implementasi ini memungkinkan user dengan status `mods` (moderator) untuk mengakses fitur yang sebelumnya hanya tersedia untuk admin, yaitu:

- Menambah produk baru
- Mengedit produk yang sudah ada
- Menghapus produk
- Mengakses halaman admin dashboard

## Perubahan yang Dilakukan

### 1. Database Schema

- **File**: `add-mods-status.sql`
- **Perubahan**: Menambahkan nilai `'mods'` ke constraint status pada tabel users
- **Constraint baru**: `CHECK (status IN ('admin', 'user', 'mods'))`

### 2. Type Definitions

- **File**: `src/types/database.ts`
- **Perubahan**: Interface `User` sudah mendukung status `'mods'`
- **File**: `src/lib/jwt.ts`
- **Perubahan**: Interface `JWTPayload` sudah mendukung status `'mods'`

### 3. Authentication Context

- **File**: `src/contexts/AuthContext.tsx`
- **Perubahan**: Sudah memiliki dukungan untuk moderator
- **Properties baru**:
  - `isModerator`: boolean
  - `isAdminOrModerator`: boolean

### 4. Authentication Middleware

- **File**: `src/lib/auth.ts`
- **Perubahan**:
  - Menambahkan fungsi `checkAdminOrModeratorPermission()`
  - Mengupdate fungsi untuk menggunakan JWT authentication yang sebenarnya
  - Mendukung status `'mods'` dalam permission checking

### 5. Component Updates

#### AdminGuard

- **File**: `src/components/AdminGuard.tsx`
- **Perubahan**:
  - Menggunakan `isAdminOrModerator` instead of `isAdmin`
  - Mengizinkan akses untuk admin dan moderator
  - Update pesan error untuk mencerminkan akses admin atau moderator

#### ProtectedRoute

- **File**: `src/components/ProtectedRoute.tsx`
- **Perubahan**:
  - Menambahkan prop `requireAdminOrModerator`
  - Mendukung permission checking untuk admin atau moderator
  - Update pesan error yang sesuai

#### Admin Page

- **File**: `src/app/admin/page.tsx`
- **Perubahan**:
  - Menggunakan `requireAdminOrModerator` instead of `requireAdmin`
  - Dynamic title berdasarkan status user (Admin Dashboard vs Moderator Dashboard)
  - Dynamic badge color (purple untuk admin, blue untuk moderator)

#### Product List

- **File**: `src/components/Productlist.tsx`
- **Perubahan**:
  - Menggunakan `isAdminOrModerator` instead of `isAdmin`
  - Moderator dapat mengakses tombol tambah produk dan edit mode
  - Update komentar untuk mencerminkan akses admin atau moderator

### 6. API Routes

- **File**: `src/app/api/products/route.ts`
- **File**: `src/app/api/products/[id]/route.ts`
- **Perubahan**:
  - Menggunakan `checkAdminOrModeratorPermission()` untuk operasi POST, PUT, DELETE
  - Moderator dapat membuat, mengupdate, dan menghapus produk
  - Update error messages untuk mencerminkan akses admin atau moderator

### 7. Product Pages

- **File**: `src/app/products/add/page.tsx`
- **File**: `src/app/products/[id]/edit/page.tsx`
- **Perubahan**: Sudah menggunakan `AdminGuard` yang sekarang mendukung moderator

## Cara Menggunakan

### 1. Setup Database

Jalankan script SQL untuk menambahkan constraint status:

```sql
-- Drop constraint lama
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- Tambahkan constraint baru
ALTER TABLE users ADD CONSTRAINT users_status_check
    CHECK (status IN ('admin', 'user', 'mods'));
```

### 2. Membuat User Moderator

Update status user menjadi 'mods' di database:

```sql
UPDATE users SET status = 'mods' WHERE email = 'moderator@example.com';
```

### 3. Testing

1. Login sebagai user dengan status 'mods'
2. Verifikasi bahwa moderator dapat:
   - Mengakses halaman admin dashboard
   - Menambah produk baru
   - Mengedit produk yang sudah ada
   - Menghapus produk
   - Melihat tombol edit di product list

## Perbedaan Akses Admin vs Moderator

### Admin (status: 'admin')

- Akses penuh ke semua fitur
- Badge warna purple
- Title: "Admin Dashboard"

### Moderator (status: 'mods')

- Akses ke fitur manajemen produk
- Badge warna blue
- Title: "Moderator Dashboard"
- **Tidak memiliki akses ke**: User management (jika ada fitur khusus admin)

## Security Considerations

1. **JWT Authentication**: Semua API routes menggunakan JWT token verification
2. **Permission Checking**: Setiap operasi yang memerlukan permission akan memverifikasi status user
3. **Frontend Protection**: Komponen menggunakan guards untuk mencegah akses unauthorized
4. **Database Constraints**: Database memiliki constraint untuk memastikan status yang valid

## Future Enhancements

1. **Role-based Permissions**: Implementasi permission yang lebih granular
2. **Audit Logging**: Log semua aktivitas moderator
3. **Moderator Management**: Interface untuk admin mengelola moderator
4. **Limited Access**: Moderator hanya bisa mengedit produk tertentu

## Troubleshooting

### Error: "Admin or Moderator access required"

- Pastikan user sudah login
- Verifikasi status user di database adalah 'admin' atau 'mods'
- Periksa JWT token masih valid

### Error: "Access Denied"

- Pastikan user memiliki status yang benar
- Periksa apakah constraint database sudah diupdate
- Verifikasi JWT token tidak expired

### Database Constraint Error

- Jalankan script `add-mods-status.sql` untuk update constraint
- Pastikan tidak ada data yang melanggar constraint baru
