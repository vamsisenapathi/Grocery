# PowerShell script to fix the addresses table
Write-Host "Fixing addresses table schema..." -ForegroundColor Cyan

# PostgreSQL connection details (update if different)
$env:PGPASSWORD = "admin"
$dbHost = "localhost"
$dbPort = "5432"
$dbName = "grocerydb"
$dbUser = "admin"

# Find PostgreSQL bin directory
$pgBinPaths = @(
    "C:\Program Files\PostgreSQL\16\bin",
    "C:\Program Files\PostgreSQL\15\bin",
    "C:\Program Files\PostgreSQL\14\bin",
    "C:\Program Files\PostgreSQL\13\bin",
    "C:\PostgreSQL\bin"
)

$psqlPath = $null
foreach ($path in $pgBinPaths) {
    if (Test-Path "$path\psql.exe") {
        $psqlPath = "$path\psql.exe"
        break
    }
}

if (-not $psqlPath) {
    Write-Host "ERROR: PostgreSQL psql.exe not found!" -ForegroundColor Red
    Write-Host "Please run this SQL manually in pgAdmin or your database tool:" -ForegroundColor Yellow
    Write-Host ""
    Get-Content "FIX_ADDRESSES_TABLE.sql"
    exit 1
}

Write-Host "Found PostgreSQL at: $psqlPath" -ForegroundColor Green

# Run the SQL script
Write-Host "Executing SQL script..." -ForegroundColor Yellow
& $psqlPath -h $dbHost -p $dbPort -U $dbUser -d $dbName -f "FIX_ADDRESSES_TABLE.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nAddresses table fixed successfully!" -ForegroundColor Green
    Write-Host "You can now test the address functionality." -ForegroundColor Cyan
} else {
    Write-Host "`nFailed to execute SQL script." -ForegroundColor Red
    Write-Host "Please run the SQL manually using pgAdmin or another database tool." -ForegroundColor Yellow
}
