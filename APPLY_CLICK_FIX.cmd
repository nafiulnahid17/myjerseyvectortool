@echo off
setlocal
cd /d "%~dp0"
echo.
echo Applying My Jersey Studio click/routing recovery...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0apply_click_fix.ps1"
if errorlevel 1 (
  echo.
  echo PATCH FAILED.
  pause
  exit /b 1
)
echo.
echo PATCH COMPLETE.
echo Now run: pnpm run build:cloudflare
echo.
pause
