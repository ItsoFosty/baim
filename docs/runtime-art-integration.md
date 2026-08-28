# Runtime Art Integration

## Scalable Runtime Delivery

The browser no longer downloads the whole art library before play. Startup waits only for:

- the current scene's raster layers;
- Bai Mitko's east/west walk start, loop, short, and stop sheets;
- icons for items already present in the loaded save.

Optional idle, speech, rejection, and action sheets load when first requested. After the first frame,
the game uses browser idle time to prefetch scenes reachable through the current scene's exits. A
scene transition still waits for its required scene assets, so a missed prefetch cannot expose an
unfinished scene.

Run the complete runtime build with:

```bash
npm run build:runtime
```

The build preserves the reviewed Ludo.ai PNG exports as source material, generates half-size alpha
WebP animation sheets, and writes `target/runtime-assets/manifest.json`. Every raster URL in that
manifest contains a content hash. The manifest is checked on every reload; unchanged hashed files
stay cached for one year, while changed files receive new URLs and are fetched automatically.

The service worker keeps at most 96 hashed runtime responses and 64 shell responses. Independently,
the in-memory decoded-image cache targets 256 MiB and evicts the least-recently-used optional images
while protecting the active scene, core walking sheets, and owned inventory icons.

Current measured build (2026-08-23):

| Payload | Transfer size | Approximate decoded size |
| --- | ---: | ---: |
| Playable apartment bootstrap art | 3.44 MiB | 63.58 MiB |
| Complete current runtime art library | 20.39 MiB | 405.10 MiB |
| Generated animation metadata module | 0.85 MiB | n/a |

At a sustained 10 Mbit/s, the bootstrap art is about 2.9 seconds of ideal wire time, before latency
and the metadata/module requests. The former eager 151.35 MiB animation-sheet transfer alone was
about two minutes at that speed. Future chapters increase the manifest and cache population, not
the reload payload: only the current working set and newly encountered content are transferred.

Deployment must publish `target/runtime-assets/manifest.json` and its `assets/` directory together.
The development server already sends the manifest with revalidation headers and hashed assets as
immutable. Production hosting must apply the same policy.

## Current Visual State

The game starts normally in:

```text
scene.chapter1.apartment
```

That scene now has the first real apartment runtime background.

The village square background is also integrated and proves runtime background loading works, but it is not final locked art direction. Its layout is useful, but the final version should later be regenerated or repainted closer to the Bai Mitko model-sheet style, with less baked-in readable text and more replaceable poster/sign surfaces.

The mehana now has a lighter third painted runtime pass. Its background contains the fixed architecture,
bar, sideboard, coat rack, cellar hatch, and old radio. Two matching bentwood-chair table groups,
seated Tony, the standing waiter, the newspaper, and the sideboard-mounted oil and water gameplay props
remain independent raster layers, so their scale, placement, visibility, and depth can be tuned without
repainting the room. The newspaper and background-baked radio both have authored Look hotspots and
natural Bulgarian/English observations.

Bai Mitko uses the same external animation sources as in the apartment. His mehana-only character-height
calibration is set so his visual height at `anchors.baiMitkoSeat` matches his apartment spawn height;
this does not change his scale in any other scene.

## Scene Background Status

| Scene ID | Runtime background | Status |
| --- | --- | --- |
| `scene.chapter1.apartment` | `assets/chapter1/scenes/apartment/background.png` | integrated |
| `scene.chapter1.village_square` | `assets/chapter1/scenes/village_square/background.png` | integrated; runtime proof, not final locked style |
| `scene.chapter1.mehana` | `assets/chapter1/scenes/mehana/background.png` | integrated V3; separate tables, Tony, waiter, newspaper, oil, and water layers |
| `scene.chapter1.municipality` | `assets/chapter1/scenes/municipality/background.png` | integrated V2; five-counter background with independent archive cabinet and candidate register layers |
| `scene.chapter1.election_booth` | `assets/chapter1/scenes/election_booth/background.png` | playable graybox; runtime background missing |

## Apartment Runtime Target

Source image:

```text
assets_src/environments/apartment-approved-style-v1.png
```

Runtime asset:

```text
assets/chapter1/scenes/apartment/background.png
```

