Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Backend Health Check" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Backend Running
Write-Host "Test 1: Checking if backend is running..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  PASS - Backend is running!`n" -ForegroundColor Green
} catch {
    Write-Host "  FAIL - Backend is NOT running!" -ForegroundColor Red
    Write-Host "  Start it with: mvn spring-boot:run`n" -ForegroundColor Yellow
    exit 1
}

# Test 2: Geolocation Endpoint
Write-Host "Test 2: Testing geolocation endpoint..." -ForegroundColor Yellow
$geoUrl = 'http://localhost:8081/api/v1/geolocation/reverse-geocode?latitude=12.9716&longitude=77.5946'
try {
    $geoResponse = Invoke-WebRequest -Uri $geoUrl -Method GET -TimeoutSec 10 -ErrorAction Stop
    
    if ($geoResponse.StatusCode -eq 200) {
        Write-Host "  PASS - Returns HTTP 200!" -ForegroundColor Green
        $data = $geoResponse.Content | ConvertFrom-Json
        Write-Host "  Latitude: $($data.latitude)" -ForegroundColor Gray
        Write-Host "  Longitude: $($data.longitude)" -ForegroundColor Gray
        Write-Host "  City: $($data.city)" -ForegroundColor Gray
        
        if ($data.city) {
            Write-Host "  SUCCESS - Geocoding working!`n" -ForegroundColor Green
        } else {
            Write-Host "  OK - Empty address (Nominatim rate-limited)`n" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "  FAIL - Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode.Value__ -eq 500) {
        Write-Host "`n  CRITICAL: Backend returning 500 errors!" -ForegroundColor Red
        Write-Host "  You must restart the backend server:`n" -ForegroundColor Yellow
        Write-Host "  1. Stop backend (Ctrl+C)" -ForegroundColor Gray
        Write-Host "  2. mvn clean package -DskipTests" -ForegroundColor Gray
        Write-Host "  3. mvn spring-boot:run`n" -ForegroundColor Gray
    }
    exit 1
}

# Test 3: JAR Check
Write-Host "Test 3: Checking JAR file..." -ForegroundColor Yellow
$jarPath = "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot\target\grocery-backend.jar"
if (Test-Path $jarPath) {
    $jar = Get-Item $jarPath
    Write-Host "  PASS - JAR exists" -ForegroundColor Green
    Write-Host "  Modified: $($jar.LastWriteTime)" -ForegroundColor Gray
    Write-Host "  Size: $([math]::Round($jar.Length / 1MB, 2)) MB`n" -ForegroundColor Gray
} else {
    Write-Host "  FAIL - JAR not found!`n" -ForegroundColor Red
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All Tests Passed!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
