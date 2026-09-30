# Baba Stoyanka seated talk runtime candidate

Date: 2026-09-30. Candidate: `bs-talk-seated-c01`. Branch: `feat/baba-stoyanka-seated-talk`, canonical base `78ff0a6`.
Status: `runtime_approved`. Ludo preview and actual VPS runtime accepted by Svetozar.
Runtime/publication decision: user replied "Approval" on 2026-09-30 after the in-game recording,
complete diff, verification results, publication sequence and exact cleanup targets were presented.

The original ZIP is preserved as `input/bs-talk-seated-c01.zip`. The Talk entry in `animation-pilot.json`
records source/derivative hashes, the provided prompt, phone-confirmed Hydra settings, 15-credit spend,
copied final frame, unavailable result identifier reason, timing, transparency and registration bounds.
The assistant's instruction to tap the warning icon inadvertently triggered generation; no new spend is requested.

## Architecture decision

An optional NPC-bound `talkAnimation` augments a scene raster layer. The existing idle remains unchanged.
Dialogue lines use the existing speech reading-duration estimate, then return to idle while choices remain
visible. New nodes/reopened dialogue restart speech from frame zero; other speakers and dialogue close
end it. Timed NPC reactions use their existing elapsed clock. Dialogue speech clocks freeze for pause/menu.
This is ephemeral visual state and does not alter save data, effects, IDs or Bulgarian/English text.
Only the village-square Baba layer opts in; election layers remain unchanged.

The talk union bounds x132 y94 w119 h194 are registered against approved idle x132 y95 w119 h193.
Both use the same 122/193 display scale and anchor. The extra top pixel is rendered above the anchor
instead of shrinking or clipping the animated head. No per-frame crop/scale is used.
Missing talk assets fall back to approved idle, then the static fallback.

## Review and publication

Actual-runtime URL: http://51.38.50.3:5173/?play=1&scene=scene.chapter1.village_square
Choose Talk and Baba, then try another choice and wait for talk to return to idle.
Normal gameplay, including choice text, is unchanged. Talk is not a continuous idle.

Durable verification evidence is retained locally in
`C:/Users/SveBiS/Desktop/myStuff/2026_GitPro/extraFixes/08_BabaStoyanka/talk/`.
Temporary VPS review tools and evidence: `/home/ZeShad/baim/target/baba-talk-review/`.
Verification results will be recorded after checks finish, never inferred from partial test output.

Before publication, present complete diff, final test/runtime results, PR scope and exact cleanup targets.
The user approval authorizes reconciliation of approval records, commit, push to zeshad,
creation of the tran4o/baim:master PR, merge-if-green, VPS master sync and the exact listed cleanup.
Local source/exports and retained review evidence must be preserved.

## Completed runtime-review verification

- Unchanged export: 25 frames, 190 ms per frame, 4.75 s, 5x5, 768x768 source frames, RGBA8888.
- Runtime derivative: 1920x1920 alpha WebP, 384x384 frames, 90 quality, 100 alpha quality, effort6.
- Focused engine/talk checks: 176 passed.
- Full `npm test`: 277 passed, 0 failed/skipped/cancelled, 202.432 s, exit0; no force-exit used.
- Initial full-suite run: 276/277 passed; catalog wording assertion failed, corrected and fully rerun.
- Final catalog/talk checks after print correction: 10 passed, exit0.
- `npm run build:runtime`: passed, exit0. Catalog freshness and workflow review passed.
- Actual port5173 Playwright journey at 1280x720: passed, 25/25 talk frames, 363 draw calls,
  stable registered scale/anchor, timed return to idle with choices visible, new-line restart,
  pause freeze, leave/scene end, no election talk, no page errors/HTTP failures.
- Source image, static fallback, idle atlas and approved idle manifest entry are unchanged.
- NPC PDF: rendered Baba page inspected, idle Runtime Approved and talk Runtime Approved both
  present, all source/scene details visible. Tall multi-pilot cards now expand in print.
- Unrelated Bai Mitko/index/world PDF timestamp-only re-renders removed from the proposed diff.
- Initial review-recorder attempts failed on a module import, the old rectangle hotspot, and an
  overstrict full-loop assertion on the short opening line. Corrected recorder uses the game's
  exposed polygon and existing longer vote-terms line. Final runtime check passed.

Retained local evidence files in the directory above include `actual-dialogue.gif`,
`runtime-talk.png`, `runtime-return-to-idle.png`, `runtime-review.json`, `npm-test-final.log`,
`focused-tests.log`, `final-focused-tests.log`, `build-runtime.log`, `workflow-review.log`,
`complete-review.diff`, `chapter1-npc-animation-catalog.pdf`, and `npc-catalog-final-2.png`.
Phone generation settings and 15-credit balance change screenshots are retained there too.
The original source image and local `bs-talk-seated-c01.zip` are preserved.

Proposed PR: **Animate Baba Stoyanka during village-square dialogue**.
Scope: original ZIP, provenance/README, talk atlas, optional reusable NPC speech window/layer
selection, shared registration, scene data and generated runtime, focused tests, and accurate
HTML/PDF catalogs. IDs, bilingual dialogue, approved idle and election behavior are unchanged.

## Exact proposed cleanup after approved publication and merge

- Local VPS Git branch: `feat/baba-stoyanka-seated-talk`.
- Matching `zeshad` Git branch: `feat/baba-stoyanka-seated-talk`.
- Task-owned VPS temporary directory: `/home/ZeShad/baim/target/baba-talk-review/`.

Preserve all local source/export/review files, tracked animation inputs/runtime assets, and port5173.
Runtime review was accepted before publication. Perform cleanup only after the approved PR is merged
and VPS master is synchronized. Retain all local source/export/review evidence.

## Approval reconciliation

Approval date: 2026-09-30; reviewer: Svetozar; decision: approved_for_runtime.
Prompt/provenance, README and this record agree on runtime_approved and village-square-only scope.
The exact submitted Ludo prompt and result identifier remain unavailable for the documented reasons.
Publication changes after review are limited to approval metadata, associated status assertion,
and regenerated catalog status; runtime code and animation inputs remain the reviewed versions.

Post-approval focused catalog/talk checks: 10 passed, exit0. Approved PDF page rendered and verified with both slots Runtime Approved and complete source/scene details.

Post-approval publication verification: full `npm test` completed normally with exit 0, 277 passed, 0 failed/skipped/cancelled (200799.646298 ms). Approved NPC PDF page 2 was rendered and visually checked; both animation records and source/scene metadata are fully visible.
