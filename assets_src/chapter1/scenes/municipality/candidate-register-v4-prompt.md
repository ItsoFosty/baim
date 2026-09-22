# Candidate Register V4

Generated with the built-in image-generation editor. Inputs:

- V3 cabinet as the edit target;
- V2 candidate-register lectern as the open-ledger shape and color reference;
- municipality background V9 as the perspective and placement reference.

## Final prompt

```text
Use case: precise-object-edit
Asset type: revised transparent movable 2D adventure-game prop

Turn the complete cabinet around its vertical axis so it faces in exactly the opposite horizontal
direction. The left side plane must be visibly exposed while the right side plane is mostly hidden.
This is a true perspective/yaw change, not a canvas tilt; keep all verticals upright and the base level.

Replace the closed blue-green book on the writing surface with one open candidates-register ledger.
Match the original lectern ledger's warm aged cream pages, thick worn page block, subtle faded red
ruled lines, and muted reddish-brown spine/ribbon. No readable writing.

Preserve the same narrow cabinet, upper stationery shelf, writing surface and pen holder, exactly two
lower shelves, typewriter, fire extinguisher, proportions, lighting, painted style, and wear. Complete
isolated object, transparent background, minimal padding; no room, cast shadow, drawers, doors,
ornament, extra objects, text, watermark, or checkerboard.
```

The generated exterior checkerboard was removed deterministically and the result normalized to the
existing `366x720` runtime asset contract.

Runtime asset: `assets/chapter1/scenes/municipality/candidate-register-v4.png`.
