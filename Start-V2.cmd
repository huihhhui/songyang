@echo off
setlocal
if not exist "%~dp0node_modules\vite\bin\vite.js" (
  echo Dependencies are missing. Run Setup-V2.cmd first.
  pause
  exit /b 1
)
where npm >nul 2>nul
if %errorlevel%==0 (
  cd /d "%~dp0"
  npm run dev -- --host 127.0.0.1 --port 5173
  exit /b %errorlevel%
)
set "NODE_EXE=C:\Users\hp\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not exist "%NODE_EXE%" (
  echo Node.js was not found. Install Node.js LTS and run Setup-V2.cmd.
  pause
  exit /b 1
)
cd /d "%~dp0"
"%NODE_EXE%" "%~dp0node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173
