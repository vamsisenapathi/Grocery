Write-Host "Inserting 800 Products into Database" -ForegroundColor Green
Write-Host ""

$containerName = "grocery-postgres"
$running = docker ps --format "{{.Names}}" | Select-String -Pattern $containerName

if (-not $running) {
    Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
    docker-compose up -d postgres
    Start-Sleep -Seconds 8
}

Write-Host "PostgreSQL container is running" -ForegroundColor Green

Write-Host "Copying SQL file..." -ForegroundColor Cyan
docker cp "QUICK_INSERT_PRODUCTS.sql" "${containerName}:/tmp/products.sql"

Write-Host "Executing SQL script..." -ForegroundColor Cyan
docker exec -i $containerName psql -U admin -d grocerydb -f /tmp/products.sql

Write-Host ""
Write-Host "SQL execution complete!" -ForegroundColor Green

Write-Host ""
Write-Host "Verifying product count..." -ForegroundColor Cyan
$count = docker exec $containerName psql -U admin -d grocerydb -t -c "SELECT COUNT(*) FROM products;"
Write-Host "Total products: $($count.Trim())" -ForegroundColor Yellow

Write-Host ""
Write-Host "DONE!" -ForegroundColor Green
