# 30 September runtime checkpoint

The election room now has a painted background, reused character art, table
occlusion, conditional supporters and ballot-box placement, plus a new creditor
pair. Every inventory item has an icon; diploma icons reflect stamp state. The
journalist uses standing-v2 in the square, office and polling room. Earlier debug
journalist/election-placeholder statements below are historical and superseded.
See [production status](chapter1-production-status-300926.md) for current coverage,
static finale/phone/sound changes and the remaining work. Priority 1 and all Ludo
and animation work are deferred by the user. The current pass changes placement
only; it creates no art and grants no new asset approval.

# Runtime Art Coverage

## Current Diagnosis

- Apartment background: integrated as first real default-start background.
- Village square background: integrated, technical proof works.
- Village square art direction: usable for layout/runtime proof, but still too realistic and text-heavy for final style.
- Mehana interaction scene: approved medium-cartoon character-readability V2 background, two independently positioned matching
  bentwood-chair table layers, seated Tony, the standing waiter, a separate newspaper, and separate
  sideboard-mounted oil/water gameplay props are integrated. The radio is intentionally baked into
  the background but has authored interaction geometry.
- Municipality: its complete Chapter 1 interactions use the painted Mayor-door background
  variant, independently positioned archive/register props, Penka's
  chair/character/desk stack, and the
  security officer/table stack. This closes the municipality background and technical-integration
  milestones; later work is limited to scene polish and additional animation.
- Election booth: painted background, table occlusion, conditional seated supporters,
  delivered box and ending creditors are integrated. Static seating now matches the
  painted chairs; the result panel can be hidden to inspect the room.
- Journalist: standing-v2 painted art is integrated in the square, office and polling room.
  The bilingual interview is playable; additional animation is deferred.
- Bai Mitko model sheet: locked identity source.
- Baba Stoyanka: seated-v2 fallback with approved square idle/talk sequences and
  aligned dialogue geometry. The polling room uses the static seated-v2 cutout.
- Old Men Chorus: two seated painted characters now occupy the existing square bench,
  using its stable Look/Talk/Use hotspot and fountain clues. Static pair at `99px` height;
  character animation remains future work. The walk mask excludes the area
  occupied by and behind the pair.
- Mitko's competition glass: separate transparent painted prop on the left mehana table,
  visible during Tony's active challenge and aligned with the existing own-glass hotspot.
  The water inventory icon and puzzle logic are unchanged.
- Bai Mitko runtime animation: the active Ludo.ai sprite-sheet path provides east walk
  start/loop/short/stop, six idle variants, three talk variants, rejection, and take. West mirrors
  east. North/south walk and additional look/use/puzzle actions remain deferred.
- Inventory icons: all fifteen items have icons, including food/drinks, evidence,
  campaign papers, archive props and diploma stamp-state variants.
- Apartment interaction geometry now includes the visible lower-left rakia bottle and treats the
  existing right-hand green sofa as a temporary sofa-bed recovery hotspot. Dedicated bed art is
  still pending approval.
- UI skin: prototype, with compact phone controls/readable dialogue added for review.
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

- Kiosk campaign board: a weathered-paper layer covers Mitko's portrait until
  `campaignPosted`; the Look hint points to kiosk printing. Posting reveals the
  original approved portrait without changing the background file.

- Municipality stamp station: oak table turned 5 degrees clockwise from v2,
  reduced another 10% (141.1 to 126.99px), then fitted at (505, 352)
  using the uploaded corner screenshot. Register draws over the overlapping left
  side of the table; seal and exposed click area remain accessible.
  The v5 redraw further lowers the rear edge and foreshortens the tabletop while preserving
  the front drawer placement through a fixed source crop. The v6 correction
  extends the rear legs to the floor and removes the inconsistent lower braces. Matching ink pad and forms, with a separate
  burgundy-and-brass seal at the existing interaction. Taking the seal hides only
  that prop; its matching image also appears in inventory.

## Current Integrated Runtime Assets

- `assets/chapter1/scenes/mehana/competition-glass-v1.png`
- `assets/chapter1/characters/old_men_chorus/seated-pair-v1.png`
- `assets/chapter1/scenes/municipality/stamp-table-v9.png`
- `assets/chapter1/scenes/municipality/municipality-seal-v1.png`
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
- `assets/chapter1/scenes/municipality/background-mayor-door-v1.png`
- `assets/chapter1/scenes/mayor_office/background-v1.png`
- `assets/chapter1/scenes/election_booth/background-v1.png`
- `assets/chapter1/scenes/election_booth/table-occluder-v1.png`
- `assets/chapter1/characters/journalist/standing-v2.png`
- `assets/chapter1/characters/creditors/pair-v1.png`
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
- `assets/chapter1/characters/baba_stoyanka/seated-v2.png`

## Remaining Production Work

- Review static election seating and result/room presentation.
- UI skin and physical-phone usability review.
- Existing background/art direction refinements require separate human decisions.
- Bai Mitko puzzle-specific performances and further NPC/finale animation are
  deferred, including Ludo production. Tony already has a mehana idle sequence;
  Baba already has square idle/talk sequences. Other static poses are intentional
  interim coverage, not missing painted character assets.


## Archive close-up — 16 September
Added `assets/chapter1/scenes/archive/{open,closed,jar,box}-v1.png`.
Open background includes the ledger. Jar and empty box are alpha cutouts with
inventory icons. Scene layers are authored in
`assets_src/chapter1/scenes/archive/layers.json`; original generations and
built-in imagegen prompts are preserved beside that file. The municipality’s
approved wide background is unchanged. Opening and substitution currently use
state changes; bespoke pull/swap animation remains outstanding.

## Polling-station direction sign
Replaced the square exit's rounded debug panel with a painted cream/burgundy
wooden arrow signpost, with readable Bulgarian and English lettering.
Runtime: assets/chapter1/scenes/village_square/election-sign-v1.png.
Original generation and prompt: assets_src/chapter1/scenes/village_square/
election-sign-v1.png and election-sign-v1-prompt.md (built-in imagegen).
Placement and silhouette hotspot are editable through the square's source
layers/object geometry. Visibility follows exit.square.to_election_booth, so
the existing interview gate, chapter-completion rule and destination persist.
Browser review confirmed legibility and normal-click entry to the polling room.

## Journalist shading refinement
User requested slightly richer detail and shadows to match Bai Mitko’s rendering.
Updated both square and office references to
assets/chapter1/characters/journalist/standing-v2.png, preserving the previous
standing-v1.png. The runtime canvas remains 257×800 and both scene placements
remain unchanged. Refined hair, facial/collar contact shadows, fabric folds and
leather highlights; existing character identity, hairstyle, outfit and pose retained.
Source, chroma import and imagegen prompt are under
assets_src/chapter1/mayor-office-v1/journalist-v2-*.
The built-in tool baked a checkerboard rather than alpha, so a background-only
chroma generation was processed with the existing chromaKeyGreenToAlpha utility.
Browser review confirmed the new transparent asset in both locations beside Mitko.
This is a painted sprite refinement; no animation sequences were added.
