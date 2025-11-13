@echo off
cls
echo.
echo ========================================
echo   GROCERY APP BACKEND SERVER
echo ========================================
echo.
echo Starting backend on http://localhost:8081
echo.
echo DO NOT CLOSE THIS WINDOW!
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

cd /d "%~dp0"
java -jar target\grocery-backend.jar

pause
