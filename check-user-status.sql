-- Script untuk memeriksa status user dan constraint
-- Jalankan script ini untuk debugging

-- 1. Periksa constraint yang ada
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_status_check';

-- 2. Periksa semua status user yang ada
SELECT DISTINCT status, COUNT(*) as count
FROM users 
GROUP BY status;

-- 3. Periksa user dengan status 'mods'
SELECT id, nama, email, status, created_at
FROM users 
WHERE status = 'mods';

-- 4. Periksa semua user (untuk debugging)
SELECT id, nama, email, status, created_at
FROM users 
ORDER BY created_at DESC;
