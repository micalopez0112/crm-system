@echo off
echo Building the CRM System...

REM Navigate to the frontend directory
cd /d "c:\Users\micae\OneDrive\Documentos\Publiadhesivos\crm-system\frontend"
if errorlevel 1 (
    echo Failed to navigate to frontend directory
    pause
    exit /b 1
)

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed or not in PATH. Please install Node.js first.
    pause
    exit /b 1
)

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Build the frontend
echo Building frontend...
call npm run build
if errorlevel 1 (
    echo Failed to build frontend
    pause
    exit /b 1
)

echo Frontend build completed successfully!
pause