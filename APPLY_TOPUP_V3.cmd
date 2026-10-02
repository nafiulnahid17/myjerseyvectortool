@echo off
setlocal
cd /d "D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio"

echo.
echo Cleaning previous build...
rmdir /s /q dist 2>nul
rmdir /s /q .next 2>nul

echo.
echo Building TopUp AI Credit V3...
pnpm run build:cloudflare

if errorlevel 1 (
  echo.
  echo BUILD FAILED. Do not push yet.
  pause
  exit /b 1
)

echo.
echo BUILD PASSED.
echo.
echo Run:
echo git add .
echo git commit -m "Upgrade TopUp AI Credit page V3"
echo git push origin main
echo.
pause
