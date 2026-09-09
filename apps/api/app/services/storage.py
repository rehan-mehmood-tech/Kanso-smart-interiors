"""Uploads to Supabase Storage.

Buckets are private. Nothing here returns a public URL: what is stored on a
row is the object *path*, and a signed URL is minted on read with a short
lifetime. A public bucket would make every customer's room photos guessable.
"""

from __future__ import annotations

import base64
import binascii
import logging
import uuid
from dataclasses import dataclass

from app.core.config import get_settings
from app.db.supabase import get_supabase

logger = logging.getLogger(__name__)

#: Signature-sniffed, not taken from the client. A Content-Type header is a
#: claim; these bytes are evidence.
_MAGIC: tuple[tuple[bytes, str, str], ...] = (
    (b"\xff\xd8\xff", "image/jpeg", "jpg"),
    (b"\x89PNG\r\n\x1a\n", "image/png", "png"),
    (b"GIF87a", "image/gif", "gif"),
    (b"GIF89a", "image/gif", "gif"),
)

MAX_UPLOAD_BYTES = 10 * 1024 * 1024


class UploadError(ValueError):
    """The supplied image could not be accepted."""


@dataclass(frozen=True)
class StoredImage:
    """Where an image landed. `path` is what gets written to the database."""

    path: str
    content_type: str
    size_bytes: int


def _sniff(data: bytes) -> tuple[str, str]:
    """Return (content_type, extension) or raise."""
    for magic, content_type, ext in _MAGIC:
        if data.startswith(magic):
            return content_type, ext
    # WebP is RIFF....WEBP
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp", "webp"
    raise UploadError("That file is not a JPEG, PNG, GIF or WebP image.")


def decode_base64_image(payload: str) -> bytes:
    """Accept a bare base64 string or a full `data:image/...;base64,...` URI."""
    raw = payload.strip()
    if raw.startswith("data:"):
        _, _, raw = raw.partition(",")
    try:
        return base64.b64decode(raw, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise UploadError("The base64 image could not be decoded.") from exc


def upload_wall_photo(
    *,
    project_id: str,
    wall_angle: str,
    data: bytes,
    bucket: str | None = None,
) -> StoredImage:
    """Store one wall capture and return its object path.

    The path is deterministic per project and wall, plus a short random
    suffix. Deterministic so the four walls of a project sit together and are
    easy to reason about; suffixed so replacing a wall writes a new object
    rather than relying on cache invalidation for the old one.
    """
    if not data:
        raise UploadError("The uploaded file is empty.")
    if len(data) > MAX_UPLOAD_BYTES:
        raise UploadError(
            f"That image is {len(data) // 1024 // 1024} MB. The limit is "
            f"{MAX_UPLOAD_BYTES // 1024 // 1024} MB."
        )

    content_type, ext = _sniff(data)
    settings = get_settings()
    target_bucket = bucket or settings.room_photos_bucket
    path = f"{project_id}/{wall_angle}-{uuid.uuid4().hex[:8]}.{ext}"

    storage = get_supabase().storage.from_(target_bucket)
    storage.upload(
        path=path,
        file=data,
        file_options={"content-type": content_type, "upsert": "true"},
    )
    logger.info("Stored %s (%d bytes) in %s", path, len(data), target_bucket)
    return StoredImage(path=path, content_type=content_type, size_bytes=len(data))


def signed_url(path: str, *, bucket: str | None = None, expires_in: int = 3600) -> str | None:
    """A time-limited URL for a private object.

    Returns None rather than raising: a broken thumbnail is a much smaller
    problem than a 500 on the whole project detail response.
    """
    if not path:
        return None
    # A row may already hold an absolute URL (seed data, or an external image).
    if path.startswith("http://") or path.startswith("https://"):
        return path

    settings = get_settings()
    target_bucket = bucket or settings.room_photos_bucket
    try:
        result = get_supabase().storage.from_(target_bucket).create_signed_url(path, expires_in)
        return result.get("signedURL") or result.get("signedUrl")
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not sign %s in %s: %s", path, target_bucket, exc)
        return None
