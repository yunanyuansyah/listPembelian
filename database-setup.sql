-- Database Setup Script for Local Development
-- Run this script in your PostgreSQL database

-- Create database (run this as superuser)
-- CREATE DATABASE listbarang_db;

-- Connect to the database
-- \c listbarang_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nomor VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('admin', 'user')) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create listPembelian table
CREATE TABLE IF NOT EXISTS listPembelian (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    deskripsi VARCHAR(500),
    harga DECIMAL(10,2),
    stok INTEGER DEFAULT 0,
    total_harga DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_nomor ON users(nomor);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_listPembelian_nama ON listPembelian(nama);
CREATE INDEX IF NOT EXISTS idx_listPembelian_created_at ON listPembelian(created_at);

-- Insert sample data for testing
INSERT INTO listPembelian (nama, deskripsi, harga, stok, total_harga) VALUES
('Laptop ASUS ROG', 'Laptop gaming dengan RTX 4060, 16GB RAM, 512GB SSD', 15000000, 5, 15000000),
('Mouse Logitech G Pro', 'Mouse wireless gaming dengan sensor HERO 25K', 250000, 20, 250000),
('Keyboard Mechanical RGB', 'Keyboard mechanical dengan switch blue dan RGB lighting', 800000, 10, 800000),
('Monitor Samsung 24"', 'Monitor Full HD 144Hz untuk gaming', 2500000, 8, 2500000),
('Headset SteelSeries', 'Headset gaming dengan microphone dan surround sound', 1200000, 15, 1200000),
('Webcam Logitech C920', 'Webcam HD 1080p untuk streaming dan video call', 800000, 12, 800000),
('SSD Samsung 1TB', 'SSD NVMe M.2 dengan kecepatan read 7000MB/s', 1500000, 25, 1500000),
('RAM Corsair 16GB', 'RAM DDR4 3200MHz untuk gaming dan productivity', 800000, 30, 800000)
ON CONFLICT DO NOTHING;

-- Insert sample users for testing
INSERT INTO users (nama, email, password, nomor, status) VALUES
('Admin System', 'admin@listbarang.com', 'admin123', '+6281234567890', 'admin'),
('John Doe', 'john@example.com', 'user123', '+6281234567891', 'user'),
('Jane Smith', 'jane@example.com', 'user123', '+6281234567892', 'user'),
('Ahmad Wijaya', 'ahmad@example.com', 'user123', '+6281234567893', 'user')
ON CONFLICT (email) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify tables and data
SELECT 'Users table created successfully' as status;
SELECT COUNT(*) as user_count FROM users;

SELECT 'Products table created successfully' as status;
SELECT COUNT(*) as product_count FROM listPembelian;

-- Show sample data
SELECT 'Sample Users:' as info;
SELECT id, nama, email, status, created_at FROM users LIMIT 5;

SELECT 'Sample Products:' as info;
SELECT id, nama, harga, stok, created_at FROM listPembelian LIMIT 5;
