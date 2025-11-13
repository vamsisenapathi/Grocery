# Backend Health Check Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Backend Health Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if backend is running
Write-Host "[Test 1] Checking if backend is running on port 8081..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ Backend is UP and running!" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Backend is NOT running!" -ForegroundColor Red
    Write-Host "  Please start the backend server first:" -ForegroundColor Yellow
    Write-Host "    cd 'c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot'" -ForegroundColor Gray
    Write-Host "    mvn spring-boot:run" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""

# Test 2: Check geolocation endpoint
Write-Host "[Test 2] Testing geolocation endpoint..." -ForegroundColor Yellow
try {
    $url = "http://localhost:8081/api/v1/geolocation/reverse-geocode?latitude=12.9716&longitude=77.5946"
    $geoResponse = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 10 -ErrorAction Stop
    
    if ($geoResponse.StatusCode -eq 200) {
        Write-Host "  ✓ Geolocation endpoint returns HTTP 200!" -ForegroundColor Green
        
        # Parse JSON response
        $jsonContent = $geoResponse.Content | ConvertFrom-Json
        
        Write-Host ""
        Write-Host "  Response Data:" -ForegroundColor Cyan
        Write-Host "    Latitude: $($jsonContent.latitude)" -ForegroundColor Gray
        Write-Host "    Longitude: $($jsonContent.longitude)" -ForegroundColor Gray
        Write-Host "    City: $($jsonContent.city)" -ForegroundColor Gray
        Write-Host "    State: $($jsonContent.state)" -ForegroundColor Gray
        Write-Host "    Address Line 1: $($jsonContent.addressLine1)" -ForegroundColor Gray
        Write-Host "    Address Line 2: $($jsonContent.addressLine2)" -ForegroundColor Gray
        Write-Host "    Pincode: $($jsonContent.pincode)" -ForegroundColor Gray
        
        Write-Host ""
        if ($jsonContent.city -and $jsonContent.city -ne "") {
            Write-Host "  ✓ Geocoding is working! Full address returned." -ForegroundColor Green
        } else {
            Write-Host "  ⚠ Geocoding returned empty address (Nominatim may be rate-limited)" -ForegroundColor Yellow
            Write-Host "    This is OK - coordinates are still saved." -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✗ Unexpected status code: $($geoResponse.StatusCode)" -ForegroundColor Red
    }
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 500) {
        Write-Host "  ✗ ERROR: Backend returned 500 Internal Server Error!" -ForegroundColor Red
        Write-Host ""
        Write-Host "  This means the backend needs to be restarted with the new code:" -ForegroundColor Yellow
        Write-Host "    1. Stop backend (Ctrl+C in backend terminal)" -ForegroundColor Gray
        Write-Host "    2. Run: mvn clean package -DskipTests" -ForegroundColor Gray
        Write-Host "    3. Run: mvn spring-boot:run" -ForegroundColor Gray
        Write-Host ""
        exit 1
    } else {
        Write-Host "  ✗ Request failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""

# Test 3: Check for updated code
Write-Host "[Test 3] Verifying updated JAR exists..." -ForegroundColor Yellow
$jarPath = "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot\target\grocery-backend.jar"
if (Test-Path $jarPath) {
    $jarInfo = Get-Item $jarPath
    Write-Host "  ✓ JAR file exists" -ForegroundColor Green
    Write-Host "    Path: $jarPath" -ForegroundColor Gray
    Write-Host "    Last Modified: $($jarInfo.LastWriteTime)" -ForegroundColor Gray
    Write-Host "    Size: $([math]::Round($jarInfo.Length / 1MB, 2)) MB" -ForegroundColor Gray
    
    # Check if JAR is recent (within last hour)
    $hourAgo = (Get-Date).AddHours(-1)
    if ($jarInfo.LastWriteTime -gt $hourAgo) {
        Write-Host "  ✓ JAR was rebuilt recently - using latest code!" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ JAR is older than 1 hour - may need rebuild" -ForegroundColor Yellow
        Write-Host "    Run: mvn clean package -DskipTests" -ForegroundColor Gray
    }
} else {
    Write-Host "  ✗ JAR file not found!" -ForegroundColor Red
    Write-Host "    Run: mvn clean package -DskipTests" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Health Check Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
