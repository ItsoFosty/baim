# Municipality Background — Localized Bake V4

Created with the built-in image-generation editor and deterministic compositing.

## Preservation method

The approved original `background.png` remains the pixel-exact base. The image editor was used only on a 400×400 crop surrounding the first counter. A narrow portion of that result was composited over the first-counter footprint. No generated pixels were allowed to alter the rest of the room.

The previously approved `archive-cabinet-v6.png` was then baked at its exact runtime placement with a restrained integration shadow. Its standalone scene layer remains disabled; its stable hotspot remains actionable.

## First-counter replacement brief

Remove the complete leftmost service-counter bay: upper glass, CLOSED sign, wooden booth frame, ledge, equipment, and lower counter base. Restore aged plaster wall in the upper quarter of the vacated footprint.

In the lower three-quarters, create a narrow cabinet flush inside the wall, based on `assets/s-l500.jpg`. It uses aged wooden horizontal tambour slats and two stacked compartments:

- upper shutter rolls upward and remains halfway open;
- lower shutter rolls downward and remains more than halfway open;
- worn municipal files and thick law books are visible through both openings.

The cabinet has no feet, projecting sides, top surface, or freestanding furniture silhouette.

## Runtime integration

- Background: `assets/chapter1/scenes/municipality/background-v4.png`
- Standalone archive layer: disabled
- Stable archive hotspot: `hotspot.municipality.archive_cabinet`
- Archive bounds: x `1120–1253`, y `185–499`
