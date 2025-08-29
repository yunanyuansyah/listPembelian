-- Add moderator status support to users table
-- This script adds support for 'mods' status in the users table

-- First, let's check if we need to update the status column constraint
-- The status column should already support 'admin' and 'user', now we add 'mods'

-- Update existing users if needed (optional - only if you want to convert some users to moderators)
-- UPDATE users SET status = 'mods' WHERE email = 'moderator@example.com';

-- The status column should already be a VARCHAR that can accept 'mods'
-- If you need to explicitly add the constraint, uncomment the following:

-- ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;
-- ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('admin', 'mods', 'user'));

-- Verify the changes
SELECT 
    status,
    COUNT(*) as count
FROM users 
GROUP BY status
ORDER BY status;

-- Show all users with their current status
SELECT 
    id,
    nama,
    email,
    status,
    created_at
FROM users 
ORDER BY status, created_at DESC;
