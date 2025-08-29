-- Script untuk menambahkan nilai 'mods' ke constraint status yang sudah ada
-- Jalankan script ini jika kolom status sudah ada dengan constraint ('admin', 'user')

-- Langkah 1: Drop constraint lama
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- Langkah 2: Tambahkan constraint baru dengan nilai 'mods'
ALTER TABLE users ADD CONSTRAINT users_status_check 
    CHECK (status IN ('admin', 'user', 'mods'));

-- Langkah 3: Verifikasi constraint baru
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname = 'users_status_check';

-- Langkah 4: Test insert dengan nilai 'mods' (opsional)
-- INSERT INTO users (nama, email, password, nomor, status) 
-- VALUES ('Test Moderator', 'mod@test.com', 'mod123', '+6281234567899', 'mods');

-- Langkah 5: Tampilkan semua nilai status yang ada
SELECT DISTINCT status FROM users;
