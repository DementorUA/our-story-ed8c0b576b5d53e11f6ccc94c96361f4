@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"

set "PYTHON_CMD="
where python >nul 2>nul
if not errorlevel 1 set "PYTHON_CMD=python"

if not defined PYTHON_CMD (
  py -3.13 --version >nul 2>nul
  if not errorlevel 1 set "PYTHON_CMD=py -3.13"
)

if not defined PYTHON_CMD (
  where py >nul 2>nul
  if not errorlevel 1 set "PYTHON_CMD=py -3"
)

if not defined PYTHON_CMD (
  echo Python 3 was not found.
  echo Install Python from https://www.python.org/downloads/ and enable "Add python.exe to PATH".
  echo.
  pause
  exit /b 1
)

%PYTHON_CMD% -c "import sys; raise SystemExit(0 if sys.version_info >= (3, 9) else 1)"
if errorlevel 1 (
  echo Python 3.9 or newer is required.
  echo.
  pause
  exit /b 1
)

%PYTHON_CMD% -c "import cryptography" >nul 2>nul
if errorlevel 1 (
  echo Installing cryptography...
  %PYTHON_CMD% -m pip install cryptography
  if errorlevel 1 goto build_failed
)

%PYTHON_CMD% -c "import PIL" >nul 2>nul
if errorlevel 1 (
  echo Installing Pillow...
  %PYTHON_CMD% -m pip install pillow
  if errorlevel 1 goto build_failed
)

%PYTHON_CMD% tools\build_encrypted_album.py --no-pause
set "BUILD_EXIT=%ERRORLEVEL%"
echo.

if not "%BUILD_EXIT%"=="0" (
  echo Build failed with exit code %BUILD_EXIT%.
  echo Check that your photos are in PRIVATE_PHOTOS and try again.
  echo.
  pause
  exit /b %BUILD_EXIT%
)

%PYTHON_CMD% tools\stamp_site_version.py
if errorlevel 1 (
  echo Site version stamp failed.
  echo.
  pause
  exit /b 1
)

echo Build complete.
echo.
pause
exit /b 0

:build_failed
echo.
echo Dependency installation failed.
echo Try running this command manually:
echo   %PYTHON_CMD% -m pip install cryptography pillow
echo.
pause
exit /b 1
