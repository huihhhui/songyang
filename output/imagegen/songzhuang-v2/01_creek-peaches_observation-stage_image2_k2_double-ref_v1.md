# Songzhuang K2 Double-Reference Test

## Purpose

Verify a two-image style-transfer workflow before treating any image as a final web visual.

## Model and output

- Model: `gpt-image-2`
- Mode: edit / style-transfer
- Output: `01_creek-peaches_observation-stage_image2_k2_double-ref_v1.png`

## Actual image inputs

1. `01_creek-peaches_observation-stage_image2_v3_left.png`
   - Role: composition and factual-element reference.
   - Locked: camera, two water channels, central stone splitter, three peaches, left stone steps, cropped roof and wall.
2. `00_k2-style-control_image2_v1.png`
   - Role: visual-language reference.
   - Requested transfer: low-saturation palette, matte weathered materials, soft filtered daylight, hand-painted surface variation, simplified 3D forms.

## Assessment

The command was issued with two `--image` arguments and the API reported `edit with 2 image(s)`. The factual layout remains reliable, but the output is still too photographic. It is a workflow proof, not an approved final art-direction keyframe. The next style-control image must itself show stronger sculpted forms, broader painted values, and visible non-photographic brush texture before it is reused as Image 2.
