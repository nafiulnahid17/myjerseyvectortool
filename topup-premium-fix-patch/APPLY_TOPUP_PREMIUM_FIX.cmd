@echo off
setlocal
cd /d "D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio"

echo.
echo Building TopUp AI Credit premium update...
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
echo   git commit -m "Upgrade Topup AI credit UI"
echo   git push origin main
echo.
pause
