@echo off
echo ========================================
echo Starting Drawnix Frontend
echo ========================================
echo.
echo Frontend will run on: http://localhost:4200
echo.

cd /d "%~dp0"

:: Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo.
echo Starting development server...
echo Press Ctrl+C to stop
echo.

npm run start
