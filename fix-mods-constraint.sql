-- Script untuk memperbaiki constraint status dan menambahkan user moderator
-- Jalankan script ini step by step

-- Step 1: Periksa constraint yang ada
SELECT 'Current constraint:' as info;
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_status_check';

-- Step 2: Drop constraint lama jika ada
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- Step 3: Tambahkan constraint baru dengan nilai 'mods'
ALTER TABLE users ADD CONSTRAINT users_status_check 
    CHECK (status IN ('admin', 'user', 'mods'));

-- Step 4: Verifikasi constraint baru
SELECT 'New constraint:' as info;
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_status_check';

-- Step 5: Periksa status user yang ada
SELECT 'Current user statuses:' as info;
SELECT DISTINCT status, COUNT(*) as count
FROM users 
GROUP BY status;

-- Step 6: Update user menjadi moderator (ganti email sesuai kebutuhan)
-- UNCOMMENT dan ganti email sesuai user yang ingin dijadikan moderator
-- UPDATE users SET status = 'mods' WHERE email = 'your-moderator-email@example.com';

-- Step 7: Verifikasi user moderator
SELECT 'Moderator users:' as info;
SELECT id, nama, email, status, created_at
FROM users 
WHERE status = 'mods';
