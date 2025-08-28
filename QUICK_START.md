# 🚀 Quick Start - Development Lokal

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v12+)

## 1. Install Dependencies

```bash
npm install
```

## 2. Setup Environment Variables

```bash
npm run setup
```

_Script ini akan memandu Anda membuat file `.env.local`_

## 3. Setup PostgreSQL

### Option A: Docker (Recommended)

```bash
# Run PostgreSQL container
docker run --name listbarang-postgres \
  -e POSTGRES_DB=listbarang_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### Option B: Local Installation

- Install PostgreSQL dari [postgresql.org](https://www.postgresql.org/download/)
- Start service PostgreSQL

## 4. Setup Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE listbarang_db;"

# Run setup script
psql -U postgres -d listbarang_db -f database-setup.sql
```

## 5. Start Development Server

```bash
npm run dev
```

## 6. Test Application

- Homepage: http://localhost:3000
- Products: http://localhost:3000/products
- Login/Register: Klik tombol di homepage

## Sample Login Credentials

- **Admin**: admin@listbarang.com / admin123
- **User**: john@example.com / user123

## Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
# Windows: net start postgresql-x64-15
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000
```

### Reset Database

```bash
npm run db:reset
```

## Useful Commands

- `npm run setup` - Setup environment variables
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Next Steps

1. ✅ Setup selesai
2. 🎯 Mulai development
3. 🚀 Deploy ke Vercel saat siap
