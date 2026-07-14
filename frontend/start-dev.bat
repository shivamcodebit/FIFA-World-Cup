@echo off
SET PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
node_modules\.bin\vite.cmd --host
