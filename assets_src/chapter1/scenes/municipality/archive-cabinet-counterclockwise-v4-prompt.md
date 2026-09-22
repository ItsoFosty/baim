# Archive Cabinet Counterclockwise V4 Prompt

Generated with the built-in image-generation tool from the V2 cabinet and municipality background.

```text
Use case: precise-object-edit
Asset type: corrected transparent archive-cabinet game prop for scene.chapter1.municipality

Input images:
- Image 1 is the edit target: the current V2 archive cabinet, which is turned too far clockwise.
- Image 2 is a supporting perspective, lighting, palette, and right-corner placement reference only. Do not composite the room into the output.

Primary request: from the exact current orientation shown in Image 1, physically pivot the complete cabinet approximately 20 degrees COUNTERCLOCKWISE around its vertical floor axis. This must visibly undo and pass back from the current excessive clockwise yaw. The final cabinet should be closer to frontal, with only a mild corner-compatible side plane. This is a perspective/yaw turn on the floor, not an image-plane rotation or tilt.

Keep the cabinet perfectly upright and all feet resting on one level baseline. Recalculate side planes, top plane, drawer foreshortening, and open-drawer perspective consistently for the new counterclockwise orientation.

Preserve exactly: the same tall olive-grey metal archive cabinet; six wide drawers; drawer order; mismatched brass handles and label holders; the same one drawer slightly open with folders; bent edges; faded sticker and blank paper labels; worn paint, rust, painterly texture, bold outlines, proportions, comic silhouette, palette, and municipality lighting family.

Composition: full cabinet visible from top to all feet, centered on a portrait canvas with modest padding. No crop. No separate objects, floor, wall, or room.
Transparency: genuinely transparent background with clean alpha; no checkerboard pattern, white matte, halo, floor, or cast shadow.
Constraints: change only the viewing angle by about 20 degrees counterclockwise relative to Image 1; do not lean or tilt the cabinet; do not rotate the image canvas; do not change drawer count, move the open drawer, redesign, recolor, add text, add objects, add characters, or add scenery; no watermark.
```

The first angle-corrected pass lost one drawer and was rejected. A targeted correction preserved the
accepted angle while restoring exactly six drawers, with only drawer three open. The generator output
was then cleaned from its RGB preview background to true alpha without changing the cabinet pixels.
