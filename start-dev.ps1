# GeoWatershed Development Server Startup Script
# Starts both the Express Backend (port 5000) and Next.js Frontend (port 3000)

Write-Host "==========================================" -ForegroundColor Green
Write-Host " GeoWatershed Spatial Intelligence Platform" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Backend in new process
Write-Host "`n[1/2] Starting Express API Server on http://localhost:5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; Write-Host '--- GeoWatershed API Server (Port 5000) ---' -ForegroundColor Cyan; npm run dev"

Start-Sleep -Seconds 2

# 2. Start Frontend in current console
Write-Host "[2/2] Starting Next.js Web Application on http://localhost:3000..." -ForegroundColor Cyan
cd "$rootDir\frontend"
npm run dev
