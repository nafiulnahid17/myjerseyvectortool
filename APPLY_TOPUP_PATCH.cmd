@echo off
setlocal
cd /d "D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio"

echo.
echo Building TopUp AI Credit page...
pnpm run build:cloudflare
if errorlevel 1 (
  echo.
  echo BUILD FAILED. Do not push yet.
  pause
  exit /b 1
)

echo.
echo BUILD PASSED.
echo Next:
echo   git add .
echo   git commit -m "Build Topup AI Credit workflow"
echo   git push origin main
echo.
pause
