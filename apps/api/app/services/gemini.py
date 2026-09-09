"""Gemini spatial analysis of the four wall photos.

Reads the room and returns a structured brief: geometry, lighting, wall
colours and architectural features. That brief is what the render prompt is
built from, so a concept preserves the customer's actual room rather than
inventing a generic interior.

The analysis is best-effort by design. If Gemini is unreachable or the key is
rejected, `analyse_room` returns a brief marked `degraded` instead of raising,
because a render from a weaker prompt is a better outcome for the customer
than no render at all. The caller can see which happened.
"""

from __future__ import annotations

import base64
import json
import logging
import re
from dataclasses import dataclass, field
from typing import Any

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

ANALYSIS_PROMPT = """You are an architectural surveyor. These photographs show the four walls of a single room.

Return ONLY a JSON object, no prose and no code fences, with exactly these keys:

{
  "room_shape": "rectangular | square | L-shaped | irregular",
  "approx_dimensions": "a short estimate such as '4.5m x 3.8m'",
  "ceiling_height": "low | standard | high | double-height",
  "wall_colors": ["the dominant wall colours you can actually see"],
  "flooring": "what the floor is made of",
  "lighting": {
    "natural_light": "none | low | moderate | abundant",
    "window_count": 0,
    "window_positions": ["which wall each window is on"],
    "artificial_sources": ["fixtures you can see"]
  },
  "architectural_features": ["alcoves, beams, mouldings, radiators, columns, fireplaces"],
  "fixed_elements": ["doors, radiators, sockets and anything that cannot move"],
  "existing_condition": "one sentence on the current state",
  "constraints": ["anything that limits a redesign, e.g. a low beam or a door swing"]
}

Report only what is visible. Do not invent features that are not in the photographs."""


@dataclass
class RoomAnalysis:
    """Structured reading of the room."""

    room_shape: str | None = None
    approx_dimensions: str | None = None
    ceiling_height: str | None = None
    wall_colors: list[str] = field(default_factory=list)
    flooring: str | None = None
    lighting: dict[str, Any] = field(default_factory=dict)
    architectural_features: list[str] = field(default_factory=list)
    fixed_elements: list[str] = field(default_factory=list)
    existing_condition: str | None = None
    constraints: list[str] = field(default_factory=list)

    #: False when the model could not be reached; the rest is then empty and
    #: the prompt builder falls back to the project's own metadata.
    ok: bool = True
    detail: str = ""
    model_used: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "room_shape": self.room_shape,
            "approx_dimensions": self.approx_dimensions,
            "ceiling_height": self.ceiling_height,
            "wall_colors": self.wall_colors,
            "flooring": self.flooring,
            "lighting": self.lighting,
            "architectural_features": self.architectural_features,
            "fixed_elements": self.fixed_elements,
            "existing_condition": self.existing_condition,
            "constraints": self.constraints,
            "ok": self.ok,
            "detail": self.detail,
            "model_used": self.model_used,
        }

    def to_prompt_fragment(self) -> str:
        """The spatial half of the render prompt."""
        if not self.ok:
            return ""
        bits: list[str] = []
        if self.room_shape:
            bits.append(f"{self.room_shape} room")
        if self.approx_dimensions:
            bits.append(f"approximately {self.approx_dimensions}")
        if self.ceiling_height:
            bits.append(f"{self.ceiling_height} ceiling")
        if self.wall_colors:
            bits.append(f"walls in {', '.join(self.wall_colors[:3])}")
        if self.flooring:
            bits.append(f"{self.flooring} flooring")

        natural = self.lighting.get("natural_light")
        windows = self.lighting.get("window_count")
        if natural:
            light = f"{natural} natural light"
            if windows:
                light += f" from {windows} window{'s' if windows != 1 else ''}"
            bits.append(light)

        if self.architectural_features:
            bits.append(f"featuring {', '.join(self.architectural_features[:3])}")
        if self.fixed_elements:
            bits.append(f"retaining {', '.join(self.fixed_elements[:3])}")
        return ", ".join(bits)


def _extract_json(text: str) -> dict[str, Any] | None:
    """Pull a JSON object out of a model reply.

    Models wrap JSON in ```json fences often enough that stripping them is
    cheaper than fighting it with prompt wording.
    """
    cleaned = text.strip()
    fence = re.search(r"```(?:json)?\s*(.+?)```", cleaned, re.S)
    if fence:
        cleaned = fence.group(1).strip()
    start, end = cleaned.find("{"), cleaned.rfind("}")
    if start == -1 or end == -1:
        return None
    try:
        return json.loads(cleaned[start : end + 1])
    except json.JSONDecodeError:
        return None


