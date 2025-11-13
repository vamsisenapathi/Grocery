# API Testing Script
# Run this to verify all APIs are working properly

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Testing Grocery Store Backend APIs" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8081/api/v1"

# Test 1: Get all products
Write-Host "Test 1: GET /products (All Products)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products" -Method GET
    $products = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Found $($products.Count) products" -ForegroundColor Green
    if ($products.Count -gt 0) {
        Write-Host "   Sample: $($products[0].name) - ₹$($products[0].price)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get featured products
Write-Host "Test 2: GET /products/featured" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products/featured" -Method GET
    $products = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Found $($products.Count) featured products" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Search products
Write-Host "Test 3: GET /products/search?query=milk" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products/search?query=milk" -Method GET
    $products = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Found $($products.Count) products matching 'milk'" -ForegroundColor Green
    if ($products.Count -gt 0) {
        Write-Host "   Sample: $($products[0].name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get products by category (Dairy)
Write-Host "Test 4: GET /categories/dairy" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/categories/dairy" -Method GET
    $products = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Found $($products.Count) dairy products" -ForegroundColor Green
    if ($products.Count -gt 0) {
        Write-Host "   Sample: $($products[0].name)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Error Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get products by category (Fruits)
Write-Host "Test 5: GET /categories/fruits" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/categories/fruits" -Method GET
    $products = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Found $($products.Count) fruit products" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get banners
Write-Host "Test 6: GET /banners" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/banners" -Method GET
    $banners = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Found $($banners.Count) banners" -ForegroundColor Green
    if ($banners.Count -gt 0) {
        Write-Host "   Sample: $($banners[0].title)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7: Get category banners
Write-Host "Test 7: GET /banners/categories" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/banners/categories" -Method GET
    $banners = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS: Found $($banners.Count) category banners" -ForegroundColor Green
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: Get cart (this might fail if no cart exists, but should return valid response)
Write-Host "Test 8: GET /cart/00000000-0000-0000-0000-000000000001" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/cart/00000000-0000-0000-0000-000000000001" -Method GET
    Write-Host "✅ SUCCESS: Cart endpoint responding" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ OK: Cart not found (expected for new user)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
