-- Fix user status constraint to support 'mods' status
-- This script ensures the database allows 'admin', 'mods', and 'user' status values

-- First, let's check the current constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND conname LIKE '%status%';

-- Drop existing constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- Add new constraint that allows all three status values
ALTER TABLE users ADD CONSTRAINT users_status_check 
CHECK (status IN ('admin', 'mods', 'user'));

-- Verify the constraint was added
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND conname LIKE '%status%';

-- Test the constraint by trying to update a user (replace 1 with actual user ID)
-- UPDATE users SET status = 'mods' WHERE id = 1;

-- Show current users and their status
SELECT 
    id,
    nama,
    email,
    status,
    created_at
FROM users 
ORDER BY id;
