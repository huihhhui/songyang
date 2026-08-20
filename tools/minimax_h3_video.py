"""MiniMax H3 video helper for Wutonger Sunyang.

This script intentionally never prints the API key.

Examples:
  # Text to video
  python tools/minimax_h3_video.py create --prompt "..." --duration 5 --resolution 768P --ratio 16:9

  # First-frame image to video. The image must be a public URL, not a local path.
  python tools/minimax_h3_video.py create --prompt "..." --first-frame-url "https://example.com/frame.png"

  # Query
  python tools/minimax_h3_video.py query --task-id 424010985738629

  # Download if query has succeeded
  python tools/minimax_h3_video.py download --task-id 424010985738629 --out output/video/clip.mp4
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_KEY_FILE = Path(r"E:\userfile\desktop\APIkey\minimaxh3-松阳.txt")
BASE_URL = "https://api.minimax.io"


def load_api_key(key_file: Path | None = None) -> str:
    env_key = os.environ.get("MINIMAX_API_KEY", "").strip()
    if env_key:
        return env_key
    path = key_file or DEFAULT_KEY_FILE
    if path.is_file():
        key = path.read_text(encoding="utf-8").strip()
        if key:
            return key
    raise RuntimeError("MiniMax API key not found. Set MINIMAX_API_KEY or provide --key-file.")


def request_json(method: str, path: str, api_key: str, payload: dict | None = None) -> dict:
    data = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers = {"Authorization": f"Bearer {api_key}"}
    if payload is not None:
        headers["Content-Type"] = "application/json"
    request = Request(f"{BASE_URL}{path}", data=data, headers=headers, method=method)
    try:
        with urlopen(request, timeout=180) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as error:
        raise RuntimeError(f"MiniMax request failed: {error}") from error


def create_task(args: argparse.Namespace) -> None:
    api_key = load_api_key(args.key_file)
    content: list[dict] = [{"type": "text", "text": args.prompt}]
    if args.first_frame_url:
        content.append({"type": "image_url", "url": args.first_frame_url, "role": "first_frame"})
    if args.last_frame_url:
        content.append({"type": "image_url", "url": args.last_frame_url, "role": "last_frame"})
    for url in args.reference_image_url or []:
        content.append({"type": "image_url", "url": url, "role": "reference_image"})
    for url in args.reference_video_url or []:
        content.append({"type": "video_url", "url": url, "role": "reference_video"})
    for url in args.reference_audio_url or []:
        content.append({"type": "audio_url", "url": url, "role": "reference_audio"})

    payload: dict = {
        "model": "MiniMax-H3",
        "content": content,
        "resolution": args.resolution,
        "duration": args.duration,
    }
    if args.callback_url:
        payload["callback_url"] = args.callback_url
    if not (args.first_frame_url or args.last_frame_url):
        payload["ratio"] = args.ratio

    result = request_json("POST", "/v2/video_generation", api_key, payload)
    print(json.dumps(result, ensure_ascii=False, indent=2))


def query_task(args: argparse.Namespace) -> dict:
    api_key = load_api_key(args.key_file)
    result = request_json("GET", f"/v2/query/video_generation/{args.task_id}", api_key)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return result


def download_task(args: argparse.Namespace) -> None:
    api_key = load_api_key(args.key_file)
    result = request_json("GET", f"/v2/query/video_generation/{args.task_id}", api_key)
    task = result.get("task") or {}
    if task.get("status") != "succeeded":
        raise RuntimeError(f"Task is not succeeded yet: {task.get('status')}")
    url = (task.get("content") or {}).get("url")
    if not url:
        raise RuntimeError("Succeeded task does not include content.url")
    out = args.out
    out.parent.mkdir(parents=True, exist_ok=True)
    with urlopen(url, timeout=240) as response:
        out.write_bytes(response.read())
    print(f"Wrote {out}")


def wait_task(args: argparse.Namespace) -> None:
    api_key = load_api_key(args.key_file)
    deadline = time.time() + args.timeout
    while time.time() < deadline:
        result = request_json("GET", f"/v2/query/video_generation/{args.task_id}", api_key)
        task = result.get("task") or {}
        status = task.get("status")
        print(f"status={status}")
        if status in {"succeeded", "failed", "cancelled"}:
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return
        time.sleep(args.interval)
    raise TimeoutError(f"Timed out waiting for task {args.task_id}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument("--key-file", type=Path, default=DEFAULT_KEY_FILE)
    sub = parser.add_subparsers(dest="command", required=True)

    create = sub.add_parser("create")
    create.add_argument("--prompt", required=True)
    create.add_argument("--resolution", choices=["768P", "2K"], default="768P")
    create.add_argument("--duration", type=int, choices=range(4, 16), default=5)
    create.add_argument("--ratio", choices=["21:9", "16:9", "4:3", "1:1", "3:4", "9:16"], default="16:9")
    create.add_argument("--first-frame-url")
    create.add_argument("--last-frame-url")
    create.add_argument("--reference-image-url", action="append")
    create.add_argument("--reference-video-url", action="append")
    create.add_argument("--reference-audio-url", action="append")
    create.add_argument("--callback-url")
    create.set_defaults(func=create_task)

    query = sub.add_parser("query")
    query.add_argument("--task-id", required=True)
    query.set_defaults(func=query_task)

    wait = sub.add_parser("wait")
    wait.add_argument("--task-id", required=True)
    wait.add_argument("--interval", type=int, default=10)
    wait.add_argument("--timeout", type=int, default=900)
    wait.set_defaults(func=wait_task)

    download = sub.add_parser("download")
    download.add_argument("--task-id", required=True)
    download.add_argument("--out", type=Path, required=True)
    download.set_defaults(func=download_task)
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.func(args)
    except Exception as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
