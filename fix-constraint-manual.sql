-- Manual fix for user status constraint
-- Run this directly in your PostgreSQL client

-- Step 1: Check current constraint
SELECT 
    conname as constraint_name,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND conname LIKE '%status%';

-- Step 2: Drop existing constraint (if any)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

-- Step 3: Add new constraint
ALTER TABLE users ADD CONSTRAINT users_status_check 
CHECK (status IN ('admin', 'mods', 'user'));

-- Step 4: Verify the constraint
SELECT 
    conname as constraint_name,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND conname LIKE '%status%';

-- Step 5: Test with a sample update (replace 1 with actual user ID)
-- UPDATE users SET status = 'mods' WHERE id = 1;

-- Step 6: Show all users
SELECT 
    id,
    nama,
    email,
    status,
    created_at
FROM users 
ORDER BY id;