async def _fetch_image(client: httpx.AsyncClient, url: str) -> tuple[str, str] | None:
    """Download one photo and return (mime_type, base64). None on failure."""
    try:
        response = await client.get(url, timeout=30, follow_redirects=True)
        if response.status_code != 200:
            logger.warning("Wall photo fetch returned %s", response.status_code)
            return None
        mime = response.headers.get("content-type", "image/jpeg").split(";")[0]
        if not mime.startswith("image/"):
            mime = "image/jpeg"
        return mime, base64.b64encode(response.content).decode()
    except Exception as exc:  # noqa: BLE001
        logger.warning("Wall photo fetch failed: %s", exc)
        return None


async def analyse_room(image_urls: list[str]) -> RoomAnalysis:
    """Analyse the four wall photos. Never raises."""
    settings = get_settings()

    if not settings.gemini_api_key:
        return RoomAnalysis(ok=False, detail="GEMINI_API_KEY is not set.")
    if not image_urls:
        return RoomAnalysis(ok=False, detail="No wall photos to analyse.")

    async with httpx.AsyncClient() as client:
        parts: list[dict[str, Any]] = [{"text": ANALYSIS_PROMPT}]
        for url in image_urls[:4]:
            fetched = await _fetch_image(client, url)
            if fetched:
                mime, data = fetched
                parts.append({"inline_data": {"mime_type": mime, "data": data}})

        if len(parts) == 1:
            return RoomAnalysis(ok=False, detail="None of the wall photos could be downloaded.")

        model = settings.gemini_vision_model
        try:
            response = await client.post(
                GEMINI_ENDPOINT.format(model=model),
                params={"key": settings.gemini_api_key},
                json={
                    "contents": [{"parts": parts}],
                    "generationConfig": {
                        "temperature": 0.2,
                        # 2048 truncated the brief mid-key, which surfaced as
                        # "not valid JSON". This model also spends several
                        # hundred thinking tokens against the same budget, so
                        # the headroom is deliberate.
                        #
                        # responseMimeType and thinkingConfig are NOT set:
                        # thinkingConfig is rejected outright by this model
                        # (HTTP 400), and the reply arrives in ```json fences
                        # that _extract_json already handles.
                        "maxOutputTokens": 8192,
                    },
                },
                timeout=settings.generation_timeout_seconds,
            )
        except Exception as exc:  # noqa: BLE001
            logger.warning("Gemini request failed: %s", exc)
            return RoomAnalysis(ok=False, detail=f"Gemini unreachable: {exc}")

        if response.status_code != 200:
            message = ""
            try:
                message = response.json().get("error", {}).get("message", "")
            except Exception:  # noqa: BLE001
                message = response.text[:200]
            logger.warning("Gemini returned %s: %s", response.status_code, message)
            return RoomAnalysis(
                ok=False, detail=f"Gemini {response.status_code}: {message[:200]}", model_used=model
            )

        body = response.json()
        try:
            candidate = body["candidates"][0]
        except (KeyError, IndexError):
            return RoomAnalysis(ok=False, detail="Gemini returned no candidates.", model_used=model)

        finish = candidate.get("finishReason")
        # Join every text part: a reply can arrive split across parts.
        text = "".join(
            part["text"]
            for part in candidate.get("content", {}).get("parts", [])
            if "text" in part
        )
        if not text:
            return RoomAnalysis(
                ok=False,
                detail=f"Gemini returned no text (finishReason={finish}).",
                model_used=model,
            )
        if finish == "MAX_TOKENS":
            # Say so plainly. "Invalid JSON" would send someone chasing the
            # prompt when the real fix is the token budget.
            return RoomAnalysis(
                ok=False,
                detail="Gemini hit the output token limit; the brief was truncated.",
                model_used=model,
            )

        payload = _extract_json(text)
        if payload is None:
            return RoomAnalysis(
                ok=False, detail="Gemini reply was not valid JSON.", model_used=model
            )

        lighting = payload.get("lighting")
        return RoomAnalysis(
            room_shape=payload.get("room_shape"),
            approx_dimensions=payload.get("approx_dimensions"),
            ceiling_height=payload.get("ceiling_height"),
            wall_colors=list(payload.get("wall_colors") or []),
            flooring=payload.get("flooring"),
            lighting=lighting if isinstance(lighting, dict) else {},
            architectural_features=list(payload.get("architectural_features") or []),
            fixed_elements=list(payload.get("fixed_elements") or []),
            existing_condition=payload.get("existing_condition"),
            constraints=list(payload.get("constraints") or []),
            ok=True,
            model_used=model,
        )
