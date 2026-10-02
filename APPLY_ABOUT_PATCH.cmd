@echo off
setlocal
cd /d "D:\My-Jersey-Production-Studio-Source\my-jersey-production-studio"

echo.
echo Building premium About Us page...
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
echo   git commit -m "Upgrade About Us page"
echo   git push origin main
echo.
pause
