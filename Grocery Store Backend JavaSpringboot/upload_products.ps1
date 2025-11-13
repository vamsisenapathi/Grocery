# Upload 800 Products via Backend API
# Reads the generated SQL and converts to API calls

Write-Host "🚀 Starting product upload via API..." -ForegroundColor Green

# Backend URL
$baseUrl = "http://localhost:8081/api/products"

# Read SQL file and parse products
$sqlContent = Get-Content "insert_800_products.sql" -Raw

# Extract INSERT statements
$insertPattern = "INSERT INTO products \(name, description, price, mrp, category_id, stock, weight, unit, image_url, discount, brand\) VALUES \('([^']+)', '([^']+)', ([\d.]+), ([\d.]+), '([^']+)', (\d+), '([^']+)', '([^']+)', '([^']+)', ([\d.]+), '([^']+)'\);"

$matches = [regex]::Matches($sqlContent, $insertPattern)

Write-Host "📦 Found $($matches.Count) products to upload" -ForegroundColor Cyan

$successCount = 0
$errorCount = 0

foreach ($match in $matches) {
    $productData = @{
        name = $match.Groups[1].Value
        description = $match.Groups[2].Value
        price = [decimal]$match.Groups[3].Value
        mrp = [decimal]$match.Groups[4].Value
        categoryId = $match.Groups[5].Value
        stock = [int]$match.Groups[6].Value
        weight = $match.Groups[7].Value
        unit = $match.Groups[8].Value
        imageUrl = $match.Groups[9].Value
        discount = [decimal]$match.Groups[10].Value
        brand = $match.Groups[11].Value
    }
    
    try {
        $json = $productData | ConvertTo-Json
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Body $json -ContentType "application/json"
        $successCount++
        
        if ($successCount % 50 -eq 0) {
            Write-Host "✅ Uploaded $successCount products..." -ForegroundColor Green
        }
    }
    catch {
        $errorCount++
        if ($errorCount -le 5) {
            Write-Host "❌ Error uploading: $($productData.name)" -ForegroundColor Red
            Write-Host "   $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Upload Complete!" -ForegroundColor Green
Write-Host "   Successful: $successCount" -ForegroundColor Green
Write-Host "   Failed: $errorCount" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan
