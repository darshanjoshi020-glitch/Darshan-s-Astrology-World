@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20 or newer is required. Install it from https://nodejs.org/ then reopen this file.
  pause
  exit /b 1
)
for /f "tokens=1 delims=.v" %%V in ('node --version') do set NODE_MAJOR=%%V
if %NODE_MAJOR% LSS 20 (
  echo Node.js 20 or newer is required. Current version:
  node --version
  pause
  exit /b 1
)
if not exist ".env" (
  copy /y ".env.example" ".env" >nul
  echo Created .env. Optional API credentials can be added later.
)
start "Darshan's Astrology World Server" cmd /k "cd /d "%~dp0" ^&^& npm start"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:4173"
endlocal
