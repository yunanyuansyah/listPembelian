# Troubleshooting Moderator Status Error

## Error 500 pada API `/api/users/[id]/status`

### Gejala

- Error 500 Internal Server Error ketika mencoba mengubah status user menjadi "Moderator"
- Request PUT ke `/api/users/5/status` gagal
- Console menampilkan error dari `UserManagement.tsx:122`

### Penyebab Kemungkinan

#### 1. Database Constraint Issue

Database mungkin memiliki constraint yang membatasi nilai status hanya untuk 'admin' dan 'user', tidak termasuk 'mods'.

#### 2. Database Schema Tidak Update

Tabel users mungkin belum mendukung nilai 'mods' di kolom status.

### Solusi

#### Solusi 1: Fix Database Constraint (Recommended)

1. **Jalankan SQL Script**:

   ```bash
   # Gunakan script PowerShell
   .\fix-database-constraint.ps1

   # Atau jalankan SQL manual
   psql $env:POSTGRES_URL -f fix-user-status-constraint.sql
   ```

2. **Manual SQL Execution**:

   ```sql
   -- Drop existing constraint
   ALTER TABLE users DROP CONSTRAINT IF EXISTS users_status_check;

   -- Add new constraint
   ALTER TABLE users ADD CONSTRAINT users_status_check
   CHECK (status IN ('admin', 'mods', 'user'));
   ```

#### Solusi 2: Check Database Connection

1. **Verifikasi Environment Variable**:

   ```bash
   echo $env:POSTGRES_URL
   ```

2. **Test Database Connection**:
   ```bash
   psql $env:POSTGRES_URL -c "SELECT version();"
   ```

#### Solusi 3: Check Database Schema

1. **Lihat Struktur Tabel**:

   ```sql
   \d users
   ```

2. **Check Constraint**:
   ```sql
   SELECT conname, consrc
   FROM pg_constraint
   WHERE conrelid = 'users'::regclass;
   ```

### Debugging Steps

#### 1. Check Server Logs

Lihat console server untuk error detail:

```bash
npm run dev
# Lihat output di terminal
```

#### 2. Check Browser Network Tab

1. Buka Developer Tools (F12)
2. Go to Network tab
3. Coba ubah status user
4. Lihat response error di request PUT

#### 3. Check Database Logs

```sql
-- Enable query logging
SET log_statement = 'all';
SET log_min_duration_statement = 0;
```

### Testing

#### 1. Test Database Constraint

```sql
-- Test insert with 'mods' status
INSERT INTO users (nama, email, password, nomor, status)
VALUES ('Test Mod', 'mod@test.com', 'password', '123456', 'mods');

-- Test update
UPDATE users SET status = 'mods' WHERE email = 'mod@test.com';
```

#### 2. Test API Endpoint

```bash
# Test dengan curl
curl -X PUT http://localhost:3000/api/users/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "mods"}'
```

### Prevention

1. **Database Migration**: Selalu update constraint saat menambah status baru
2. **Error Handling**: Implement proper error handling di API endpoints
3. **Testing**: Test semua status values sebelum deploy

### Files Modified

- `src/app/api/users/[id]/status/route.ts` - Enhanced error handling
- `src/lib/db.ts` - Enhanced logging in updateUserStatus
- `fix-user-status-constraint.sql` - Database fix script
- `fix-database-constraint.ps1` - PowerShell automation script

### Next Steps

1. Run database fix script
2. Restart development server
3. Test moderator status change
4. Verify all functionality works
