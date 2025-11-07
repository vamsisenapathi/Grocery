#!/usr/bin/env pwsh

# Grocery Store Backend - Quick Start Script
Write-Host "🚀 Grocery Store Backend - Quick Start" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Docker is available
if (Get-Command "docker" -ErrorAction SilentlyContinue) {
    Write-Host "✅ Docker found! Starting with Docker Compose..." -ForegroundColor Green
    Write-Host ""
    
    try {
        # Start with Docker Compose
        docker-compose up --build
    }
    catch {
        Write-Host "❌ Docker Compose failed. Error: $_" -ForegroundColor Red
        Write-Host "Please check Docker installation and try again." -ForegroundColor Yellow
    }
}
else {
    Write-Host "⚠️  Docker not found. Checking for Java and Maven..." -ForegroundColor Yellow
    
    # Check Java
    if (Get-Command "java" -ErrorAction SilentlyContinue) {
        $javaVersion = java -version 2>&1 | Select-Object -First 1
        Write-Host "✅ Java found: $javaVersion" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Java not found!" -ForegroundColor Red
        Write-Host "Please install Java 21 from: https://adoptium.net/" -ForegroundColor Yellow
        exit 1
    }
    
    # Check Maven
    if (Get-Command "mvn" -ErrorAction SilentlyContinue) {
        Write-Host "✅ Maven found!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Building application..." -ForegroundColor Cyan
        
        try {
            # Build the application
            mvn clean package -DskipTests
            
            Write-Host "✅ Build successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Starting application..." -ForegroundColor Cyan
            Write-Host "Application will be available at: http://localhost:8080/api/v1" -ForegroundColor Yellow
            Write-Host ""
            
            # Run the application
            java -jar target/grocery-backend.jar
        }
        catch {
            Write-Host "❌ Build failed. Error: $_" -ForegroundColor Red
            Write-Host "Please check the error messages above." -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "❌ Maven not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Options:" -ForegroundColor Yellow
        Write-Host "1. Install Docker and run: docker-compose up --build" -ForegroundColor Cyan
        Write-Host "2. Install Maven from: https://maven.apache.org/download.cgi" -ForegroundColor Cyan
        Write-Host "3. Install Java IDE like IntelliJ IDEA or Eclipse" -ForegroundColor Cyan
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Setup complete! Your API endpoints:" -ForegroundColor Green
Write-Host "Products: http://localhost:8080/api/v1/products" -ForegroundColor Cyan
Write-Host "Cart: http://localhost:8080/api/v1/cart/{userId}" -ForegroundColor Cyan
Write-Host "Health: http://localhost:8080/api/v1/actuator/health" -ForegroundColor Cyan