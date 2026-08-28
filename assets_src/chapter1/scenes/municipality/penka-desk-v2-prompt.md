# Penka Desk V2 Perspective Correction

Generated with the built-in image-generation editor. V1 was the edit target; municipality background
V9 was the exact perspective and right-wall placement reference.

## Correction prompt

```text
Use case: precise-object-edit
Change only the desk's horizontal perspective/yaw so it aligns strongly with the right wall and
announcement-board wall. The left end must recede clearly toward upper-left while the right end
advances toward lower-right. Long tabletop and base edges slope downward toward screen-right,
approximately parallel to the wall's floor/baseboard recession. Show a larger right side plane and a
more foreshortened front panel. This is true 3D yaw, not image-plane rotation; vertical posts remain
upright and the feet share a valid floor plane.

Preserve the exact desk design and all contents: left document stack, clear middle workspace, sparse
utensils, right-side CRT computer, flower snapshot overlapping the monitor's upper-right corner, and
colored sticky notes along the bottom bezel. Keep the monitor face visible. Complete isolated cutout,
true transparency; no room, floor, person, chair, text, logo, watermark, or new objects.
```

The generated exterior checkerboard was removed deterministically to produce true alpha.

Runtime asset: `assets/chapter1/scenes/municipality/penka-desk-v2.png`.
