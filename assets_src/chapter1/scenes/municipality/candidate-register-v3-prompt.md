# Candidate Register V3

Generated with the built-in image-generation tool from:

- `assets/s-l960.jpg` as the furniture construction and viewing-angle reference;
- `assets/chapter1/scenes/municipality/background-v9.png` as the approved style, lighting,
  perspective, and placement reference.

The first pass established the plain open-shelf writing cabinet. A targeted second pass narrowed its
silhouette to fit the existing candidates-register footprint between the two windows while preserving
the requested contents and right-receding three-quarter perspective.

## Final prompt

```text
Use case: precise-object-edit
Asset type: transparent movable 2D adventure-game prop
Input images: Image 1 is the edit target and establishes the approved cabinet design/content; Image 2
is perspective and placement context only.

Primary request: Make the entire cabinet substantially narrower and more compact so its complete
visible silhouette has approximately a 1:2 width-to-height ratio and can fit cleanly in the narrow wall
bay between the two windows. Compress/redesign the woodwork naturally. Make the old typewriter
correspondingly smaller and narrower so it fits comfortably.

Preserve exactly: one shallow open stationery/forms shelf above; one flat writing surface with one
register book and one shabby pen holder; exactly two open shelves below, with the old manual
typewriter in the upper lower-shelf and the red fire extinguisher in the bottom shelf; plain worn
municipal wood; upright cabinet; same three-quarter perspective receding gently toward screen-right;
complete object from top to base; strong readability at about 162 px tall.

Constraints: genuine transparent background; minimal transparent padding; no wall, floor, room, cast
shadow, people, labels, readable text, drawers, doors, ornate decoration, extra shelves, extra
furniture, watermark, or border.
```

The generator returned a baked pale checkerboard RGB background. As with the earlier municipality
props, the connected exterior checkerboard was removed deterministically, the result was normalized
to the existing `366x720` candidate-register asset contract, and the generated design pixels were
otherwise retained.

Runtime asset: `assets/chapter1/scenes/municipality/candidate-register-v3.png`.
