from pathlib import Path
import hashlib
import json
import re

ROOT = Path("images")
OUTPUT = Path("images.json")
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
VIDEO_EXTENSIONS = {".mp4", ".webm", ".ogg", ".mov", ".m4v"}
ALLOWED_EXTENSIONS = IMAGE_EXTENSIONS | VIDEO_EXTENSIONS
EXCLUDED_FOLDERS = {"sustainability"}


def human_name(stem: str) -> str:
    value = re.sub(r"[-_]+", " ", stem)
    value = re.sub(r"\s+", " ", value).strip()
    return value.title()


def file_version(path: Path) -> str:
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    return digest[:12]


folders = {}

if ROOT.exists():
    for path in sorted(ROOT.rglob("*"), key=lambda p: p.as_posix().lower()):
        if not path.is_file() or path.suffix.lower() not in ALLOWED_EXTENSIONS:
            continue

        relative = path.relative_to(ROOT).as_posix()
        folder = path.parent.relative_to(ROOT).as_posix()
        if folder == ".":
            folder = ""

        folder_parts = set(folder.split("/")) if folder else set()
        if folder_parts & EXCLUDED_FOLDERS:
            continue

        version = file_version(path)
        media_type = "video" if path.suffix.lower() in VIDEO_EXTENSIONS else "image"
        item = {
            "src": "images/" + relative + "?v=" + version,
            "path": relative,
            "name": human_name(path.stem),
            "type": media_type,
            "version": version,
        }
        folders.setdefault(folder, []).append(item)

manifest = {
    "generated": True,
    "folders": folders,
}

OUTPUT.write_text(
    json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)

print(f"Generated {OUTPUT} with {sum(len(items) for items in folders.values())} media files in {len(folders)} folders.")
