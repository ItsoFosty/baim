# Production Graphics Plan

## Decision

The game should use high-resolution painted 2D scenes with metadata-driven geometry and sprite-sheet
character animation.

`assets_src/characters/bai-mitko-model-sheet-v1.png` is the locked Bai Mitko identity source. New
Bai Mitko poses, walk references, sprite frames, and animation inputs must be generated or edited
from that approved model sheet as a strict identity-preservation workflow. If the face, body
proportions, outfit, or friendly comic appeal drift, the output is rejected.

Runtime pose generation must also use the closest approved green runtime pose as the primary style
anchor. For east-facing Bai Mitko poses, use `assets_src/characters/bai-mitko-idle-east-chroma-v1.png`
as the primary reference for canvas, framing, scale, lighting, rendering, green background, line
weight, and face/style continuity. Do not generate new Bai Mitko runtime poses from text plus the
model sheet alone.

The reviewed Ludo.ai sprite sheets and JSON metadata under
`assets_src/characters/bai_mitko/external_animation_v1/` are the active browser-runtime animation
source path. The locked model sheet and approved green runtime poses remain identity/style review
references for any new input supplied to that path.

## Recommended Stack

### Backgrounds And Environments

Use AI-assisted concept art plus paintover/cleanup.

Production scene resolution:

- Logical game canvas: `1280x720`
- Runtime scene background in `assets/`: exactly `1280x720`
- Runtime full-canvas scene layers in `assets/`: exactly `1280x720`
- Trimmed runtime prop/foreground layers in `assets/`: natural trimmed PNG size, placed in
  `1280x720` canvas coordinates
- Source paintings in `assets_src/`: keep the available/full generated or edited resolution
- Optional ultra source for marketing/key art: keep separately under `assets_src/`

The browser renderer draws scene backgrounds and full-canvas scene layers 1:1. It does not scale a
generated background down at runtime or stretch foreground layers to the canvas. Trimmed cutouts can
use an explicit authored `width` or `height` for scene calibration while preserving their aspect
ratio. Any new background request must still include a runtime preparation step that
resizes/crops/pads the approved source to `1280x720` before placing it under
`assets/chapter1/scenes/<scene>/background.png`.

Scene delivery separates prepared runtime images from authored source data. Image filenames
and formats vary by the approved scene; this is a layout example, not a rename requirement:

```text
assets/chapter1/scenes/<scene>/       # prepared background and prop/foreground images
assets_src/chapter1/scenes/<scene>/
  layers.json
  object-geometry-v1.json
  walk-geometry-v1.json              # where applicable
  <original-images-and-prompts>
```

The painted image is never the only source of truth. Scene authoring JSON remains under
`assets_src/` and is compiled into runtime modules under `src/content/chapter1/`:

- walk polygons
- depth zones
- hotspot shapes
- exit shapes
- dialogue anchors
- occlusion layers

### Characters

Use reviewed sprite sheets/atlases with metadata. For Bai Mitko, the approved model sheet is the
identity contract for every generated pose and animation source. Green-screen removal remains the
active cutout pipeline for generated character assets, but the chroma source image itself must first
match the locked model-sheet design.

Current walk production scope is east-facing source only. Do not generate separate west walk assets;
west should be mirrored from east. North and south walk assets are deferred and are not part of the
current generation pass.

The east walk key pose must be an edit/variant of the approved east idle green source image family.
Reject any output that looks like a different generation batch, even if the character concept is
recognizable.

Character and animation cutouts use a deterministic source-to-runtime transform: remove green, scale
the whole source canvas by `CHARACTER_SOURCE_SCALE = 0.6`, then add the shared
`CHARACTER_CUTOUT_MARGIN_RATIO = 0.15` transparent canvas margin on all sides. Do not crop each pose
to its silhouette; matching source canvases must keep matching runtime canvas size and stable sprite
placement. Conversion tools must not create new Bai Mitko poses or directions unless explicitly
requested.

Character sprite sheets and animation atlases are not normalized to scene canvas size. Keep their
authored atlas resolution and let the runtime character renderer scale Bai Mitko by scene depth and
character constants.

Existing Ludo.ai ZIP exports remain under `assets_src/characters/bai_mitko/external_animation_v1/`
as the active sprite-sheet import source. They are runtime motion assets, not permission to drift
from the locked model-sheet identity when new source work is commissioned.

