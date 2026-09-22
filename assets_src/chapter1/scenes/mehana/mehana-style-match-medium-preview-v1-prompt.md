# Mehana Medium Cartoon Style Match V1

## Status

Approved by the user for runtime integration on 2026-09-03.

The previous `1280x720` runtime background is preserved as:

```text
assets_src/chapter1/scenes/mehana/mehana-background-runtime-v3-before-cartoon.png
```

## Generation Method

Built-in image editing, using:

- edit target and geometry authority: `assets/chapter1/scenes/mehana/background.png` (pre-cartoon V3)
- primary interior style reference: `assets/chapter1/scenes/apartment/background.png`
- secondary environment style reference: `assets/chapter1/scenes/village_square/background.png`
- character style reference: `assets_src/characters/bai-mitko-model-sheet-v1.png`

## Prompt

Restyle the existing empty Mehana so it belongs in the same illustrated cartoon world as the
apartment, village square, and Bai Mitko, using a medium rather than extreme amount of environmental
caricature. Preserve the 16:9 camera, room layout, walkable floor, left door, windows, bar footprint,
right sideboard, cellar hatch, radio, cash register, bottle shelves, gameplay staging space, and
major perspective anchors. Use strong readable ink contours, simplified grouped textures, slightly
warped hand-drawn architecture, controlled expressive shapes, and warm shabby Bulgarian Mehana
colors. Gently bow room and bar lines, clarify the radio/register/hatch silhouettes, subtly mismatch
door and window proportions, and reduce repetitive microtexture. Preserve the existing Bulgarian
wall sign footprint. Add no characters, tables, chairs, UI, logos, labels, or watermark; avoid pixel
art, anime, photorealism, extreme fisheye, and extreme spatial distortion.

## Runtime Preparation

The generated `1672x941` source is preserved as:

```text
assets_src/chapter1/scenes/mehana/mehana-style-match-medium-preview-v1.png
```

It is resized to the required `1280x720` runtime canvas at:

```text
assets/chapter1/scenes/mehana/background.png
```

Existing scene geometry and independently composited gameplay layers are unchanged.