This is the first real background for the default start scene. It is closer to the Bai Mitko model-sheet direction than the current village square proof, but still should be treated as a first runtime pass rather than final locked art.

## Village Square Runtime Target

Approved source image:

```text
assets_src/environments/village-square-approved-style-v1.png
```

This was preserved from:

```text
assets_src/environments/village-square-concept-v2.png
```

Older concept images were not deleted.

Runtime asset:

```text
assets/chapter1/scenes/village_square/background.png
```

The approved scene source remains PNG. Scene WebP conversion can be added to the same runtime build
later; the current optimizer already uses the project's Sharp dependency for animation sheets.

## Character Runtime Animation

Bai Mitko no longer uses static runtime pose images. The runtime uses optimized external animation
sheets generated under:

```text
target/external_animation_v1/runtime/
```

These are delivery derivatives only. The approved external PNG sheets and JSON metadata remain the
source-of-truth import path under `assets_src/characters/bai_mitko/external_animation_v1/`.

When Bai Mitko has no active authored animation for the current state, the renderer holds frame 0 of the current-direction walk-start animation.

## Basic Animation And Speech Style Milestone

As of 2026-07-04, the first practical Bai Mitko runtime animation/style baseline is in place.

- Bai Mitko runtime rendering is animation-first; static still pose images are not part of the active character path.
- East-facing animation sheets are the authored source for the current walk/talk/idle work, and west remains mirrored from east.
- Speech bubbles are DOM-rendered above the canvas and use measured text dimensions instead of fixed guessed sizes.
- Speech bubble placement is anchored from a calculated tail endpoint near Bai Mitko's mouth, with debug geometry available for tuning the tail target and measured bubble rectangle.
- Bubble text overflow is intentionally hidden for this first pass; later work can add smarter clipping, paging, or screen-edge fitting.
- North/south character animation and complete bubble polish remain deferred until the east/west baseline is stable.

The model sheet remains source direction:

```text
assets_src/characters/bai-mitko-model-sheet-v1.png
```

Next character-art task:

```text
Bai Mitko walk/talk/look/use/take animation pass
```

## Starting Inventory Icons

Integrated runtime icons:

```text
assets/chapter1/items/accordion.png
assets/chapter1/items/unpaid_bills.png
assets/chapter1/items/empty_envelope.png
```

If an icon is missing, the inventory UI keeps the existing text-label fallback box.

## Manifest Entries

The active apartment manifest entry is:

```js
"scene.chapter1.apartment": {
  background: "assets/chapter1/scenes/apartment/background.png",
  foregroundTable: "assets/chapter1/scenes/apartment/foreground-table.png",
  billsOnTable: "assets/chapter1/scenes/apartment/bills-on-table.png",
  windowOpen: "assets/chapter1/scenes/apartment/window-open.png",
  windowOpenBack: "assets/chapter1/scenes/apartment/window-open-0.png"
}
```

The active village square manifest entry is:

```js
"scene.chapter1.village_square": {
  background: "assets/chapter1/scenes/village_square/background.png"
}
```

The active mehana manifest entry is:

```js
"scene.chapter1.mehana": {
  background: "assets/chapter1/scenes/mehana/background.png",
  tableGroupLeft: "assets/chapter1/scenes/mehana/table-group-left-v2.png",
  tableGroupRight: "assets/chapter1/scenes/mehana/table-group-right-v2.png",
  mehanaWaiterIdle: "assets/chapter1/characters/mehana_waiter/idle-v1.png",
  tonyFridgeSeated: "assets/chapter1/characters/tony_fridge/seated-v1.png",
  kaliakraOil: "assets/chapter1/scenes/mehana/kaliakra-oil-v1.png",
  waterJug: "assets/chapter1/scenes/mehana/water-jug-v1.png",
  todayNewspaper: "assets/chapter1/scenes/mehana/newspaper-v3.png"
}
```

Missing assets are omitted from the manifest so preload does not generate expected 404 responses.
Municipality and election-booth backgrounds remain omitted and use the renderer's intentional
debug-art fallback until their directions are approved.

The renderer resolves these paths relative to `index.html`.

## Renderer Behavior

Normal gameplay:

