@echo off
chcp 65001 >nul
cd /d "%~dp0"
python -c "import cryptography" 2>nul
if errorlevel 1 (
  echo Устанавливаю cryptography...
  python -m pip install cryptography
)
python -c "import PIL" 2>nul
if errorlevel 1 (
  echo Устанавливаю Pillow для сжатия фото...
  python -m pip install pillow
)
python BUILD_ENCRYPTED_ALBUM.py
