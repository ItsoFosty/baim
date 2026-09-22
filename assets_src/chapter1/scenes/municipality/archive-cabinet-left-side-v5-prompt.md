# Archive Cabinet Left-Side V5 Prompt

Generated with the built-in image-generation tool after the prior pass failed to change the visible
side plane. The final prompt made the intended counterclockwise yaw explicit through visible geometry.

```text
Use case: precise-object-edit
Asset type: visibly counterclockwise-rotated transparent archive cabinet for scene.chapter1.municipality

Input images:
- Image 1 is the current live edit target. It incorrectly shows a broad RIGHT side panel.
- Image 2 is an orientation reference showing the correct direction of turn: its LEFT side is visible. Use only that direction cue, not its exact amount of perspective.
- Image 3 is a supporting style, lighting, and corner-placement reference only. Do not composite the room.

Primary request: visibly rotate the cabinet counterclockwise around its vertical floor axis. The final view MUST be on the opposite side of Image 1:
- completely hide the broad RIGHT side panel visible in Image 1;
- reveal a NARROW LEFT side panel on the image's left edge;
- keep the drawer fronts dominant and almost frontal;
- show roughly 15–20 degrees of counterclockwise yaw, midway between a dead-front view and Image 2’s stronger left-side view.
This must be an obvious change in 3D orientation, not a resize and not an image-plane rotation.

Keep the cabinet upright, unchanged in overall height and scale, with all feet on one horizontal baseline. Recalculate the top plane, left side plane, drawer foreshortening, handles, and open-drawer perspective consistently.

Required invariant: exactly SIX wide drawers from top to bottom—closed, closed, OPEN third drawer with folders, closed, closed, closed—followed by plinth and feet.

Preserve: the same olive-grey metal cabinet identity, mismatched brass handles and label holders, faded sticker, blank labels, bent edges, worn paint, rust, painterly texture, bold outlines, palette, and lighting. Keep the open drawer in position three only.

Composition: full cabinet visible, centered on portrait canvas with modest padding. No crop, wall, floor, room, shadow, or separate object.
Transparency: genuine transparent alpha; no white background, checkerboard pattern, matte, or halo.
Constraints: the RIGHT side must not be visible; a narrow LEFT side must be visible; do not merely enlarge or shrink; do not lean, tilt, mirror text-like marks, rotate the image canvas, change drawer count, redesign, recolor, add readable text, characters, scenery, or watermark.
```

The generator returned an RGB preview background, which was converted deterministically to true alpha
without altering the cabinet artwork.
