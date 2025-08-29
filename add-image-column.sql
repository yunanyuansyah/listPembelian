-- Add image column to listPembelian table
-- Run this script to add image support to existing database

-- Add image column
ALTER TABLE listPembelian ADD COLUMN IF NOT EXISTS image_path VARCHAR(500);

-- Update existing records to have null image_path
UPDATE listPembelian SET image_path = NULL WHERE image_path IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'listPembelian' 
AND column_name = 'image_path';

