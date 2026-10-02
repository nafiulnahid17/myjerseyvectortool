@echo off
setlocal
cd /d "%~dp0"
echo.
echo Applying menu update...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0APPLY_MENU_UPDATE.ps1"
if errorlevel 1 (
  echo.
  echo PATCH FAILED.
  pause
  exit /b 1
)
echo.
echo Running Cloudflare build...
pnpm run build:cloudflare
if errorlevel 1 (
  echo.
  echo BUILD FAILED. Do not push yet.
  pause
  exit /b 1
)
echo.
echo BUILD PASSED.
echo Next commands:
echo   git add .
echo   git commit -m "Add Topup AI Credits and About Us menu items"
echo   git push origin main
echo.
pause
