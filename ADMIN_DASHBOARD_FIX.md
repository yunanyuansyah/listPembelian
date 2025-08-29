# Perbaikan Admin Dashboard - Error 403 Forbidden

## Masalah yang Ditemukan

Error 403 Forbidden pada endpoint `/api/users` yang dipanggil dari `AdminStats.tsx` terjadi karena:

1. **API users** masih menggunakan `checkAdminPermission` (hanya admin) bukan `checkAdminOrModeratorPermission`
2. **AdminStats** tidak mengirim JWT token dalam request
3. **Fungsi `checkAdminPermission`** tidak menggunakan `await` untuk async calls
4. **UserManagement** juga tidak mengirim JWT token

## Perbaikan yang Dilakukan

### 1. API Users (`src/app/api/users/route.ts`)

- ✅ Mengubah GET endpoint untuk menggunakan `checkAdminOrModeratorPermission`
- ✅ Menambahkan `await` untuk async permission checking
- ✅ Update error message untuk mencerminkan akses admin atau moderator

### 2. AdminStats (`src/components/AdminStats.tsx`)

- ✅ Menambahkan import `useAuth` dari AuthContext
- ✅ Menggunakan `tokens` dari useAuth
- ✅ Menambahkan Authorization header dengan JWT token

### 3. UserManagement (`src/components/UserManagement.tsx`)

- ✅ Menambahkan import `useAuth` dari AuthContext
- ✅ Menggunakan `tokens` dari useAuth
- ✅ Menambahkan Authorization header untuk semua API calls

### 4. API Users Individual (`src/app/api/users/[id]/route.ts`)

- ✅ Menambahkan `await` untuk semua `checkAdminPermission` calls
- ✅ Memperbaiki async/await pattern

### 5. API Users Status (`src/app/api/users/[id]/status/route.ts`)

- ✅ Menambahkan `await` untuk semua `checkAdminPermission` calls
- ✅ Memperbaiki async/await pattern

## Database Setup

Jalankan script berikut untuk mengupdate database:

```sql
-- 1. Drop constraint lama
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- 2. Tambahkan constraint baru dengan nilai 'mods'
ALTER TABLE users ADD CONSTRAINT users_status_check
    CHECK (status IN ('admin', 'user', 'mods'));

-- 3. Update user menjadi moderator (ganti email sesuai kebutuhan)
UPDATE users SET status = 'mods' WHERE email = 'your-email@example.com';
```

## Testing

1. **Login sebagai admin** - Dashboard harus berfungsi normal
2. **Login sebagai moderator** - Dashboard harus berfungsi normal
3. **Periksa statistik** - Harus menampilkan data users dan products
4. **Periksa user management** - Admin dapat mengelola users, moderator dapat melihat users

## Perbedaan Akses

### Admin (status: 'admin')

- ✅ Dapat melihat semua statistik
- ✅ Dapat mengelola users (create, update, delete, change status)
- ✅ Dapat mengelola products
- ✅ Akses penuh ke semua fitur

### Moderator (status: 'mods')

- ✅ Dapat melihat semua statistik
- ✅ Dapat melihat users (read-only)
- ✅ Dapat mengelola products (create, update, delete)
- ❌ Tidak dapat mengelola users (create, update, delete, change status)

## Troubleshooting

### Error: "Admin or Moderator access required to view users"

- Pastikan user sudah login
- Verifikasi status user di database adalah 'admin' atau 'mods'
- Periksa JWT token masih valid

### Error: "Failed to fetch statistics"

- Periksa console browser untuk error detail
- Pastikan JWT token tidak expired
- Verifikasi database connection

### Dashboard tidak menampilkan data

- Periksa network tab di browser DevTools
- Pastikan API calls mengirim Authorization header
- Verifikasi user memiliki permission yang benar

## File yang Diperbaiki

1. `src/app/api/users/route.ts`
2. `src/app/api/users/[id]/route.ts`
3. `src/app/api/users/[id]/status/route.ts`
4. `src/components/AdminStats.tsx`
5. `src/components/UserManagement.tsx`

## Script Database

- `fix-admin-dashboard.sql` - Script untuk mengupdate database constraint
