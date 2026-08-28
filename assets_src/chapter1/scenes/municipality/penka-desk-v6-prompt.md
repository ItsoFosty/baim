# Penka Desk V6 — Lower Far Side

Edited from the approved Penka desk V5 with the built-in image-generation editor.

The only requested structural change was to lower the desk's far/upper/counter-side end—the end
behind the CRT—by approximately 22%, within the requested 20–25% range. The near/lower/viewer-side
end remains dominant, and the desk keeps its established long-axis orientation, contents order,
painted wood treatment, lighting, and 1990s cartoon-adventure rendering.

Final edit prompt:

> Use case: precise-object-edit. Asset type: transparent runtime prop for a high-resolution 2D
> point-and-click adventure. The provided Penka desk V5 is the edit target and authoritative
> reference. Lower only the desk's far/upper/counter-side end by about 22%. The far side is the end
> behind and beneath the CRT monitor, farthest from the viewer. Reduce that far-end vertical
> elevation so the tabletop has a slightly less steep rise toward the back while keeping the same
> long-axis orientation and convincing perspective. Keep the near/lower/viewer-side end at exactly
> its current height and size. Preserve the approved desk design, footprint, camera angle, broad near
> short end, wood material and painted linework, front panel and legs, CRT computer, keyboard,
> stationery, stapler, document stack, object order, lighting, palette, and surface detail. Change
> only the far-side height; everything else must remain visually identical.

The editor returned a baked checkerboard RGB background. It was removed deterministically, the
largest connected prop silhouette was retained, and the runtime cutout was cropped with eight pixels
of transparent padding.

Runtime asset: `assets/chapter1/scenes/municipality/penka-desk-v6.png`.
