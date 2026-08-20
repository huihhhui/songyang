@echo off
setlocal
where pnpm >nul 2>nul
if %errorlevel%==0 (
  pnpm install
  exit /b %errorlevel%
)
set "PNPM_EXE=C:\Users\hp\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd"
if not exist "%PNPM_EXE%" (
  echo pnpm was not found. Install Node.js LTS, then run: npm install -g pnpm
  exit /b 1
)
call "%PNPM_EXE%" install
