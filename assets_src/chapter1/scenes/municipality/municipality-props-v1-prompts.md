# Municipality Props V1 Prompts

Generated with the built-in image-generation tool. The municipality runtime background was used as
a style, palette, perspective, and lighting reference. The generator returned baked checkerboard RGB
images in both the initial generation and the targeted transparency pass, so the accepted designs were
cleaned to real alpha deterministically after generation.

## Archive Cabinet

```text
Use case: stylized-concept
Scene ID: scene.chapter1.municipality
Asset type: independent high-resolution transparent raster prop for a 2D point-and-click adventure scene
Input image: Image 1 is a style, palette, perspective, linework, material, and lighting reference only. Generate a new standalone object; do not reproduce the room.

Primary request: a tall old Bulgarian municipal archive filing cabinet, a single self-contained movable prop. Slightly swollen rectangular silhouette, heavy olive-grey painted metal, approximately six wide document drawers stacked vertically, old brass-colored label holders, mismatched handles, one drawer sitting a few centimeters ajar, edges subtly bent by decades of overfilled folders. It was retained after a pretentious renovation because nobody could prove which department owned it. A tiny faded inventory sticker and a few blank aged paper labels, but no readable words. Characterful and amusing through shape, not cluttered.

Composition/framing: show the complete cabinet from top to feet in a fixed 3/4 front view compatible with the municipality background perspective. Upright portrait-oriented object, centered with generous transparent padding on every side. Strong clean silhouette and readable drawer divisions at game scale. No wall, floor, room, baseboard, extra furniture, people, documents pile, or separate objects. No baked floor or cast shadow; the object must be freely positionable and scalable.

Style/medium: exactly the same fresh hand-painted high-resolution 2D cartoon-adventure rendering family as Image 1: bold dark ink-like outlines, painterly texture, slightly warped geometry, playful asymmetry, clean value grouping, premium 1990s adventure spirit without copying a specific game.
Lighting/color: match the room’s soft daylight from upper left plus warm fluorescent fill; dusty olive grey, socialist grey, dirty beige and tiny faded red accents; bright enough to read, never muddy.
Transparency: genuinely transparent background with a clean alpha edge; preserve small protruding handles cleanly; no checkerboard pattern and no colored matte.
Constraints: one cabinet only; full object visible; no crop; no text; no logo; no watermark; no photorealism; no pixel art; no vector-flat style; no UI; no characters.
```

## Candidate Register

```text
Use case: stylized-concept
Scene ID: scene.chapter1.municipality
Asset type: independent high-resolution transparent raster prop for a 2D point-and-click adventure scene
Input image: Image 1 is a style, palette, perspective, linework, material, and lighting reference only. Generate a new standalone object; do not reproduce the room.

Primary request: a Bulgarian municipality candidate register presented as a single self-contained movable floor prop: a narrow waist-high wooden reading lectern/registry stand with a large thick open ledger resting securely on its slanted top. The old official ledger has cream pages, ruled columns, dog-eared corners, a faded red cloth spine, one red ribbon bookmark, and the visual authority of an absurdly important book. The cheap dark-brown lectern has worn varnish, a slightly warped pedestal, a broad stable foot, and one small brass pen chain attachment. Pages may contain faint lines and marks only; no readable words, names, seals, numbers, or signatures.

Composition/framing: show the complete lectern and open ledger from book top to floor foot in a fixed 3/4 front view compatible with the municipality background perspective. The open pages and pedestal must both read clearly at game scale. Portrait-oriented object, centered with generous transparent padding on every side. No wall, floor, room, baseboard, desk, chair, people, loose papers, or separate objects. No baked floor or cast shadow; the prop must be freely positionable and scalable.

Style/medium: exactly the same fresh hand-painted high-resolution 2D cartoon-adventure rendering family as Image 1: bold dark ink-like outlines, painterly texture, slightly warped geometry, playful asymmetry, clean value grouping, premium 1990s adventure spirit without copying a specific game.
Lighting/color: match the room’s soft daylight from upper left plus warm fluorescent fill; dark warm wood, dusty ochre, dirty cream paper, muted faded red accents; bright and readable, never muddy.
Transparency: genuinely transparent background with a clean alpha edge; preserve thin ribbon and pen-chain details cleanly; no checkerboard pattern and no colored matte.
Constraints: one combined register-and-lectern prop only; full object visible; no crop; no readable text; no logo; no watermark; no photorealism; no pixel art; no vector-flat style; no UI; no characters.
```

## Targeted Transparency Pass

For each prop, the follow-up prompt requested a `background-extraction` edit that changed only the
checkerboard background to genuine transparent alpha while preserving the complete object. Because
that retry also returned RGB, the final `*-clean-v1.png` files use deterministic connected-background
removal and retain the generated object pixels.

## Candidate Register Rotated V2

The V1 candidate register was edited as a new non-destructive V2. The edit turned the complete
lectern approximately 25 degrees counterclockwise around its vertical floor axis—without tilting the
canvas—so it could sit naturally beneath the coat of arms between the municipality windows. The edit
preserved the ledger, ribbon, chained pen, wooden pedestal, palette, lighting, and painted style.

```text
Use case: precise-object-edit
Asset type: revised transparent 2D game-prop cutout for scene.chapter1.municipality

Input images:
- Image 1 is the edit target: the approved candidate-register lectern cutout.
- Image 2 is a supporting perspective, style, lighting, and intended-placement reference only. Do not composite the room into the output.

Primary request: turn the entire candidate-register lectern approximately 25 degrees counterclockwise around its vertical floor axis, as though someone physically rotated the upright lectern to face slightly toward the left side of the municipality hall. This is a perspective/yaw rotation, not an image-plane tilt. Keep the pedestal perfectly upright and its feet resting on one level baseline. Show the newly appropriate side planes and foreshortening consistently.

Intended scene placement: the smaller prop will stand beneath the city coat of arms in the narrow bay between the two tall windows in Image 2. Adjust the 3/4 perspective so it looks natural in that back-left portion of the room, while remaining a standalone cutout.

Preserve exactly: the same recognizable worn dark-brown wooden lectern design, thick open cream ledger, red ruled columns, dog-eared pages, faded red ribbon, brass chained pen, painterly texture, bold dark outlines, colors, material wear, proportions, comic shape language, and municipality lighting family. Keep all parts attached to the same single prop.

Composition: full object visible from open book to all feet, centered on a portrait canvas with modest padding. No crop. No separate objects. No wall or floor.
Transparency: genuinely transparent background with clean alpha; no checkerboard pattern, white matte, halo, floor, or cast shadow.
Constraints: change only the viewing angle by a modest counterclockwise yaw; do not lean the lectern, rotate the canvas, close the book, change the design, remove the chain or ribbon, add text, add a logo, add characters, or add room scenery; no watermark.
```
