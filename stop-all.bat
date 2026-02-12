@echo off
echo Stopping all Node.js processes...

:: Kill all node.exe processes
taskkill //F //IM node.exe 2>nul

:: Kill processes on common ports
for %%p in (3001 4200 7201) do (
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do (
        echo Killing process on port %%p with PID %%a
        taskkill //F //PID %%a 2>nul
    )
)

echo.
echo All services stopped!
echo.
pause
