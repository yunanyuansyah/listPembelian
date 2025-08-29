-- Script untuk setup moderator
-- Jalankan script ini untuk mengupdate database dan membuat user moderator

-- 1. Drop constraint lama
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- 2. Tambahkan constraint baru dengan nilai 'mods'
ALTER TABLE users ADD CONSTRAINT users_status_check 
    CHECK (status IN ('admin', 'user', 'mods'));

-- 3. Verifikasi constraint
SELECT 'Constraint updated successfully' as status;
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_status_check';

-- 4. Periksa user yang ada
SELECT 'Current users:' as info;
SELECT id, nama, email, status, created_at
FROM users 
ORDER BY created_at DESC;

-- 5. Update user menjadi moderator (ganti email sesuai kebutuhan)
-- UNCOMMENT baris di bawah dan ganti email dengan email user yang ingin dijadikan moderator
-- UPDATE users SET status = 'mods' WHERE email = 'your-email@example.com';

-- 6. Verifikasi user moderator
SELECT 'Moderator users:' as info;
SELECT id, nama, email, status, created_at
FROM users 
WHERE status = 'mods';

-- 7. Periksa semua status yang ada
SELECT 'All status types:' as info;
SELECT DISTINCT status, COUNT(*) as count
FROM users 
GROUP BY status;
