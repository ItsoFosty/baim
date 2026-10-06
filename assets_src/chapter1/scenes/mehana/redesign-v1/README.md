# Mehana room, Toni and bartender — approved visual result

The owner approved room v13, Toni placement v14 and the smaller bartender behind the counter v5/v6. Room/Toni is committed as761e011; the subsequent bartender integration and documentation are uncommitted pending the complete publication-v7 decision. Artistic approval is complete.

Current runtime: accepted-room-v13.png; Toni left877/top296/height320 with all six original animations unchanged; the static fictional glass-focused bartender left733/top238/height230. Original waiter idle-v1.png and approved paintings remain preserved. The counter rear-edge strip uses original room pixels in front of the actor, giving a continuous clear wooden plank. Stable NPC/dialogue/shopkeeper IDs and gameplay remain intact. Hatch source/ID retained but visually disabled; furniture is static and hidden floor is not authored.

Build room masks with node tools/build-mehana-redesign.mjs, then use existing object-geometry, scene-layer-runtime and runtime-manifest builders. Current NPC/world/index HTML and PDF catalogs describe the integrated candidate. Source prompts were recovered verbatim from the original tool calls; originals and provenance are retained under mehana_waiter/redesign-v2.

Detailed review and publication/cleanup manifests are retained privately in .git/baim-workflow/mehana-redesign-layers/publication-v7 and on the owner PC under extraFixes/10_Bar/mehana-publication-v7. Publication remains pending an exact bundled owner decision.

## Historical draft notes — superseded by the approved state above

### Mehana layered redesign — runtime review

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
