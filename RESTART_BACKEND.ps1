# Restart Backend Server Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Restarting Grocery Store Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill existing Java processes running the backend
Write-Host "[Step 1] Stopping existing backend server..." -ForegroundColor Yellow
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*\jdk*" -or $_.Path -like "*\java*"
}

if ($javaProcesses) {
    $javaProcesses | ForEach-Object {
        Write-Host "  Stopping process ID: $($_.Id)" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 3
    Write-Host "  ✓ Stopped existing server" -ForegroundColor Green
} else {
    Write-Host "  No running backend server found" -ForegroundColor Gray
}

Write-Host ""

# Step 2: Navigate to backend directory
Write-Host "[Step 2] Navigating to backend directory..." -ForegroundColor Yellow
Set-Location "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot"
Write-Host "  ✓ Current directory: $(Get-Location)" -ForegroundColor Green

Write-Host ""

# Step 3: Start the backend server
Write-Host "[Step 3] Starting backend server..." -ForegroundColor Yellow
Write-Host "  Using: mvn spring-boot:run" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Server will start on: http://localhost:8081" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Run the server
mvn spring-boot:run
