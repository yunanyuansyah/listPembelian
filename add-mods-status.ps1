# PowerShell script untuk menambahkan nilai 'mods' ke constraint status
# Pastikan PostgreSQL sudah terinstall dan database sudah dibuat

param(
    [string]$DatabaseName = "listbarang_db",
    [string]$Host = "localhost",
    [string]$Port = "5432",
    [string]$Username = "postgres"
)

Write-Host "Menambahkan nilai 'mods' ke constraint status..." -ForegroundColor Green

# Baca password dari user
$Password = Read-Host "Masukkan password PostgreSQL" -AsSecureString
$PlainPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password))

# Set environment variable untuk password
$env:PGPASSWORD = $PlainPassword

try {
    # Jalankan script SQL
    Write-Host "Menjalankan script SQL..." -ForegroundColor Yellow
    psql -h $Host -p $Port -U $Username -d $DatabaseName -f "add-mods-status.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Berhasil menambahkan nilai 'mods' ke constraint status!" -ForegroundColor Green
        Write-Host "Sekarang kolom status dapat menerima nilai: 'admin', 'user', 'mods'" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Gagal menjalankan script SQL" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Clear password dari environment variable
    Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host "`nTekan Enter untuk keluar..."
Read-Host
