#!/usr/bin/env pwsh

# ==============================================
# COMPLETE PRODUCT INSERTION SCRIPT
# Inserts 800 products into PostgreSQL database
# ==============================================

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host " 🛒 Grocery Store - Insert 800 Products" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if SQL file exists
$sqlFile = "QUICK_INSERT_PRODUCTS.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found SQL file: $sqlFile" -ForegroundColor Green

# Step 2: Try Docker exec first
Write-Host ""
Write-Host "📡 Checking Docker containers..." -ForegroundColor Cyan

try {
    $containers = docker ps --format "{{.Names}}" 2>$null | Out-String
    
    if ($containers -match "grocery-postgres") {
        Write-Host "✅ Found grocery-postgres container running" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "🔄 Inserting products into database..." -ForegroundColor Cyan
        
        # Copy SQL file into container
        docker cp $sqlFile grocery-postgres:/tmp/products.sql
        
        # Execute SQL
        docker exec -i grocery-postgres psql -U admin -d grocerydb -f /tmp/products.sql
        
        Write-Host ""
        Write-Host "✅ Products inserted successfully!" -ForegroundColor Green
        
        # Verify count
        Write-Host ""
        Write-Host "📊 Verifying product count..." -ForegroundColor Cyan
        $count = docker exec -i grocery-postgres psql -U admin -d grocerydb -t -c "SELECT COUNT(*) FROM products;"
        Write-Host "   Total products in database: $($count.Trim())" -ForegroundColor Yellow
        
        exit 0
    }
    else {
        Write-Host "⚠️  Docker container 'grocery-postgres' not running" -ForegroundColor Yellow
        Write-Host "   Starting Docker Compose..." -ForegroundColor Cyan
        
        docker-compose up -d postgres
        
        Write-Host "   Waiting for database to be ready..." -ForegroundColor Cyan
        Start-Sleep -Seconds 10
        
        # Retry insertion
        docker cp $sqlFile grocery-postgres:/tmp/products.sql
        docker exec -i grocery-postgres psql -U admin -d grocerydb -f /tmp/products.sql
        
        Write-Host ""
        Write-Host "✅ Products inserted successfully!" -ForegroundColor Green
        
        exit 0
    }
}
catch {
    Write-Host "❌ Docker method failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Trying alternative method via backend API..." -ForegroundColor Yellow
}

# Step 3: Alternative - Use backend API if running
Write-Host ""
Write-Host "📡 Checking if backend is running on http://localhost:8080..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/categories" -Method Get -TimeoutSec 5 -UseBasicParsing
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running!" -ForegroundColor Green
        Write-Host "⚠️  Manual SQL execution required" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please execute this command manually:" -ForegroundColor Cyan
        Write-Host "   docker exec -i grocery-postgres psql -U admin -d grocerydb -f /tmp/$sqlFile" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Backend not responding" -ForegroundColor Red
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " MANUAL SETUP REQUIRED" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Start Docker containers:" -ForegroundColor White
    Write-Host "   docker-compose up -d" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Insert products:" -ForegroundColor White
    Write-Host "   docker exec -i grocery-postgres psql -U admin -d grocerydb -f /tmp/products.sql" -ForegroundColor Gray
    Write-Host ""
}
