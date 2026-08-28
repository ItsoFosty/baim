# Municipality Archive Corner V2 Prompts

Generated with the built-in image-generation tool. Both edits are non-destructive V2 sources.

## Remove The Sixth Counter

```text
Use case: precise-object-edit
Asset type: revised high-resolution production-source background for scene.chapter1.municipality
Input image: Image 1 is the edit target.

Primary request: remove only the sixth and last public-service counter bay when counting from the left—the rightmost closed counter nearest the room’s far-right corner and announcement board. Remove that entire rightmost service-window bay, its hanging “ЗАТВОРЕНО” sign, glass partition, countertop section, and lower counter-front panel.

Reconstruct the cleared area as a believable empty far-right corner of the same renovated old municipality room: continue the existing dirty-beige cracked plaster wall, modest molding and baseboard into the exposed bay; continue the cheap laminate floor and its perspective into the corner; give the remaining five-counter line a finished vertical end panel. Leave enough plain floor-and-wall space for a separate tall archive cabinet layer to stand in that corner. Do not add the cabinet itself.

Preserve exactly: the full original 16:9 framing and camera; glass entrance; both tall windows; coat of arms; plant; radiator; picture; ceiling and fluorescent fixtures; air conditioner; all cracks and worn laminate; the first five counter bays; every remaining sign; the open counter; the seated woman polishing her nails; the standing man behind her; the far-right A4 announcement board on the adjacent wall; all lighting, colors, linework, perspective, textures, and painterly style outside the removed sixth bay.

Constraints: change only the sixth/rightmost counter bay and the immediately exposed wall/floor behind it; keep all other pixels and scene geometry as close as possible; no new furniture; no cabinet; no people added or removed; no UI; no watermark; no new text; no crop; no camera change; no change to resolution or aspect ratio.
```

## Rotate The Archive Cabinet

```text
Use case: precise-object-edit
Asset type: revised transparent archive-cabinet game prop for scene.chapter1.municipality
Input images:
- Image 1 is the edit target: the approved archive cabinet cutout.
- Image 2 is a supporting perspective, lighting, palette, and intended-placement reference only. Do not composite the room into the output.

Primary request: turn the complete archive cabinet approximately 15 degrees clockwise around its vertical floor axis, as though the upright cabinet were physically pivoted slightly clockwise to nest naturally into the far-right corner of the municipality hall. This is a perspective/yaw rotation, not an image-plane tilt. Keep the cabinet vertical and all four feet resting on one level baseline. Render the newly visible side plane and drawer foreshortening consistently for the right corner.

Preserve exactly: the same recognizable tall olive-grey metal filing cabinet; six wide drawers; mismatched brass handles and label holders; one drawer slightly open with folders inside; bent edges; faded sticker and blank paper labels; worn paint, rust, painterly texture, bold outlines, proportions, comic silhouette, palette, and municipality lighting family.

Composition: full cabinet visible from top to all feet, centered on portrait canvas with modest padding. No crop. No separate objects, floor, wall, or room.
Transparency: genuinely transparent background with clean alpha; no checkerboard pattern, white matte, halo, floor, or cast shadow.
Constraints: change only the cabinet viewing angle by a slight clockwise yaw; do not lean or tilt the cabinet, rotate the canvas, change drawer count, move the open drawer, redesign, recolor, add text, add objects, add characters, or add scenery; no watermark.
```

The generator rendered the transparency preview into RGB, so the accepted cabinet design was cleaned
to true alpha deterministically without changing the cabinet pixels.
