# Mehana V3 generation notes

Generated with the built-in image generation workflow on 2026-08-24.

## Background edit

- Edit target: `assets/chapter1/scenes/mehana/background.png` (V2)
- Door reference: `assets/Mehanaentrance.png`
- Radio reference: `assets/radio.png`
- Mode: `precise-object-edit`
- Requested changes: divided-glass entrance matching the exterior design; matching curtainless wooden windows; bentwood coat rack with a coat and hats; simple right-wall sideboard with glasses, plates, cutlery, menus, and folded checked tablecloths; period radio on the upper shelf; cellar hatch shifted left.
- Invariants: preserve the bar, brass rail, cash register, bottle shelves, fictional portrait, Bulgarian slogan, lighting, palette, perspective, and empty floor needed by runtime layers. Do not bake in people, tables, oil, water, or newspaper.

The 1672×941 source was resized to the runtime contract of 1280×720 and saved as `mehana-background-runtime-v3.png` before replacing the approved runtime background.

## Newspaper prop

- Style reference: `assets/chapter1/scenes/mehana/table-group-left-v2.png`
- Mode: `background-extraction`, followed by a chroma-safe regeneration because the first alpha request returned an opaque backdrop.
- Exact readable text: `ДНЕС`
- All other print is deliberately non-topical and indistinct, avoiding real people and current political claims.
- The chroma source was keyed, trimmed, and resized into `assets/chapter1/scenes/mehana/newspaper-v1.png`.
