@echo off
echo ==========================================
echo Team Portal - Quick Start
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from:
    echo   https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo npm found: 
npm --version
echo.

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully
) else (
    echo Dependencies already installed
)

echo.
echo ==========================================
echo Starting Team Portal...
echo ==========================================
echo.
echo Portal will be available at:
echo   http://localhost:3000
echo.
echo Default password: TeamPortal2024
echo.
echo Press Ctrl+C to stop the server
echo.
echo ==========================================
echo.

REM Start the server
npm start
