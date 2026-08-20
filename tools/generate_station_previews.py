"""Generate resumable low-resolution station-style previews.

Each output is a source-constrained visual draft for review, not a final web asset.
The script reads local image API settings at runtime and never writes credentials.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"D:\codex_sy\sucai")
OUTPUT = ROOT / "output" / "imagegen" / "station-previews-v1"
PROMPTS = ROOT / "tmp" / "imagegen" / "station-previews-v1"
STATUS = OUTPUT / "status.json"
GENERATOR = ROOT / "tools" / "generate_style_preview.py"


STATIONS = [
    {
        "id": "yj-01-couple-tree",
        "source": SOURCE / "28，27，50N 119，32，34E" / "3.jpg",
        "title": "Yangjiatang couple tree",
        "anchors": "the two entwined ancient camphor trunks, roots, cool gray stone steps, and moss",
        "material": "tree-bark rubbing, woodcut contour, and sparse stone-grain halftone",
        "accent": "deep camphor green derived only from the canopy and moss",
        "composition": "Place the paired trunks and root junction as the central subject, with the photographic anchor near center-left and bark/stone abstraction expanding outward in both directions.",
    },
    {
        "id": "yj-02-door-tile-wall",
        "source": SOURCE / "28，27，46N  119，32，35E" / "5.jpg",
        "title": "Yangjiatang door and tile wall",
        "anchors": "the wall opening filled with stacked gray roof tiles and the earth-yellow wall plane",
        "material": "tile-rhythm woodcut and dry earth pigment, with repeated tiles merged into one quiet band",
        "accent": "warm yellow-brown derived only from the earthen wall",
        "composition": "Place the tile-filled wall opening toward the left third, with the photographic tile close-up embedded there and tile rhythm expanding horizontally into the paper field.",
    },
    {
        "id": "sz-01-peach-stream",
        "source": SOURCE / "28，27，5N 119，34，11E" / "9.jpg",
        "title": "Songzhuang peach stream",
        "anchors": "the shallow creek, stones that divide the water, the stone bridge, and the few peaches caught among the stones",
        "material": "water-ripple halftone, damp stone rubbing, and one soft fruit-pulp print texture",
        "accent": "peach orange-red derived only from the peaches, attached to the stone-water relationship",
        "composition": "Use a low, near-water viewpoint derived from the source. Enlarge the few real peaches caught among the stones into the clear middle-foreground subject while preserving their count and relationship to the water. Let the water surface and dividing stones flow outward from them. Do not add or depict any bridge in this version.",
    },
    {
        "id": "sz-02-sutuhu-worktable",
        "source": SOURCE / "28，27，8N 119，34，13E" / "3.jpg",
        "title": "Sutuhu worktable",
        "anchors": "the warm earthen wall, worn wooden worktable, and grouped clay vessels and tools",
        "material": "coarse halftone, clay slip marks, kiln-speckle, and horizontal woodgrain",
        "accent": "kiln orange derived only from warm wall light and ceramic glaze",
        "composition": "Place the worktable and closest clay cluster across the middle of the frame, not in a corner. Let woodgrain and clay-slip marks expand from the table edge into surrounding paper.",
    },
    {
        "id": "sz-03-craft-witness",
        "source": SOURCE / "28，27，8N 119，34，13E" / "11.jpg",
        "title": "Songzhuang craft witness",
        "anchors": "the small wooden turtle with a roof-tile shell, its low stance, and the material join between wood and tile",
        "material": "tile-rubbing, woodcut grain, and a small charcoal specimen contour",
        "accent": "weathered gray from the actual roof tile, used only within the shell silhouette",
        "composition": "Place the wooden turtle slightly left of center as a specimen-like subject. Let the curved tile shell texture expand into a restrained horizontal rub, with no corner anchoring.",
    },
    {
        "id": "bq-01-beehive",
        "source": SOURCE / "28，27，14N 119，39，21E" / "13.jpg",
        "title": "Banqiao tree beehive",
        "anchors": "the old tree, the wooden beehive around it, and its irregular stone base",
        "material": "dark timber rubbing, stone-block halftone, and rammed-earth grain",
        "accent": "rammed-earth yellow derived only from the local wall and stone-base atmosphere",
        "composition": "Place the tree trunk and attached wooden hive in the central vertical axis, with the stone base spreading across the lower field. The hive must remain clearly identifiable.",
    },
    {
        "id": "bq-02-lan-teacher-weaving",
        "source": SOURCE / "28，27，14N 119，39，21E" / "17.jpg",
        "title": "Lan teacher weaving",
        "anchors": "the teacher's hands, the narrow woven band, and the wooden tool in the weaving action",
        "material": "woven-thread rhythm, hand-pressed ink texture, and restrained woodcut marks",
        "accent": "blue from the actual woven band, extended only along the direction of the weaving action",
        "composition": "Place the hands and weaving action centrally in a close horizontal crop. Let the blue band continue from the real textile into thread-like printed lines that fade into blank paper.",
    },
    {
        "id": "bq-03-bridge-house",
        "source": SOURCE / "28，27，14N 119，39，21E" / "9.jpg",
        "title": "Banqiao bridge and house",
        "anchors": "the local bridge structure, aged dark-gray roof tile, old timber, and the earth-yellow wall with stone base",
        "material": "architectural contour, timber rubbing, dry earth pigment, and stone-block halftone",
        "accent": "a muted blue-gray line derived only from the bridge direction and roof shadows",
        "composition": "Use an eye-level, slightly low architectural view. Place the bridge/house relationship across the center, retaining only the source-faithful roof, timber and stone-base directions.",
    },
    {
        "id": "sz-02-sutuhu-owner",
        "source": SOURCE / "28，27，8N 119，34，13E" / "8.jpg",
        "title": "Sutuhu shop owner portrait",
        "anchors": "the authorized shop owner's short hair, quiet seated posture, pale sleeveless clothing, and courtyard tree backdrop",
        "material": "soft dry-ink portrait contour, warm earthen wall grain, and sparse leaf-shadow halftone",
        "accent": "warm clay orange derived only from the earthen setting and clothing light",
        "composition": "Keep the owner as the clear central-left human subject in a three-quarter seated view. Preserve the photo-supported pose and silhouette, but stylize the face into a restrained non-photoreal editorial redraw; let the tree and wall texture diffuse from the figure rather than adding scenery.",
    },
    {
        "id": "bq-02-lan-teacher-portrait",
        "source": SOURCE / "28，27，14N 119，39，21E" / "18.jpg",
        "title": "Lan teacher portrait",
        "anchors": "the authorized teacher's face, tied-back hair, red traditional top, colorful collar band, and attentive expression",
        "material": "quiet woodcut portrait contour, woven-collar pattern marks, and deep red cloth ink",
        "accent": "blue-green derived only from the woven collar band",
        "composition": "Keep the teacher's head and shoulders as the clear central subject, with a little breathing room toward her gaze. Preserve the photo-supported expression and clothing silhouette; use a stylized editorial redraw, not a direct photographic face or invented costume.",
    },
]


def load_image_env() -> None:
    env_file = ROOT / ".env.image.local"
    for line in env_file.read_text(encoding="utf-8").splitlines():
        if "=" not in line or line.lstrip().startswith("#"):
            continue
        key, value = line.split("=", 1)
        os.environ[key.strip()] = value.strip()


def prompt_for(station: dict) -> str:
    return f"""Use case: stylized-concept. Asset type: low-resolution source-faithful editorial zine preview for {station['title']}.