- attempts to load the scene background from `assetManifest`
- draws the real background if it loads
- hides hotspot/walk/debug boxes by default on real backgrounds
- draws Bai Mitko's idle sprite if it loads
- draws starting inventory icons if they load

Fallback behavior:

- if a scene background is missing, still loading, or fails to load, the renderer draws the placeholder background
- geometry boxes are shown on fallback placeholders so missing-art scenes remain debuggable
- if Bai Mitko's idle sprite is missing, the geometric player placeholder is drawn
- if an inventory icon is missing, the text-only inventory box remains usable

Debug overlay:

- press `Shift+G` to toggle scene geometry debug overlay
- open the game with `?debugGeometry=1` to enable it immediately
- debug geometry is off by default on normal reloads

When enabled, the overlay may draw:

- walk polygon
- depth zones
- exits
- hotspot rectangles
- NPC rectangles
- anchors

## Developer Diagnostics

Art-load diagnostics are console-only and gated behind debug geometry mode.

Enable diagnostics with either:

```text
http://localhost:5173/?debugGeometry=1
```

or press:

```text
Shift+G
```

Expected examples:

```text
[art] scene.chapter1.apartment background: loaded assets/chapter1/scenes/apartment/background.png
[art] scene.chapter1.village_square background: loaded assets/chapter1/scenes/village_square/background.png
```

Diagnostics log only when scene/art status changes. They should not spam every frame.

## Direct Scene Verification

For development/testing only, use:

```text
http://localhost:5173/?scene=scene.chapter1.village_square
```

This starts directly in the village square if the scene ID exists.

Rules:

- normal default start scene is unchanged
- save loading still works
- invalid scene IDs are ignored safely
- the query param does not create a new chapter or change stable IDs

Useful combined URL:

```text
http://localhost:5173/?scene=scene.chapter1.village_square&debugGeometry=1
```

## Alignment

Apartment roughly aligned in logical `1280x720` scene coordinates:

- walk polygon
- Bai Mitko spawn point
- door exit to village square
- accordion hotspot
- unpaid bills hotspot
- mirror hotspot
- TV hotspot
- wardrobe hotspot
- table hotspot
- campaign poster hotspot

Village square roughly aligned in logical `1280x720` scene coordinates:

- walk polygon
- apartment exit
- mehana exit
- municipality entrance area
- kiosk hotspot
- campaign board hotspot
- fountain hotspot
- statue hotspot
- old men bench hotspot
- election notice hotspot
- Baba Stoyanka anchor/interaction area
- seated Baba Stoyanka scene layer at the bus-stop bench
- Journalist anchor
- Old Men Chorus anchor
- Bai Mitko default spawn point

Mehana aligned in logical `1280x720` scene coordinates:

- square exit and entrance door
- independent left and right table/chair compositions
- seated Tony layer, interaction area, and rakia glass
- standing waiter layer and dialogue interaction area
- separate newspaper layer and Look hotspot
- separate collectible oil and water layers on the sideboard
- background-baked radio Look hotspot
- cellar hatch and hidden ballot-box interaction areas
- Bai Mitko seat and apartment-matched visual-height calibration

The Baba cutout uses an authored `height` of `122` in the village-square layer source, approximately
80% of Bai Mitko's perspective-scaled height at `anchors.babaBench`. Its `left` and `top` placement
preserves the previous visual center and seated baseline; the renderer derives the cutout width from
the PNG aspect ratio. Keep character cutout calibration in the authored layer source rather than
resampling the approved runtime asset for every placement adjustment.

## Manual Alignment Still Needed

- Fine hotspot tuning should be done with `Shift+G` in browser.
- Apartment foreground occlusion is not split yet; later split objects such as the table/chairs, accordion chair, and door frame if needed.
- The municipality is playable as a geometry graybox with the clerk, stamp desk, candidate register,
  archive cabinet, and square return route. It still needs a reviewed runtime background and tuned
  object geometry once that art exists.
- The election booth is playable as a geometry graybox with a final-commitment interaction and three
  persistent outcomes. It still needs its reviewed background, commission presentation, and tuned
  geometry once that art exists.
- Village square foreground occlusion is not split yet. Later, export foreground elements such as the mehana doorway, kiosk edge, fountain rim, and foreground plants as separate layers if needed.
- Topical poster text should eventually be moved to replaceable layers where possible.
