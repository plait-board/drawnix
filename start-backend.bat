@echo off
echo ========================================
echo Starting Drawnix Backend Server
echo ========================================
echo.

:: Get the directory where this script is located
set "SCRIPT_DIR=%~dp0"
echo Script location: %SCRIPT_DIR%

:: Change to api directory
cd /d "%SCRIPT_DIR%apps\api"

if errorlevel 1 (
    echo ERROR: Cannot find apps\api directory!
    echo Current directory: %CD%
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed!
        pause
        exit /b 1
    )
)

:: Build if dist doesn't exist
if not exist "dist" (
    echo Building TypeScript...
    call npm run build
    if errorlevel 1 (
        echo ERROR: Build failed!
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Starting server...
echo API URL: http://localhost:3001/api
echo Health Check: http://localhost:3001/health
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

:: Create data directory if not exists
if not exist "data" mkdir data
if not exist "uploads\boards" mkdir uploads\boards
if not exist "uploads\avatars" mkdir uploads\avatars

:: Start the server
node dist/index.js

:: If server crashes, keep window open
echo.
echo Server stopped or crashed!
echo.
pause
