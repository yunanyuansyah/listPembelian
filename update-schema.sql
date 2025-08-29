-- Update database schema to support larger numbers
-- Run this script to update existing database

-- Update harga column to support larger numbers
ALTER TABLE listPembelian ALTER COLUMN harga TYPE DECIMAL(15,2);

-- Update total_harga column to support larger numbers  
ALTER TABLE listPembelian ALTER COLUMN total_harga TYPE DECIMAL(15,2);

-- Verify the changes
SELECT column_name, data_type, numeric_precision, numeric_scale 
FROM information_schema.columns 
WHERE table_name = 'listPembelian' 
AND column_name IN ('harga', 'total_harga');