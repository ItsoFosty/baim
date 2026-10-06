# Mehana layered redesign — runtime review

Owner-selected direction, not production approval. Retain all original paintings and runtime furniture files. Rebuild draft room/furniture/counter alpha assets with `node tools/build-mehana-redesign.mjs`, then build scene layer/object geometry and runtime manifest through existing tools.

Furniture is manually traced in source coordinates and rendered full-canvas at1280x720. Counter-front z45 hides the temporary waiter z50. Tony remains left861/top310/height244/z35; tables z20 cover the seated lower body. Rear chairs are separate atz40. Conditional oil/water/newspaper and both competition glasses remain gameplay layers. The original cellar hatch is preserved as a layer; its retired interaction and disabled ballot box remain unchanged. WC remains art only.

The existing waiter is a geometry stand-in. Owner must select a redesigned model separately before treating that model as complete. Human visual/runtime approval and exact publication bundle remain outstanding. No paid generation, service restart, destructive cleanup or publication.

Private evidence: /home/ZeShad/baim/.git/baim-workflow/mehana-redesign-layers; corresponding Windows archive under extraFixes/10_Bar/mehana-redesign-layers-review.

The runtime room has transparent holes only beneath fully opaque counter-front pixels. The counter layer restores these pixels later in depth order; antialiased boundary padding stays in the room to avoid seams. This is deterministic separation, with no invented hidden aisle art. Moving/removing the counter would require a separate clean-plate art pass.

## Owner correction 2026-10-05

Tony now uses left883/top286/height268 with shared registration across all six unchanged animation sources. His polygon and speech anchor follow the new position. The hatch layer and retired hotspot are disabled, with original files and IDs preserved.

The static furniture/floor pixels now come directly from the approved painting, eliminating exposed mismatched clean-plate pixels around chairs and legs. Table and chair alpha layers remain for actor depth; furniture is deliberately static and is not independently removable without precise hidden-floor authoring. The earlier clean plate is retained but is no longer consumed. Counter separation remains unchanged.

## Owner-approved room and Toni placement — 2026-10-06

Current consumed painting: accepted-room-v13.png; original approved-direction.png retained. Toni left877/top296/height320 matches accepted v14 renderer still. Furniture remains static, with existing actor-depth masks. Existing animation sources, timing and hook IDs are unchanged. No publication authorized.
