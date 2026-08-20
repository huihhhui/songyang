"""Generate visual-style comparison drafts with an OpenAI-compatible image API.

Usage (PowerShell):
  $env:OPENAI_API_KEY = "your-key"
  python tools/generate_style_previews.py

The API key is intentionally read from the environment and never stored here.
"""

from __future__ import annotations

import argparse
import base64
from http.client import RemoteDisconnected
import json
import os
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


DEFAULT_BASE_URL = "https://api.ggboys.xyz/v1"
MODEL = "gpt-image-2"
SIZE = "1024x1024"

COMMON_SCENE = """
Create a visual concept draft for an interactive digital fieldwork exhibition.
The same subject must appear in every variation: a weathered wooden beehive on a stone base beneath an old tree in Banqiao She ethnic township, with an earthen-yellow village wall and one small red-and-blue woven fabric accent. The beehive is the quiet observer of the scene. Show material evidence, weathering, moss, wood grain, stone texture and a sense of attentive stillness.
Do not invent or imitate specific ethnic sacred symbols. Do not include people, readable text, logos, watermarks, user-interface panels, maps, or fantasy architecture.
""".strip()

STYLE_PROMPTS = {
    "a-handmade-field-theater": """
Use case: stylized-concept
Asset type: art direction preview
Style/medium: handmade fieldwork theater, layered paper-cut and low-poly miniature stage, tactile paper fibers, carved wood, rough earthen wall, subtle cast shadows on a tabletop diorama
Composition/framing: eye-level three-quarter view, centered beehive, shallow stage layers behind it
Lighting/mood: calm warm afternoon, precise soft shadows, archival and contemplative
Color palette: earthen yellow, stone gray, deep leaf green, restrained woven red and blue, aged paper cream
Constraints: visually sophisticated contemporary exhibition design, not childish, no text
""",
    "b-shadow-archive": """
Use case: illustration-story
Asset type: art direction preview
Style/medium: layered shadow archive, translucent paper screens, ink linework, cut-paper silhouettes and softly projected light; the beehive remains clearly tactile and real
Composition/framing: frontal quiet stage composition, beehive in the foreground, tree canopy and earthen architecture as layered translucent silhouettes
Lighting/mood: late-afternoon light through a doorway, restrained contrast, cinematic but calm
Color palette: charcoal ink, warm clay, muted blue, faded vermilion, parchment
Constraints: general contemporary archival visual language only, not a claim about local traditional shadow theatre, no text
""",
    "c-digital-specimen-desk": """
Use case: stylized-concept
Asset type: art direction preview
Style/medium: contemporary digital specimen desk, museum conservation table, low-poly object study, photographic contact-sheet fragments, index-paper edges, subtle 3D reconstruction fragments
Composition/framing: slightly elevated three-quarter view, beehive as the single hero object on a study surface, arranged evidence fragments around it without readable writing
Lighting/mood: focused studio daylight, quiet, analytical, elegant
Color palette: paper cream, graphite gray, earthen yellow, weathered wood brown, moss green, restrained red and blue
Constraints: no visible UI controls, no readable text, no fake point-cloud scan, no watermark
""",
}


def image_bytes(item: dict) -> bytes:
    if item.get("b64_json"):
        return base64.b64decode(item["b64_json"])
    if item.get("url"):
        with urlopen(item["url"]) as response:  # nosec B310 - URL returned by the requested image API
            return response.read()
    raise RuntimeError("Image API response did not include b64_json or url.")


def generate_image(base_url: str, api_key: str, prompt: str, quality: str) -> bytes:
    payload = json.dumps(
        {
            "model": MODEL,
            "prompt": prompt,
            "size": SIZE,
            "quality": quality,
            "output_format": "png",
        },
    ).encode("utf-8")
    request = Request(
        f"{base_url}/images/generations",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) WutongerDesignPreview/1.0",
        },
        method="POST",
    )
    try:
        with urlopen(request, timeout=180) as response:  # nosec B310 - user-selected API endpoint
            result = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Image generation failed ({error.code}): {detail}") from error
    except (URLError, RemoteDisconnected) as error:
        raise RuntimeError(
            "Image generation connection was rejected by the API. "
            "Check whether the provider enables POST /v1/images/generations "
            "for this key and network."
        ) from error

    data = result.get("data") or []
    if not data:
        raise RuntimeError(f"Image API response did not include data: {result}")
    return image_bytes(data[0])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--output-dir",
        default="output/imagegen/style-previews",
        help="Directory for generated PNG drafts.",
    )
    parser.add_argument("--quality", default="low", choices=["low", "medium", "high", "auto"])
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("Set OPENAI_API_KEY before running this script.")
    base_url = os.environ.get("OPENAI_BASE_URL", DEFAULT_BASE_URL).rstrip("/")

    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    for name, style_prompt in STYLE_PROMPTS.items():
        target = output_dir / f"{name}.png"
        target.write_bytes(
            generate_image(base_url, api_key, f"{COMMON_SCENE}\n\n{style_prompt.strip()}", args.quality),
        )
        print(target)


if __name__ == "__main__":
    main()
