# Cara Menambahkan Nilai 'mods' ke Constraint Status

Jika Anda sudah memiliki database dengan kolom `status` yang memiliki constraint `CHECK (status IN ('admin', 'user'))`, dan ingin menambahkan nilai 'mods', ikuti langkah-langkah berikut:

## Metode 1: Menggunakan Script SQL Langsung

1. **Jalankan script SQL:**

   ```bash
   psql -h localhost -p 5432 -U postgres -d listbarang_db -f add-mods-status.sql
   ```

2. **Masukkan password PostgreSQL ketika diminta**

## Metode 2: Menggunakan PowerShell Script

1. **Jalankan script PowerShell:**

   ```powershell
   .\add-mods-status.ps1
   ```

2. **Masukkan parameter jika diperlukan:**
   ```powershell
   .\add-mods-status.ps1 -DatabaseName "listbarang_db" -Host "localhost" -Port "5432" -Username "postgres"
   ```

## Metode 3: Manual SQL Commands

Jika Anda ingin menjalankan secara manual:

```sql
-- 1. Drop constraint lama
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- 2. Tambahkan constraint baru dengan nilai 'mods'
ALTER TABLE users ADD CONSTRAINT users_status_check
    CHECK (status IN ('admin', 'user', 'mods'));

-- 3. Verifikasi constraint baru
SELECT conname, consrc
FROM pg_constraint
WHERE conname = 'users_status_check';
```

## Verifikasi Hasil

Setelah menjalankan script, Anda dapat memverifikasi dengan:

```sql
-- Lihat constraint yang aktif
SELECT conname, consrc
FROM pg_constraint
WHERE conname = 'users_status_check';

-- Test insert dengan nilai 'mods'
INSERT INTO users (nama, email, password, nomor, status)
VALUES ('Test Moderator', 'mod@test.com', 'mod123', '+6281234567899', 'mods');

-- Lihat semua nilai status yang ada
SELECT DISTINCT status FROM users;
```

## Catatan Penting

- Pastikan tidak ada data yang melanggar constraint sebelum menjalankan script
- Backup database sebelum melakukan perubahan struktur
- Script ini aman untuk dijalankan berulang kali (menggunakan `IF EXISTS`)

## Troubleshooting

Jika terjadi error:

1. **Constraint tidak ditemukan:** Pastikan nama constraint benar
2. **Permission denied:** Pastikan user memiliki privilege ALTER TABLE
3. **Database tidak ditemukan:** Periksa nama database dan koneksi

## Hasil Akhir

Setelah berhasil, kolom `status` akan dapat menerima nilai:

- `'admin'`
- `'user'`
- `'mods'`
