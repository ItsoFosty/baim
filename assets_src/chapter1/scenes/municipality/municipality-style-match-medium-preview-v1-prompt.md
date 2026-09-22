# Municipality Style-Match Medium Preview V1

Generated with the built-in image-generation tool on 2026-09-04.

## Inputs

- Edit target and geometry authority: `assets/chapter1/scenes/municipality/background-v9.png`
- Primary style reference: `assets/chapter1/scenes/apartment/background.png`
- Secondary style reference: `assets/chapter1/scenes/mehana/background.png`

## Prompt

```text
Use case: style-transfer
Asset type: high-resolution 2D point-and-click adventure runtime background, exact 16:9 composition
Input images: Image 1 is the municipality edit target and strict layout/geometry authority; Image 2 is the approved apartment style reference; Image 3 is the recently adjusted mehana style reference.
Primary request: Slightly restyle only Image 1 so it belongs to the same game as Images 2 and 3. Move its rendering toward their warm, hand-painted 1990s cartoon-adventure look: a little more elastic and illustrative, stronger confident ink-like contour accents, simplified painterly texture, warmer ochre/brown harmony, and clearer gameplay readability. This is a restrained style correction, not a redesign.
Composition/framing: Preserve Image 1 pixel-for-pixel in overall camera angle, room proportions, floor perspective, door/window positions, five service-counter bays, archive alcove/cabinet area, bulletin board, wall fixtures, and all empty playable floor space. Preserve the locations and silhouettes required by existing walk masks, hotspots, and independent foreground/character layers.
Lighting/mood: warm provincial municipal office daylight; bureaucratically tired but playful; slightly flatter and more graphic than Image 1, compatible with the apartment.
Constraints: keep the canvas at 1536x864 landscape; no crop; no new characters or props; do not add/remove/reposition service counters, doors, windows, cabinets, lights, plants, signage, bulletin board, radiator, or floor boundaries; retain broad tonal separation behind independently overlaid NPCs and props; no logos or watermark. Any tiny existing sign text may remain painterly/unreadable rather than being rewritten.
Avoid: photorealism, grim realism, muddy over-rendering, anime, cyberpunk, flat corporate vector art, generic mobile-casual art, major geometry drift, perspective drift, extra clutter, legible new text.
```

The generated source was `1672x941`; the runtime derivative is proportionally resampled to the project's `1280x720` scene resolution.

## Reversal

Restore the municipality `background` entry in `src/content/art/assetManifest.js` to
`assets/chapter1/scenes/municipality/background-v9.png` and rebuild runtime assets.
