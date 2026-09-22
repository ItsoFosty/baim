# Penka Desk V10 — Lower Counter-Side Corners

V10 starts from the restored long Penka desk V5 silhouette. It corrects only the distant,
computer-side height established by the approved full-scene reference.

The complete far section through source row 250 is shifted down 180 source pixels. That displacement
tapers smoothly to zero at source row 735, the near tabletop edge. At the active runtime size this
lowers the two distant tabletop corners by about 67 browser pixels, placing them slightly below the
midpoint of the municipality counter fronts. The near tabletop edge, apron, large recessed panel,
legs, feet, canvas, alpha, and runtime registration remain fixed.

The transformation is reproducible with `node tools/build-penka-desk-v10.mjs`.

Runtime asset: `assets/chapter1/scenes/municipality/penka-desk-v10.png`.
