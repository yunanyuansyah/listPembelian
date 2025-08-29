# Moderator Status Implementation

## Overview

Sistem sekarang mendukung 3 level user:

- **Admin**: Akses penuh ke semua fitur termasuk admin dashboard
- **Moderator**: Dapat mengelola produk tetapi tidak bisa mengakses admin dashboard
- **User**: Akses terbatas, hanya bisa melihat produk

## Fitur Moderator

### ✅ Yang Bisa Dilakukan Moderator:

1. **Mengelola Produk**:

   - Membuat produk baru
   - Mengedit produk yang ada
   - Menghapus produk
   - Mengupload gambar produk

2. **Akses Halaman**:

   - Halaman produk (`/products`)
   - Halaman tambah produk (`/products/add`)
   - Halaman edit produk (`/products/[id]/edit`)
   - Halaman profil (`/profile`)

3. **UI Features**:
   - Tombol "Manage Products" di hero section
   - Status badge "Moderator" dengan warna orange
   - Quick action buttons untuk mengelola produk

### ❌ Yang Tidak Bisa Dilakukan Moderator:

1. **Admin Dashboard**:

   - Tidak bisa mengakses `/admin`
   - Tidak bisa melihat user management
   - Tidak bisa mengubah status user lain
   - Tidak bisa melihat admin statistics

2. **User Management**:
   - Tidak bisa menambah user baru
   - Tidak bisa mengedit user lain
   - Tidak bisa menghapus user
   - Tidak bisa mengubah status user

## Implementasi Teknis

### Database Changes

```sql
-- Status column sudah mendukung 'mods'
-- Tidak perlu perubahan database tambahan
```

### API Endpoints

- **Products API**: Menggunakan `checkAdminOrModeratorPermission()`
- **Users API**: Tetap menggunakan `checkAdminPermission()`

### Components Updated

1. **UserManagement.tsx**: Menambahkan opsi "Moderator" di dropdown
2. **Hero.tsx**: Menampilkan tombol khusus untuk moderator
3. **AdminStats.tsx**: Menampilkan statistik moderator
4. **AuthContext.tsx**: Menambahkan `isModerator` dan `isAdminOrModerator`

### Permission System

```typescript
// Admin only
isAdmin(user); // true hanya untuk admin

// Admin or Moderator
isAdminOrModerator(user); // true untuk admin dan moderator

// Moderator only
isModerator(user); // true hanya untuk moderator
```

## Cara Menggunakan

### 1. Mengubah User menjadi Moderator

1. Login sebagai admin
2. Buka admin dashboard (`/admin`)
3. Pilih tab "User Management"
4. Cari user yang ingin diubah
5. Ubah status dari dropdown menjadi "Moderator"

### 2. Moderator Login

1. Login dengan akun moderator
2. Akan melihat tombol "Manage Products" di hero section
3. Status badge akan menampilkan "Moderator" dengan warna orange
4. Tidak akan melihat link "Admin" di header

### 3. Moderator Mengelola Produk

1. Klik "Manage Products" atau pergi ke `/products`
2. Bisa menambah, mengedit, atau menghapus produk
3. Semua fitur produk management tersedia

## Security Notes

- Moderator tidak bisa mengakses admin dashboard
- AdminGuard tetap hanya mengizinkan admin
- API endpoints untuk user management tetap admin-only
- Permission checks sudah diimplementasi di semua level

## Testing

1. Buat user dengan status 'mods'
2. Login sebagai moderator
3. Verifikasi bisa mengelola produk
4. Verifikasi tidak bisa mengakses `/admin`
5. Verifikasi UI menampilkan status moderator dengan benar
