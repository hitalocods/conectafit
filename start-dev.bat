@echo off
cd /d "%~dp0"
node.exe node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173
