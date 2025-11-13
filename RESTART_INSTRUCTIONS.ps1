Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "   CRITICAL: BACKEND SERVER RESTART REQUIRED" -ForegroundColor Red
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "The backend code has been updated and rebuilt." -ForegroundColor Yellow
Write-Host "You MUST stop and restart the backend server now!`n" -ForegroundColor Yellow

Write-Host "STEP 1: Stop the Backend Server" -ForegroundColor Green
Write-Host "---------------------------------------" -ForegroundColor Gray
Write-Host "  Option A: If running in a terminal, press Ctrl+C" -ForegroundColor White
Write-Host "  Option B: Run this PowerShell command:`n" -ForegroundColor White
Write-Host "    Get-Process -Name 'java' | Where-Object {`$_.Path -like '*jdk*'} | Stop-Process -Force`n" -ForegroundColor Cyan

Write-Host "STEP 2: Wait 3 seconds for port to be released`n" -ForegroundColor Green

Write-Host "STEP 3: Start the Backend Server" -ForegroundColor Green
Write-Host "---------------------------------------" -ForegroundColor Gray
Write-Host "  Navigate to backend directory and run:`n" -ForegroundColor White
Write-Host "    cd 'c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot'" -ForegroundColor Cyan
Write-Host "    mvn spring-boot:run`n" -ForegroundColor Cyan

Write-Host "STEP 4: Wait for Confirmation" -ForegroundColor Green
Write-Host "---------------------------------------" -ForegroundColor Gray
Write-Host "  Wait until you see this message:`n" -ForegroundColor White
Write-Host "    'Tomcat started on port(s): 8081 (http)'" -ForegroundColor Green
Write-Host "    'Started GroceryAppBackendApplication'`n" -ForegroundColor Green

Write-Host "STEP 5: Test the Fix" -ForegroundColor Green
Write-Host "---------------------------------------" -ForegroundColor Gray
Write-Host "  1. Open your browser to http://localhost:3000" -ForegroundColor White
Write-Host "  2. Go to 'Add Address' page" -ForegroundColor White  
Write-Host "  3. Click 'Detect My Current Location'" -ForegroundColor White
Write-Host "  4. You should see:`n" -ForegroundColor White
Write-Host "     - Blue notification (not red error)" -ForegroundColor Cyan
Write-Host "     - Coordinates saved" -ForegroundColor Cyan
Write-Host "     - No 500 errors in Network tab`n" -ForegroundColor Cyan

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   JAR Status" -ForegroundColor Yellow
Write-Host "============================================`n" -ForegroundColor Cyan

$jarPath = "c:\Vamsi\React js\App\Grocery Store\Grocery Store Backend JavaSpringboot\target\grocery-backend.jar"
if (Test-Path $jarPath) {
    $jar = Get-Item $jarPath
    Write-Host "  File: grocery-backend.jar" -ForegroundColor Green
    Write-Host "  Last Built: $($jar.LastWriteTime)" -ForegroundColor White
    Write-Host "  Size: $([math]::Round($jar.Length / 1MB, 2)) MB" -ForegroundColor White
    
    $minutesAgo = ((Get-Date) - $jar.LastWriteTime).TotalMinutes
    if ($minutesAgo -lt 5) {
        Write-Host "  Status: FRESHLY BUILT ($([math]::Round($minutesAgo, 1)) minutes ago)`n" -ForegroundColor Green
    } else {
        Write-Host "  Status: Built $([math]::Round($minutesAgo, 0)) minutes ago`n" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ERROR: JAR file not found!`n" -ForegroundColor Red
}

Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "REMEMBER: The server MUST be restarted for changes to take effect!" -ForegroundColor Red -BackgroundColor Yellow
Write-Host ""
