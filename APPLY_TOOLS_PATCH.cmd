@echo off
setlocal
cd /d "%~dp0"
echo.
echo Applying My Jersey Studio tools patch...
echo.
cd /d "D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio"
pnpm run build:cloudflare
if errorlevel 1 (
  echo.
  echo BUILD FAILED. Please check the error output.
  pause
  exit /b 1
)
echo.
echo BUILD PASSED.
echo Next:
echo   git add .
echo   git commit -m "Add OneClick Creation and File Converter tools"
echo   git push origin main
pause