Use the supplied photograph as a factual reference. Preserve only {station['anchors']}. This visual is a quiet reading entrance, not a full location reconstruction.
Create a high-abstraction Gathered Scenes Zine style image. Keep the primary subject as a truthful photographic anchor at approximately 20 percent of the image, exactly where the composition calls for it. Do not default to the lower-right corner. The remaining 80 percent is not decorative emptiness: it must visibly carry the source-derived material and narrative transition described by the composition. Let the abstraction grow from the subject's actual contour, texture, shadow or direction and merge back into the photo with an irregular mask-like torn edge. {station['composition']}
Primary material language: {station['material']}. These textures must be constrained to the corresponding source forms. They must never become detached, meaningless irregular color blocks, generic collage scraps, or decoration.
Use one structural accent only: {station['accent']}. It must follow or cross a real source contour, pass through the torn photo-paper seam, and guide the eye toward the factual anchor.
Flat scanned zine, warm cream paper only as a support material, visible hand-torn fibrous photo-paper handoff, restrained neutral ink, 1024 square low-resolution draft. No text, no UI.
Avoid invented people, buildings, plants, objects, folklore, labels, watermark, pseudo-text, dense detail, glossy CGI, anime, generic travel poster, random circles, detached corner patches, meaningless irregular color blocks, sticker borders, paper shadows, and any element from another station."""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", action="append", help="Generate only a station id; repeatable.")
    parser.add_argument("--landscape", action="store_true", help="Generate 3:2 landscape lead images in v2 output folder.")
    parser.add_argument("--subject-led", action="store_true", help="Generate subject-led v3 landscape previews.")
    args = parser.parse_args()
    folder = "station-previews-v3-subject-led" if args.subject_led else ("station-previews-v2-landscape" if args.landscape else "station-previews-v1")
    output_root = ROOT / "output" / "imagegen" / folder
    prompt_root = ROOT / "tmp" / "imagegen" / folder
    status_file = output_root / "status.json"
    load_image_env()
    output_root.mkdir(parents=True, exist_ok=True)
    prompt_root.mkdir(parents=True, exist_ok=True)
    statuses = json.loads(status_file.read_text(encoding="utf-8")) if status_file.exists() else {}
    selected = [item for item in STATIONS if not args.only or item["id"] in args.only]

    for item in selected:
        output = output_root / f"{item['id']}.png"
        prompt_file = prompt_root / f"{item['id']}.txt"
        prompt = prompt_for(item)
        if args.landscape or args.subject_led:
            prompt = prompt.replace("vertical 3:5", "horizontal 3:2")
            prompt = prompt.replace("Vertical 3:5", "Horizontal 3:2")
            prompt += "\nComposition is designed for a wide webpage lead panel: preserve a left-to-right eye path and do not crop the source relationship into a portrait poster."
        prompt_file.write_text(prompt, encoding="utf-8")
        if output.exists() and output.stat().st_size > 0:
            statuses[item["id"]] = {"state": "done", "source": str(item["source"]), "output": str(output)}
            status_file.write_text(json.dumps(statuses, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"SKIP {item['id']}: output exists", flush=True)
            continue

        print(f"START {item['id']}", flush=True)
        command = [
            sys.executable,
            str(GENERATOR),
            "--prompt-file",
            str(prompt_file),
            "--input",
            str(item["source"]),
            "--out",
            str(output),
            "--model",
            os.environ.get("IMAGE_MODEL", "gpt-image-2"),
            "--size",
            "1536x1024" if (args.landscape or args.subject_led) else "1024x1024",
            "--quality",
            "low",
        ]
        result = subprocess.run(command, check=False)
        statuses[item["id"]] = {
            "state": "done" if result.returncode == 0 and output.exists() else "failed",
            "source": str(item["source"]),
            "output": str(output),
            "returncode": result.returncode,
        }
        status_file.write_text(json.dumps(statuses, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"END {item['id']} ({statuses[item['id']]['state']})", flush=True)


if __name__ == "__main__":
    main()
