#!/usr/bin/env python3
"""
Builds an AES-256-GCM encrypted album for the GitHub Pages site.

Usage:
    python BUILD_ENCRYPTED_ALBUM.py

Dependencies:
    pip install cryptography
"""
from pathlib import Path
from getpass import getpass
import base64
import hashlib
import json
import mimetypes
import os
import shutil
import sys
from io import BytesIO

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError:
    print("Не найден пакет cryptography.")
    print("Установите: python -m pip install cryptography")
    input("Enter для выхода...")
    raise SystemExit(1)

try:
    from PIL import Image, ImageOps
except ImportError:
    Image = None
    ImageOps = None

ROOT = Path(__file__).resolve().parent
PHOTOS = ROOT / "PRIVATE_PHOTOS"
OUT = ROOT / "assets" / "encrypted"
ITERATIONS = 600_000
MAIN_MAX_EDGE = 2200
THUMB_MAX_EDGE = 520
MAIN_QUALITY = 86
THUMB_QUALITY = 72
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp", ".heic", ".heif"}

def b64(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")

def encrypt(aes: AESGCM, data: bytes):
    nonce = os.urandom(12)
    return nonce, aes.encrypt(nonce, data, None)

def random_name(index: int, kind: str) -> str:
    return f"{index:04d}-{kind}-{os.urandom(16).hex()}.enc"

def optimize_image(path: Path, max_edge: int, quality: int) -> tuple[bytes, str, int, int]:
    if Image is None:
        return path.read_bytes(), mimetypes.guess_type(path.name)[0] or "application/octet-stream", 0, 0

    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        has_alpha = image.mode in ("RGBA", "LA") or (
            image.mode == "P" and "transparency" in image.info
        )

        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        width, height = image.size

        output = BytesIO()
        if has_alpha:
            image.save(output, format="WEBP", quality=quality, method=6)
            return output.getvalue(), "image/webp", width, height

        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        image.save(output, format="JPEG", quality=quality, optimize=True, progressive=True)
        return output.getvalue(), "image/jpeg", width, height

def main():
    PHOTOS.mkdir(exist_ok=True)
    files = sorted(
        [p for p in PHOTOS.rglob("*") if p.is_file() and p.suffix.lower() in SUPPORTED],
        key=lambda p: p.name.casefold()
    )
    if not files:
        print(f"Положите фотографии в папку:\n{PHOTOS}")
        input("Enter для выхода...")
        return

    if Image is None:
        print("Не найден Pillow, фото будут зашифрованы без сжатия и превью.")
        print("Рекомендуется установить: python -m pip install pillow")

    password = getpass("Введите секретную фразу: ")
    repeat = getpass("Повторите секретную фразу: ")
    if not password or password != repeat:
        print("Фразы пустые или не совпадают.")
        input("Enter для выхода...")
        return
    if len(password) < 20:
        print("Фраза короче 20 символов. Для личных фото лучше 5-7 случайных слов или 20+ символов.")
        confirm = input("Продолжить всё равно? [y/N]: ").strip().lower()
        if confirm not in {"y", "yes", "д", "да"}:
            return

    title = input("Название альбома [Our Story]: ").strip() or "Our Story"
    quote = input("Главная цитата [оставить стандартную]: ").strip() or \
        "Некоторые мгновения проходят. Другие остаются жить внутри нас."

    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "photos").mkdir(parents=True)

    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERATIONS, dklen=32)
    aes = AESGCM(key)

    manifest_photos = []
    for index, photo in enumerate(files, 1):
        full_raw, full_mime, full_w, full_h = optimize_image(photo, MAIN_MAX_EDGE, MAIN_QUALITY)
        thumb_raw, thumb_mime, thumb_w, thumb_h = optimize_image(photo, THUMB_MAX_EDGE, THUMB_QUALITY)

        full_nonce, full_encrypted = encrypt(aes, full_raw)
        thumb_nonce, thumb_encrypted = encrypt(aes, thumb_raw)

        full_name = random_name(index, "full")
        thumb_name = random_name(index, "thumb")
        full_relative = f"assets/encrypted/photos/{full_name}"
        thumb_relative = f"assets/encrypted/photos/{thumb_name}"
        (OUT / "photos" / full_name).write_bytes(full_encrypted)
        (OUT / "photos" / thumb_name).write_bytes(thumb_encrypted)

        manifest_photos.append({
            "name": f"Фото {index}",
            "full": {
                "mime": full_mime,
                "path": full_relative,
                "nonce": b64(full_nonce),
                "width": full_w,
                "height": full_h
            },
            "thumb": {
                "mime": thumb_mime,
                "path": thumb_relative,
                "nonce": b64(thumb_nonce),
                "width": thumb_w,
                "height": thumb_h
            },
            "caption": ""
        })
        print(f"[{index}/{len(files)}] {photo.name}")

    manifest = {
        "version": 1,
        "title": title,
        "quote": quote,
        "photos": manifest_photos
    }
    manifest_nonce, manifest_encrypted = encrypt(
        aes, json.dumps(manifest, ensure_ascii=False).encode("utf-8")
    )
    (OUT / "manifest.enc").write_bytes(manifest_encrypted)

    descriptor = {
        "version": 1,
        "algorithm": "AES-256-GCM",
        "kdf": "PBKDF2-SHA-256",
        "iterations": ITERATIONS,
        "salt": b64(salt),
        "manifest": {
            "path": "assets/encrypted/manifest.enc",
            "nonce": b64(manifest_nonce)
        }
    }
    (OUT / "album.json").write_text(
        json.dumps(descriptor, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    print("\nГотово!")
    print(f"Зашифровано фотографий: {len(files)}")
    print(f"Результат: {OUT}")
    print("Теперь загрузите весь проект в GitHub-репозиторий.")
    input("Enter для выхода...")

if __name__ == "__main__":
    main()
