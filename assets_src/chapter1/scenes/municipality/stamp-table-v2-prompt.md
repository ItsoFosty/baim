Built-in imagegen edit, 16 September 2026. Reference: stamp-table-v1.png. Runtime width reduced from 166 to 141.1 (15%).

Use case: precise-object-edit. Edit the attached table cutout. Rotate the physical table 45 degrees COUNTERCLOCKWISE about its upright vertical axis as viewed from above, keeping the camera and lighting fixed. The result should show the LEFT side of the table and the drawer front receding toward the RIGHT, with the nearest front-left corner toward the viewer. Do not rotate/tilt the flat image plane: all legs stay vertical and feet stand on the same horizontal floor. Preserve the exact furniture identity: polished worn honey oak, beveled top, single shallow drawer with brass cup pull, four tapered legs and low stretchers, hand-painted dark-outlined style, ink pad and two cream forms resting in their same positions on the table as it turns. No new objects, no stamp, no text, no room. True transparent RGBA background. Complete table with uncropped feet and clean margin, same material colors and warm upper-left light. Only change the viewing orientation of this same table. Runtime size will be reduced separately.


Cleanup: the first edit baked in checkerboard pixels. A built-in extraction edit
also retained them, so the final edit requested a uniform #00ff00 background in
all openings while preserving the table. The project's existing
chromaKeyGreenToAlpha utility produced the transparent runtime PNG.
Final source: stamp-table-v2-chroma.png. Earlier v1 remains preserved.
