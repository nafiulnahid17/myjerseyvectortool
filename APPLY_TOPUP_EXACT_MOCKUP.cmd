@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
set "PAYLOAD=%ROOT%payload"

echo.
echo ================================================
echo  My Jersey Studio - TopUp Exact Mockup Patch
echo ================================================
echo.

if not exist "%ROOT%app" (
  echo ERROR: Extract this ZIP directly into your project root.
  echo Expected to find: %ROOT%app
  pause
  exit /b 1
)

if not exist "%PAYLOAD%\app\topup-ai-credits\page.tsx" (
  echo ERROR: Patch payload is missing.
  pause
  exit /b 1
)

echo [1/4] Backing up current TopUp page...
if exist "%ROOT%app\topup-ai-credits\page.tsx" (
  copy /Y "%ROOT%app\topup-ai-credits\page.tsx" "%ROOT%app\topup-ai-credits\page.before-exact-mockup.tsx" >nul
)

echo [2/4] Applying page and visual assets...
xcopy /E /I /Y "%PAYLOAD%\app" "%ROOT%app" >nul
xcopy /E /I /Y "%PAYLOAD%\public" "%ROOT%public" >nul

echo [3/4] Cleaning old build output...
rmdir /S /Q "%ROOT%dist" 2>nul
rmdir /S /Q "%ROOT%.next" 2>nul

echo [4/4] Building Cloudflare production bundle...
cd /d "%ROOT%"
call pnpm run build:cloudflare

if errorlevel 1 (
  echo.
  echo BUILD FAILED - DO NOT PUSH YET.
  echo Run this to capture the first build error:
  echo pnpm run build:cloudflare ^> build-error.txt 2^>^&1
  pause
  exit /b 1
)

echo.
echo ================================================
echo BUILD PASSED
echo ================================================
echo.
echo Next commands:
echo   git add .
echo   git commit -m "Rebuild TopUp AI Credit page from mockup"
echo   git pull --rebase origin main
echo   git push origin main
echo.
pause
