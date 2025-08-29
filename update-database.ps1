# PowerShell script to update database schema
# This script will update the database to support larger numbers

Write-Host "Updating database schema to support larger numbers..." -ForegroundColor Green

# Read the SQL script
$sqlScript = Get-Content "update-schema.sql" -Raw

# Execute the SQL script using psql
# Note: You may need to adjust the connection parameters based on your setup
try {
    # For Windows, you might need to use a different approach
    # This assumes you have psql in your PATH or can access it
    Write-Host "Please run the following SQL commands in your PostgreSQL client:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "ALTER TABLE listPembelian ALTER COLUMN harga TYPE DECIMAL(15,2);" -ForegroundColor Cyan
    Write-Host "ALTER TABLE listPembelian ALTER COLUMN total_harga TYPE DECIMAL(15,2);" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or copy the contents of update-schema.sql and run it in your database client." -ForegroundColor Yellow
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please run the SQL commands manually in your database client." -ForegroundColor Yellow
}

