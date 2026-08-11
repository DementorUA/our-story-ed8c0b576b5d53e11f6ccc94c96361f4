#!/usr/bin/env python3
"""
Build an AES-256-GCM encrypted photo album for the static GitHub Pages site.

Default layout:
  private/photos/                 source photos, never publish
  assets/encrypted/album.json      public encrypted album descriptor
  assets/encrypted/manifest.enc    encrypted manifest
  assets/encrypted/photos/*.enc    encrypted optimized photos and thumbnails
"""

from __future__ import annotations

from argparse import ArgumentParser
from dataclasses import dataclass
from getpass import getpass
from io import BytesIO
from pathlib import Path
import base64
import hashlib
import json
import os
import shutil
import sys

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError:
    print("Missing dependency: cryptography")
    print("Install it with: python -m pip install cryptography")
    raise SystemExit(1)

try:
    from PIL import Image, ImageOps
except ImportError:
    print("Missing dependency: Pillow")
    print("Install it with: python -m pip install pillow")
    raise SystemExit(1)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PHOTOS = PROJECT_ROOT / "private" / "photos"
DEFAULT_OUT = PROJECT_ROOT / "assets" / "encrypted"

ITERATIONS = 600_000
MAIN_MAX_EDGE = 2200
THUMB_MAX_EDGE = 520
MAIN_QUALITY = 86
THUMB_QUALITY = 72
SUPPORTED = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".bmp", ".heic", ".heif"}
DEFAULT_QUOTE = "Некоторые мгновения проходят. Другие остаются жить внутри нас."


@dataclass
class EncodedImage:
    data: bytes
    mime: str
    width: int
    height: int


def b64(data: bytes) -> str:
    return base64.b64encode(data).decode("ascii")


def human_size(value: int) -> str:
    units = ("B", "KB", "MB", "GB")
    size = float(value)
    for unit in units:
        if size < 1024 or unit == units[-1]:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{value} B"


def encrypt(aes: AESGCM, data: bytes) -> tuple[bytes, bytes]:
    nonce = os.urandom(12)
    return nonce, aes.encrypt(nonce, data, None)


def random_name(index: int, kind: str) -> str:
    return f"{index:04d}-{kind}-{os.urandom(16).hex()}.enc"


def image_to_web(path: Path, max_edge: int, quality: int) -> EncodedImage:
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        width, height = image.size

        has_alpha = image.mode in ("RGBA", "LA") or (
            image.mode == "P" and "transparency" in image.info
        )
        output = BytesIO()

        if has_alpha:
            image.save(output, format="WEBP", quality=quality, method=6)
            return EncodedImage(output.getvalue(), "image/webp", width, height)

        if image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        image.save(output, format="JPEG", quality=quality, optimize=True, progressive=True)
        return EncodedImage(output.getvalue(), "image/jpeg", width, height)


def find_photos(path: Path) -> list[Path]:
    path.mkdir(exist_ok=True)
    return sorted(
        [p for p in path.rglob("*") if p.is_file() and p.suffix.lower() in SUPPORTED],
        key=lambda p: p.name.casefold(),
    )


def prompt_password(allow_short: bool) -> str | None:
    password = getpass("Введите секретную фразу: ")
    repeat = getpass("Повторите секретную фразу: ")
    if not password or password != repeat:
        print("Фразы пустые или не совпадают.")
        return None

    if len(password) < 20 and not allow_short:
        print("Фраза короче 20 символов.")
        print("Для личных фото лучше 5-7 случайных слов или 20+ символов.")
        confirm = input("Продолжить всё равно? [y/N]: ").strip().lower()
        if confirm not in {"y", "yes", "д", "да"}:
            return None
    return password


