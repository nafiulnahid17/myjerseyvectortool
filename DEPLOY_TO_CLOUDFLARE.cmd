@echo off
setlocal EnableExtensions DisableDelayedExpansion
title My Jersey Studio - Cloudflare Deployment
cd /d "%~dp0"
if errorlevel 1 goto :failed
where node >nul 2>&1
if errorlevel 1 goto :missing_node
where npx >nul 2>&1
if errorlevel 1 goto :missing_node
node -e "const v=process.versions.node.split('.').map(Number);process.exit(v[0]>22||(v[0]===22&&v[1]>=13)?0:1)" >nul 2>&1
if errorlevel 1 goto :missing_node
echo [1/3] Installing pinned dependencies...
call npx --yes pnpm@11.25.0 install --frozen-lockfile
if errorlevel 1 goto :failed
echo [2/3] Building the website and Cloudflare Worker...
call npx --yes pnpm@11.25.0 run build:cloudflare
if errorlevel 1 goto :failed
if not exist "dist\server\wrangler.json" goto :failed
echo [3/3] Deploying with your existing Cloudflare login...
call npx --yes pnpm@11.25.0 exec wrangler deploy --config dist/server/wrangler.json
if errorlevel 1 goto :failed
echo.
echo Deployment command completed. Copy the workers.dev URL shown above.
pause
endlocal
exit /b 0
:missing_node
echo Node.js 22.13 or newer and npm are required. Node.js 24 is recommended.
goto :stop
:failed
echo The last command failed. Deployment success has not been confirmed.
echo Review the error output above.
:stop
pause
endlocal
exit /b 1

