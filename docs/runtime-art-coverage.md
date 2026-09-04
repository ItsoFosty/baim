# Runtime Art Coverage

## Current Diagnosis

- Apartment background: integrated as first real default-start background.
- Village square background: integrated, technical proof works.
- Village square art direction: usable for layout/runtime proof, but still too realistic and text-heavy for final style.
- Mehana interaction scene: approved medium-cartoon character-readability V2 background, two independently positioned matching
  bentwood-chair table layers, seated Tony, the standing waiter, a separate newspaper, and separate
  sideboard-mounted oil/water gameplay props are integrated. The radio is intentionally baked into
  the background but has authored interaction geometry.
- Municipality: its complete Chapter 1 interactions are integrated with the approved style-match
  medium V1 painted background, independently positioned archive/register props, Penka's
  chair/character/desk stack, and the
  security officer/table stack. This closes the municipality background and technical-integration
  milestones; later work is limited to scene polish and additional animation.
- Election booth: its complete Chapter 1 interaction is functional as a geometry graybox and still
  needs a painted background and foreground treatment.
- Journalist: complete bilingual interview and square interaction are functional with an intentional
  labelled debug silhouette pending final character art and animation.
- Bai Mitko model sheet: locked identity source.
- Baba Stoyanka: seated painted cutout integrated at the village-square bus stop; the layer is
  calibrated to `122px`, approximately 20% smaller than Bai Mitko's calculated height at the bench
  depth, and its dialogue hotspot is aligned with the visible character.
- Bai Mitko runtime animation: the active Ludo.ai sprite-sheet path provides east walk
  start/loop/short/stop, six idle variants, three talk variants, rejection, and take. West mirrors
  east. North/south walk and additional look/use/puzzle actions remain deferred.
- Inventory icons: icons integrated for accordion, unpaid bills, empty envelope, sunflower oil, and
  water. The remaining items, including rakia and Shopska salad, use the text fallback.
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
- `assets/chapter1/scenes/mehana/background.png` (medium-cartoon character-readability V2)
- `assets/chapter1/scenes/mehana/table-group-left-v2.png`
- `assets/chapter1/scenes/mehana/table-group-right-v2.png`
- `assets/chapter1/scenes/mehana/kaliakra-oil-v1.png`
- `assets/chapter1/scenes/mehana/water-jug-v1.png`
- `assets/chapter1/scenes/mehana/newspaper-v3.png`
- `assets/chapter1/characters/tony_fridge/seated-v1.png`
- `assets/chapter1/characters/mehana_waiter/idle-v1.png`
- `assets/chapter1/scenes/municipality/background-style-match-medium-v1.png`
- `assets/chapter1/scenes/municipality/archive-cabinet-v6.png`
- `assets/chapter1/scenes/municipality/candidate-register-v4.png`
- `assets/chapter1/scenes/municipality/penka-chair-v1.png`
- `assets/chapter1/scenes/municipality/penka-seated-bordeaux-polka-v2.png`
- `assets/chapter1/scenes/municipality/penka-desk-v10.png`
- `assets/chapter1/scenes/municipality/policeman-security-guard-v2.png`
- `assets/chapter1/scenes/municipality/security-table-v6.png`
- `target/external_animation_v1/runtime/walk_east_start.png`
- `target/external_animation_v1/runtime/walk_east_loop.png`
- `target/external_animation_v1/runtime/walk_east_stop.png`
- `assets/chapter1/items/accordion.png`
- `assets/chapter1/items/unpaid_bills.png`
- `assets/chapter1/items/empty_envelope.png`
- `assets/chapter1/characters/baba_stoyanka/seated-v1.png`

## Remaining Placeholders

- Bai Mitko look/use and additional puzzle-specific animations
- Mehana character animation beyond the current static Tony/waiter presentation
- Election booth background
- Journalist final character art and animation
- UI skin
- Remaining inventory item icons
