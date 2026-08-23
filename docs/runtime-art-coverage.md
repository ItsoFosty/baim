# Runtime Art Coverage

## Current Diagnosis

- Apartment background: integrated as first real default-start background.
- Village square background: integrated, technical proof works.
- Village square art direction: usable for layout/runtime proof, but still too realistic and text-heavy for final style.
- Mehana interaction scene: functional seated-table prototype with waiter ordering and Tony dialogue;
  it still uses intentional debug fallback art.
- Municipality and election booth: their complete Chapter 1 interactions are functional as geometry
  grayboxes; both still need final painted backgrounds and foreground treatment.
- Journalist: complete bilingual interview and square interaction are functional with an intentional
  labelled debug silhouette pending final character art and animation.
- Bai Mitko model sheet: locked identity source.
- Baba Stoyanka: seated painted cutout integrated at the village-square bus stop; the layer is
  calibrated to `122px`, approximately 20% smaller than Bai Mitko's calculated height at the bench
  depth, and its dialogue hotspot is aligned with the visible character.
- Bai Mitko runtime animation: current source-art direction is model-sheet-preserving east walk
  only, with west mirrored from east. North/south walk, talk/look/use/take remain placeholders or
  deferred.
- Inventory icons: icons integrated for accordion, unpaid bills, and empty envelope. Ordered rakia
  and Shopska salad currently use the text fallback.
- Apartment interaction geometry now includes the visible lower-left rakia bottle and treats the
  existing right-hand green sofa as a temporary sofa-bed recovery hotspot. Dedicated bed art is
  still pending approval.
- UI skin: prototype.
- Debug geometry: should remain hidden unless `Shift+G` or `?debugGeometry=1` is enabled.

## Direction Lock

The next runtime art should move closer to the approved Bai Mitko model sheet:

- fresh 1990s cartoon adventure feel
- bold ink outlines
- warped cartoon shapes
- readable gameplay silhouettes
- less realistic rendering
- less baked-in readable text

The current village square stays as a runtime proof and layout reference, not final locked art direction.

## Current Integrated Runtime Assets

- `assets/chapter1/scenes/apartment/background.png`
- `assets/chapter1/scenes/village_square/background.png`
- `target/external_animation_v1/runtime/walk_east_start.png`
- `target/external_animation_v1/runtime/walk_east_loop.png`
- `target/external_animation_v1/runtime/walk_east_stop.png`
- `assets/chapter1/items/accordion.png`
- `assets/chapter1/items/unpaid_bills.png`
- `assets/chapter1/items/empty_envelope.png`
- `assets/chapter1/characters/baba_stoyanka/seated-v1.png`

## Remaining Placeholders

- Bai Mitko talk/look/use/take animations
- Mehana background
- Municipality background
- Election booth background
- Journalist final character art and animation
- UI skin
- Remaining inventory item icons
