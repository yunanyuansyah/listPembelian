# PowerShell script to fix database constraint for user status
# This script will update the database to support 'mods' status

Write-Host "Fixing database constraint for user status..." -ForegroundColor Yellow

# Check if psql is available
try {
    $psqlVersion = psql --version
    Write-Host "PostgreSQL client found: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "PostgreSQL client (psql) not found. Please install PostgreSQL client tools." -ForegroundColor Red
    Write-Host "You can download it from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

# Check if environment variable is set
if (-not $env:POSTGRES_URL) {
    Write-Host "POSTGRES_URL environment variable not set." -ForegroundColor Red
    Write-Host "Please set it to your PostgreSQL connection string." -ForegroundColor Yellow
    Write-Host "Example: `$env:POSTGRES_URL = 'postgresql://username:password@localhost:5432/database_name'" -ForegroundColor Cyan
    exit 1
}

Write-Host "Using database: $env:POSTGRES_URL" -ForegroundColor Cyan

# Execute the SQL script
try {
    Write-Host "Executing SQL script to fix user status constraint..." -ForegroundColor Yellow
    
    # Read and execute the SQL file
    $sqlContent = Get-Content -Path "fix-user-status-constraint.sql" -Raw
    
    # Execute the SQL
    $result = $sqlContent | psql $env:POSTGRES_URL
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database constraint fixed successfully!" -ForegroundColor Green
        Write-Host "User status now supports: admin, mods, user" -ForegroundColor Green
    } else {
        Write-Host "Error executing SQL script. Exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Output: $result" -ForegroundColor Red
    }
} catch {
    Write-Host "Error executing SQL script: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Script completed." -ForegroundColor Yellow
