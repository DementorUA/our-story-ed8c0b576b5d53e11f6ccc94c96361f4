@echo off
cd /d "%~dp0..\.."
start "" http://localhost:8080
python tools\dev_server.py
pause
