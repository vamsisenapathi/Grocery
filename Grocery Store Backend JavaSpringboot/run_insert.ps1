#!/usr/bin/env pwsh

Write-Host "================================================" -ForegroundColor Cyan
Write-Host " 🛒 Inserting 800 Products into Database" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker command exists
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found!" -ForegroundColor Red
    Write-Host "Please install Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Check if container is running
$containerName = "grocery-postgres"
$running = docker ps --format "{{.Names}}" | Select-String -Pattern $containerName

if (-not $running) {
    Write-Host "⚠️  PostgreSQL container not running" -ForegroundColor Yellow
    Write-Host "Starting Docker Compose..." -ForegroundColor Cyan
    docker-compose up -d postgres
    Start-Sleep -Seconds 8
}

Write-Host "✅ PostgreSQL container is running" -ForegroundColor Green
Write-Host ""

# Copy SQL file to container
Write-Host "📂 Copying SQL file to container..." -ForegroundColor Cyan
docker cp "QUICK_INSERT_PRODUCTS.sql" "${containerName}:/tmp/products.sql"

# Execute SQL
Write-Host "🔄 Executing SQL script..." -ForegroundColor Cyan
docker exec -i $containerName psql -U admin -d grocerydb -f /tmp/products.sql

Write-Host ""
Write-Host "✅ SQL execution complete!" -ForegroundColor Green

# Verify
Write-Host ""
Write-Host "📊 Verifying product count..." -ForegroundColor Cyan
$count = docker exec $containerName psql -U admin -d grocerydb -t -c "SELECT COUNT(*) FROM products;"
Write-Host "   Total products: $($count.Trim())" -ForegroundColor Yellow

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host " ✅ DONE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
