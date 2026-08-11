#!/usr/bin/env python3
"""Stamp static assets with a fresh cache-busting version."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
import json
import re


ROOT = Path(__file__).resolve().parents[1]
VERSION = datetime.now().strftime("%Y%m%d-%H%M%S")
HTML_FILES = (ROOT / "index.html",)
VERSION_FILE = ROOT / "assets" / "site-version.json"
FRESHNESS_FILE = ROOT / "assets" / "js" / "freshness.js"


def replace_versioned_asset(text: str, asset: str) -> str:
    pattern = rf'({re.escape(asset)})(?:\?v=[0-9A-Za-z._-]+)?'
    return re.sub(pattern, rf"\1?v={VERSION}", text)


def main() -> None:
    VERSION_FILE.write_text(
        json.dumps({"version": VERSION}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    freshness = FRESHNESS_FILE.read_text(encoding="utf-8")
    freshness = re.sub(
        r'const CURRENT_VERSION = "[^"]+";',
        f'const CURRENT_VERSION = "{VERSION}";',
        freshness,
        count=1,
    )
    FRESHNESS_FILE.write_text(freshness, encoding="utf-8")

    for html_file in HTML_FILES:
        text = html_file.read_text(encoding="utf-8")
        for asset in (
            "assets/js/freshness.js",
            "assets/css/styles.css",
            "assets/js/app.js",
        ):
            text = replace_versioned_asset(text, asset)
        html_file.write_text(text, encoding="utf-8")

    print(f"Stamped site version: {VERSION}")


if __name__ == "__main__":
    main()
