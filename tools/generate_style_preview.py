"""Generate a style-preview image through an OpenAI-compatible Image API.

Usage (PowerShell):
  $env:IMAGE_API_KEY = "<your-api-key>"
  python tools/generate_style_preview.py --prompt "..." --out output/style-previews/example.png

The API key is intentionally not stored in this repository.
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import time
import uuid
from pathlib import Path
from urllib.request import Request, urlopen


def download_image(url: str) -> bytes:
    with urlopen(url, timeout=120) as response:
        return response.read()


def api_url(base_url: str, endpoint: str) -> str:
    """Join an OpenAI-compatible base URL with an endpoint exactly once."""
    base = base_url.rstrip("/")
    suffix = endpoint.lstrip("/")
    if base.endswith("/v1") and suffix.startswith("v1/"):
        suffix = suffix[3:]
    return f"{base}/{suffix}"


def parse_image_response(body: dict) -> bytes:
    try:
        image = body["data"][0]
    except (KeyError, IndexError, TypeError) as error:
        raise RuntimeError(f"Unexpected Image API response: {body}") from error

    if image.get("b64_json"):
        return base64.b64decode(image["b64_json"])
    if image.get("url"):
        return download_image(image["url"])
    raise RuntimeError(f"Image API response contains neither b64_json nor url: {body}")


def generate_image(
    prompt: str, model: str, size: str, quality: str, input_path: Path | None = None
) -> bytes:
    api_key = os.environ.get("IMAGE_API_KEY")
    if not api_key:
        raise RuntimeError("Set IMAGE_API_KEY before running this script.")

    base_url = os.environ.get("IMAGE_API_BASE_URL", "https://api.ggboys.xyz").rstrip("/")
    payload = {
        "model": model,
        "prompt": prompt,
        "n": 1,
        "size": size,
        "quality": quality,
        "response_format": "b64_json",
    }
    if input_path:
        if not input_path.is_file():
            raise RuntimeError(f"Input image does not exist: {input_path}")
        boundary = f"----CodexImage{uuid.uuid4().hex}"
        fields = {
            "model": model,
            "prompt": prompt,
            "n": "1",
            "size": size,
            "quality": quality,
            "response_format": "b64_json",
        }
        chunks: list[bytes] = []
        for name, value in fields.items():
            chunks.extend(
                [
                    f"--{boundary}\r\n".encode(),
                    f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode(),
                    str(value).encode(),
                    b"\r\n",
                ]
            )
        mime = "image/png" if input_path.suffix.lower() == ".png" else "image/jpeg"
        chunks.extend(
            [
                f"--{boundary}\r\n".encode(),
                f'Content-Disposition: form-data; name="image"; filename="{input_path.name}"\r\n'.encode(),
                f"Content-Type: {mime}\r\n\r\n".encode(),
                input_path.read_bytes(),
                b"\r\n",
                f"--{boundary}--\r\n".encode(),
            ]
        )
        request = Request(
            api_url(base_url, "/v1/images/edits"),
            data=b"".join(chunks),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": f"multipart/form-data; boundary={boundary}",
            },
            method="POST",
        )
    else:
        request = Request(
            api_url(base_url, "/v1/images/generations"),
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

    last_error: Exception | None = None
    for attempt in range(2):
        try:
            with urlopen(request, timeout=180) as response:
                body = json.loads(response.read().decode("utf-8"))
            return parse_image_response(body)
        except Exception as error:
            last_error = error
            if attempt == 0:
                time.sleep(3)

    raise RuntimeError(f"Image API request failed after retry: {last_error}") from last_error


def main() -> None:
    parser = argparse.ArgumentParser()
    prompt_group = parser.add_mutually_exclusive_group(required=True)
    prompt_group.add_argument("--prompt")
    prompt_group.add_argument("--prompt-file", type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--model", default=os.environ.get("IMAGE_API_MODEL", "image2"))
    parser.add_argument("--size", default="1536x1024")
    parser.add_argument("--quality", default="low")
    parser.add_argument(
        "--input",
        type=Path,
        help="Reference/edit image. Uses the images/edits endpoint when supplied.",
    )
    args = parser.parse_args()

    if args.prompt is not None:
        prompt = args.prompt
    elif args.prompt_file.is_file():
        prompt = args.prompt_file.read_text(encoding="utf-8")
    else:
        raise RuntimeError(f"Prompt file does not exist: {args.prompt_file}")
    image_bytes = generate_image(prompt, args.model, args.size, args.quality, args.input)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_bytes(image_bytes)
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
