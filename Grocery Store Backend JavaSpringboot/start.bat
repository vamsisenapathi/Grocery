@echo off
title Grocery Store Backend - Quick Start

echo ==========================================
echo 🚀 Grocery Store Backend - Quick Start
echo ==========================================
echo.

REM Check if Docker is available
docker --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Docker found! Starting with Docker Compose...
    echo.
    echo This will:
    echo - Start PostgreSQL database
    echo - Build and start the backend application
    echo - Load sample data automatically
    echo.
    echo Your API will be available at: http://localhost:8080/api/v1
    echo.
    pause
    docker-compose up --build
) else (
    echo ⚠️  Docker not found. Checking for Java and Maven...
    echo.
    
    REM Check Java
    java -version >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ Java found!
    ) else (
        echo ❌ Java not found!
        echo Please install Java 21 from: https://adoptium.net/
        pause
        exit /b 1
    )
    
    REM Check Maven
    mvn -version >nul 2>&1
    if %errorlevel% == 0 (
        echo ✅ Maven found!
        echo.
        echo Building application...
        mvn clean package -DskipTests
        
        if %errorlevel% == 0 (
            echo ✅ Build successful!
            echo.
            echo Starting application...
            echo Application will be available at: http://localhost:8080/api/v1
            echo.
            echo Press Ctrl+C to stop the application
            java -jar target/grocery-backend.jar
        ) else (
            echo ❌ Build failed!
            echo Please check the error messages above.
            pause
            exit /b 1
        )
    ) else (
        echo ❌ Maven not found!
        echo.
        echo Options:
        echo 1. Install Docker and run this script again
        echo 2. Install Maven from: https://maven.apache.org/download.cgi
        echo 3. Use an IDE like IntelliJ IDEA or Eclipse
        pause
        exit /b 1
    )
)

echo.
echo 🎉 Setup complete! Your API endpoints:
echo Products: http://localhost:8080/api/v1/products
echo Cart: http://localhost:8080/api/v1/cart/{userId}
echo Health: http://localhost:8080/api/v1/actuator/health
pause