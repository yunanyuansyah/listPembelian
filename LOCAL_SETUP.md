# Setup Development Lokal

## Prerequisites

1. **Node.js** (v18 atau lebih baru)
2. **PostgreSQL** (v12 atau lebih baru)
3. **npm** atau **yarn**

## 1. Install Dependencies

```bash
cd my-site
npm install
```

## 2. Setup PostgreSQL Lokal

### Option A: Install PostgreSQL Langsung

#### Windows:

```bash
# Download dari https://www.postgresql.org/download/windows/
# Atau gunakan Chocolatey
choco install postgresql
```

#### macOS:

```bash
# Menggunakan Homebrew
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Option B: Menggunakan Docker

```bash
# Pull PostgreSQL image
docker pull postgres:15

# Run PostgreSQL container
docker run --name listbarang-postgres \
  -e POSTGRES_DB=listbarang_db \
  -e POSTGRES_USER=username \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

## 3. Setup Database

### Buat Database dan User:

```sql
-- Connect ke PostgreSQL sebagai superuser
psql -U postgres

-- Buat database
CREATE DATABASE listbarang_db;

-- Buat user (optional)
CREATE USER listbarang_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE listbarang_db TO listbarang_user;

-- Connect ke database
\c listbarang_db;

-- Buat tabel listPembelian
CREATE TABLE listPembelian (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    deskripsi VARCHAR(500),
    harga DECIMAL(10,2),
    stok INTEGER DEFAULT 0,
    total_harga DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buat tabel users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nomor VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(10) CHECK (status IN ('admin', 'user')) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Buat indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_nomor ON users(nomor);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_listPembelian_nama ON listPembelian(nama);

-- Insert sample data (optional)
INSERT INTO listPembelian (nama, deskripsi, harga, stok, total_harga) VALUES
('Laptop ASUS', 'Laptop gaming dengan RTX 4060', 15000000, 5, 15000000),
('Mouse Logitech', 'Mouse wireless dengan sensor optik', 250000, 20, 250000),
('Keyboard Mechanical', 'Keyboard RGB dengan switch blue', 800000, 10, 800000);

-- Insert sample user (optional)
INSERT INTO users (nama, email, password, nomor, status) VALUES
('Admin User', 'admin@example.com', 'admin123', '+6281234567890', 'admin'),
('Regular User', 'user@example.com', 'user123', '+6281234567891', 'user');
```

## 4. Environment Variables

Buat file `.env.local` di root project:

```bash
# Database Configuration for Local Development
POSTGRES_URL="postgresql://username:password@localhost:5432/listbarang_db"

# Alternative: Individual connection parameters
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_DATABASE="listbarang_db"
POSTGRES_USERNAME="username"
POSTGRES_PASSWORD="password"

# For Vercel Postgres compatibility
POSTGRES_PRISMA_URL="postgresql://username:password@localhost:5432/listbarang_db?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://username:password@localhost:5432/listbarang_db"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Ganti nilai berikut:**

- `username`: Username PostgreSQL Anda
- `password`: Password PostgreSQL Anda
- `listbarang_db`: Nama database Anda

## 5. Update Database Configuration

Karena kita menggunakan PostgreSQL lokal, kita perlu sedikit modifikasi pada `src/lib/db.ts` untuk development lokal.

## 6. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 7. Test Database Connection

### Test API Endpoints:

```bash
# Test get all products
curl http://localhost:3000/api/products

# Test create product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test Product","deskripsi":"Test Description","harga":100000,"stok":5}'

# Test search products
curl http://localhost:3000/api/products/search?q=test
```

### Test UI:

1. Visit `http://localhost:3000` - Homepage
2. Visit `http://localhost:3000/products` - Product management
3. Visit `http://localhost:3000/migrate` - Data migration

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:

   ```
   Error: connect ECONNREFUSED 127.0.0.1:5432
   ```

   **Solution**: Pastikan PostgreSQL running dan port 5432 terbuka

2. **Authentication Failed**:

   ```
   Error: password authentication failed
   ```

   **Solution**: Check username/password di `.env.local`

3. **Database Does Not Exist**:

   ```
   Error: database "listbarang_db" does not exist
   ```

   **Solution**: Buat database terlebih dahulu

4. **Table Does Not Exist**:
   ```
   Error: relation "listPembelian" does not exist
   ```
   **Solution**: Run SQL script untuk membuat tabel

### Debug Steps:

1. **Check PostgreSQL Status**:

   ```bash
   # Windows
   net start postgresql-x64-15

   # macOS
   brew services list | grep postgresql

   # Linux
   sudo systemctl status postgresql
   ```

2. **Test Connection**:

   ```bash
   psql -h localhost -p 5432 -U username -d listbarang_db
   ```

3. **Check Environment Variables**:
   ```bash
   # Di terminal project
   echo $POSTGRES_URL
   ```

## Development Tips

1. **Use Database GUI Tools**:

   - pgAdmin (Web-based)
   - DBeaver (Desktop)
   - TablePlus (macOS/Windows)

2. **Database Seeding**:

   - Gunakan `/migrate` page untuk import data sample
   - Atau run SQL script manual

3. **Hot Reload**:
   - Database changes memerlukan restart server
   - Code changes akan auto-reload

## Next Steps

1. **Setup Environment**: Ikuti langkah 1-4
2. **Test Connection**: Pastikan database terhubung
3. **Run Application**: `npm run dev`
4. **Test Features**: Login, Register, CRUD products
5. **Development**: Mulai coding fitur baru

## Production Deployment

Setelah development selesai, deploy ke Vercel:

```bash
npx vercel
```

Vercel akan otomatis setup PostgreSQL database dan environment variables.