def build_album(args) -> int:
    photos_dir = args.photos.resolve()
    out_dir = args.out.resolve()
    files = find_photos(photos_dir)

    if not files:
        print(f"Положите фотографии в папку:\n{photos_dir}")
        return 1

    password = prompt_password(args.allow_short_password)
    if password is None:
        return 1

    title = args.title or input("Название альбома [Our Story]: ").strip() or "Our Story"
    quote = args.quote or input("Главная цитата [оставить стандартную]: ").strip() or DEFAULT_QUOTE

    if out_dir.exists():
        if not args.yes:
            print(f"Папка будет пересоздана:\n{out_dir}")
            confirm = input("Продолжить? [y/N]: ").strip().lower()
            if confirm not in {"y", "yes", "д", "да"}:
                return 1
        shutil.rmtree(out_dir)
    (out_dir / "photos").mkdir(parents=True)

    salt = os.urandom(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, args.iterations, dklen=32)
    aes = AESGCM(key)

    original_total = 0
    encrypted_total = 0
    manifest_photos = []

    for index, photo in enumerate(files, 1):
        original_total += photo.stat().st_size
        full = image_to_web(photo, args.main_edge, args.main_quality)
        thumb = image_to_web(photo, args.thumb_edge, args.thumb_quality)

        full_nonce, full_encrypted = encrypt(aes, full.data)
        thumb_nonce, thumb_encrypted = encrypt(aes, thumb.data)

        full_name = random_name(index, "full")
        thumb_name = random_name(index, "thumb")
        (out_dir / "photos" / full_name).write_bytes(full_encrypted)
        (out_dir / "photos" / thumb_name).write_bytes(thumb_encrypted)
        encrypted_total += len(full_encrypted) + len(thumb_encrypted)

        manifest_photos.append({
            "name": f"Фото {index}",
            "full": {
                "mime": full.mime,
                "path": f"assets/encrypted/photos/{full_name}",
                "nonce": b64(full_nonce),
                "width": full.width,
                "height": full.height,
            },
            "thumb": {
                "mime": thumb.mime,
                "path": f"assets/encrypted/photos/{thumb_name}",
                "nonce": b64(thumb_nonce),
                "width": thumb.width,
                "height": thumb.height,
            },
            "caption": "",
        })
        print(f"[{index}/{len(files)}] {photo.name} -> full {human_size(len(full.data))}, thumb {human_size(len(thumb.data))}")

    manifest = {
        "version": 2,
        "title": title,
        "quote": quote,
        "photos": manifest_photos,
    }
    manifest_nonce, manifest_encrypted = encrypt(
        aes, json.dumps(manifest, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    )
    (out_dir / "manifest.enc").write_bytes(manifest_encrypted)

    descriptor = {
        "version": 2,
        "algorithm": "AES-256-GCM",
        "kdf": "PBKDF2-SHA-256",
        "iterations": args.iterations,
        "salt": b64(salt),
        "manifest": {
            "path": "assets/encrypted/manifest.enc",
            "nonce": b64(manifest_nonce),
        },
    }
    (out_dir / "album.json").write_text(
        json.dumps(descriptor, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print("\nГотово.")
    print(f"Фото: {len(files)}")
    print(f"Исходный размер: {human_size(original_total)}")
    print(f"Зашифрованный web-альбом: {human_size(encrypted_total)}")
    print(f"Результат: {out_dir}")
    print("Теперь сделайте commit и push папки assets/encrypted.")
    return 0


def parse_args(argv: list[str]):
    parser = ArgumentParser(description="Build encrypted Our Story album.")
    parser.add_argument("--photos", type=Path, default=DEFAULT_PHOTOS, help="Source photos folder.")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT, help="Encrypted output folder.")
    parser.add_argument("--title", default=None, help="Album title. Omit for interactive prompt.")
    parser.add_argument("--quote", default=None, help="Main quote. Omit for interactive prompt.")
    parser.add_argument("--iterations", type=int, default=ITERATIONS, help="PBKDF2 iterations.")
    parser.add_argument("--main-edge", type=int, default=MAIN_MAX_EDGE, help="Max long edge for full images.")
    parser.add_argument("--thumb-edge", type=int, default=THUMB_MAX_EDGE, help="Max long edge for thumbnails.")
    parser.add_argument("--main-quality", type=int, default=MAIN_QUALITY, help="JPEG/WebP quality for full images.")
    parser.add_argument("--thumb-quality", type=int, default=THUMB_QUALITY, help="JPEG/WebP quality for thumbnails.")
    parser.add_argument("--allow-short-password", action="store_true", help="Do not warn about short passwords.")
    parser.add_argument("-y", "--yes", action="store_true", help="Overwrite output without asking.")
    parser.add_argument("--no-pause", action="store_true", help="Do not wait for Enter before exit.")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    try:
        return build_album(args)
    finally:
        if not getattr(args, "no_pause", False):
            input("Enter для выхода...")


if __name__ == "__main__":
    raise SystemExit(main())
