@echo off
echo Starting the CRM System...

REM Navigate to the backend directory
cd /d "c:\Users\micae\OneDrive\Documentos\Publiadhesivos\crm-system\backend"
if errorlevel 1 (
    echo Failed to navigate to backend directory
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "env\Scripts\activate.bat" (
    echo Virtual environment not found. Creating new environment...
    python -m venv env
    if errorlevel 1 (
        echo Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate the Python virtual environment
call env\Scripts\activate.bat
if errorlevel 1 (
    echo Failed to activate virtual environment
    pause
    exit /b 1
)

REM Install backend dependencies if needed
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

REM Check if frontend build exists
if not exist "..\frontend\dist" (
    echo Frontend build not found. Please run build.bat first
    pause
    exit /b 1
)

REM Start the backend server in a new window
echo Starting the server...
start "CRM System Server" cmd /c "uvicorn main:app --reload"

REM Wait a moment for the server to start
timeout /t 3

REM Open the default browser
echo Opening the application in your default browser...
start http://localhost:8000

echo The CRM System is now running.
echo Press any key to stop the server and exit...
pause

REM Kill the server process when exiting
taskkill /FI "WINDOWTITLE eq CRM System Server*" /T /F >nul 2>&1
exit /b 0