Rive is useful for menus, logos, UI widgets, election meters, posters, and small animated signs.
It is not the first choice for painterly full-body adventure characters.

## Modern Bulgarian Town Visual Target

The town should feel current, not medieval or generic Eastern European stock art:

- cracked post-socialist pavement mixed with new EU-funded curbs;
- old panel blocks, cheap PVC windows, satellite dishes, air conditioners;
- faded municipal beige corridors and plastic plants;
- campaign posters layered over old posters;
- dusty cars, patched asphalt, pharmacy signs, lottery kiosks, kebapche smoke;
- renovated-but-already-broken public works;
- Bulgarian signs left in-world, with localized Look descriptions;
- strong caricature silhouettes but painterly textures.

Avoid:

- generic fantasy village;
- Soviet museum look everywhere;
- tiny pixel art;
- realistic photo collage;
- dark gritty noir palette for every scene;
- direct real politician likenesses or real-party logos.

## Asset Contracts

### Tracked Character Source Package

```text
assets_src/characters/<character>/external_animation_v1/
  input/                 # original ZIPs or unchanged native API sources
  references/            # when a candidate has retained reference derivatives
  <selection-or-manifest>.json
  <candidate-provenance>.md
```

The exact manifest filenames vary by character. Bai Mitko uses
`external-animation-selection.json`; NPC pilots use `animation-pilot.json`. API-derived
atlas/timing files must be identified as derived, not original website exports. Raw API
responses and credentials remain protected private state, never shared source art.

Scene-specific character cutouts and older production groups may remain under
`assets_src/chapter1/`. Preserve those existing paths; this contract does not authorize
relocation or deletion. See [art pipeline](art-pipeline.md) for placement and evidence rules.

### Generated Bai Mitko Staging And Runtime Package

Bai Mitko's build tools put unpacked sources, previews, cleanup outputs and reports under
ignored `target/external_animation_v1/`, not the tracked source package. The runtime example
below is also generated; other NPC production atlases live under
`assets/chapter1/characters/<character>/`. Rebuild generated outputs from retained inputs;
preserve final review evidence separately before approved cleanup.

```text
target/external_animation_v1/runtime/
  walk_east_start.png
  walk_east_loop.png
  walk_east_stop.png
```

### Required Bai Mitko Animations

- held walk-start frame 0 for no-active-animation states
- `walk_side` authored as east source, with west mirrored from east
- `walk_down` deferred
- `walk_up` deferred
- `talk_neutral`
- `talk_smug`
- `look`
- `use`
- `take`
- `play_accordion`
- `drink`
- `react_shocked`

## Image Generation Plan

Use ChatGPT image generation in phases:

1. Key art mood frame for the whole game.
2. Bai Mitko character sheet.
3. Three Chapter 1 environment concepts: apartment, village square, mehana.
4. Selected scene background final pass.
5. Prop and inventory icons with clean transparent output.
6. Bai Mitko east-facing walk pose and animation source frames generated from the approved model
   sheet, on clean green background for the green-removal pipeline. West is mirrored; north and
   south are deferred.
7. Dialogue portraits and expression sheets.

AI output is source art, not final animation by itself. For Bai Mitko motion, use model-sheet-locked
pose/source generation first, then green removal, reviewed sprite sheets, and JSON frame metadata.
External animation exports are allowed only after the source character variables are stable.

## First Art Milestone

Generate and approve these before producing all assets:

1. `style.key_art.chapter1`
2. `character.model_sheet.bai_mitko`
3. `scene.concept.village_square`
4. `scene.concept.mehana`

No final batch production should start until those four are visually aligned.

## Replaceable Topical Satire Surfaces

Scene art should leave space for replaceable topical satire:

- poster layers
- bulletin boards
- TV screens
- newspaper scraps
- municipality notices
- election notices
- wall signs

Design these surfaces so topical text jokes can be updated later without repainting the whole background when possible.

Practical rules:

- Keep text-heavy posters on separable layers when possible.
- Avoid baking important topical jokes into complex background paint.
- Leave clean rectangular or warped-poster zones for later replacement.
- Use fictional slogans and symbols only.
- Keep Bulgarian in-world signs readable enough for Look text support, but do not rely on tiny text as the only joke.
