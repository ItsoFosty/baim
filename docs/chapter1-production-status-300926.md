# Chapter 1 production status — 30 September 2026

This is the current work queue following the Chapter 1 review. It supersedes the
remaining-work lists in the 16 and 22 September plans. Changes are local previews
on `feat/chapter1-presentation-polish`; no commit, publication or new art approval
is implied. Existing accordion/audio work in the checkout is preserved.

## User-directed scope

| Review priority | Decision and current status |
| --- | --- |
| 1 — opening, onboarding and puzzle guidance | Completely deferred by the user. Opening behavior, hints, archive navigation and default developer landing page are unchanged. |
| 2 — dedicated puzzle/action performances | Deferred together with all Ludo and animation work. |
| 3 — finale presentation | Static supporter seating and a collapsible result report implemented for review. Animated finale work deferred. |
| 4 — NPC animation coverage | Deferred. Existing approved animations stay in place. |
| 5 — phone usability | Physical-size HTML controls, readable dialogue and scrollable inventory/results implemented for review. |
| 6 — sound | Initial procedural ambience and interaction cues implemented for review; recorded environmental sound and music remain future production work. |

## What is already playable

Seven scenes cover the apartment, square, mehana, municipality, Mayor's office,
archive and election room. Registration, fountain repair, both supporter routes,
the receipt investigation, archive replacement, ballot delivery and objections
connect to three saved endings. The [outcome contract](chapter1-review-220926.md#deterministic-outcome-contract)
is unchanged: both supporters guarantee a win, with campaign state determining
the margin. All fifteen inventory items have icons, including the stamped diploma.
Both languages cover the player-facing content.

The election room and journalist have painted assets. Earlier descriptions of a
graybox election room, debug journalist or missing inventory icons are obsolete.
Baba's square idle/talk and Tony's mehana idle already exist; their election poses
remain static. No art files or animation definitions were replaced in this pass.

## Presentation changes

The election room reuses the existing seated supporters at the painted chairs.
Baba's source bounds are `(318, 283, 78, 140)` and Tony's are
`(367, 266, 132, 165)`. Source layers, clickable geometry, generated runtime data
and fallback rectangles agree. Attendance still depends on earned support.

Each ending has **View the room / Виж стаята**, then **Back to results / Обратно
към резултатите**. Hiding the report reveals the staging without changing the
recorded outcome, epilogue position or save. The completed room stays read-only.
This toggle is temporary UI state and is not added to the save schema.

Compact play viewports counter-scale the HTML interface while preserving the
1280×720 canvas, scene aspect ratio and world coordinates. Controls have a minimum
44 CSS-pixel height. Inventory scrolls horizontally; selection opens readable
actions. Dialogue puts the NPC line beside scrollable choices. Results and menus
scroll within the viewport. Portrait mode suggests rotating for a larger scene.
Developer/editor/animation surfaces retain their existing layout.

Audio remains opt-in, muted by default, with the existing saved volume control.
Quiet room/air beds cover the scenes; fountain ambience follows the saved repair
flag. Paper, jar, stamp, oil/water and ballot-box interactions have short procedural
cues. Ending presentation stops ambience and retains the existing result motifs.
These are synthesized texture/impact sounds, not field recordings or a soundtrack.
The checkout's seven-second accordion recording and footstep implementation remain
in use; using the archive strap does not trigger an accordion performance.

## Remaining work within the active scope

- Human review of supporter scale/seating, result readability and the audio mix.
- Physical-phone checks, especially Safari/iOS, browser chrome and safe areas;
  Chromium viewport checks do not establish device or accessibility certification.
- Further UI/art skin polish, subject to the existing approval process.
- Authored environmental recordings and music if desired after the initial mix is
  reviewed. This pass adds no music, voice acting or new sound asset downloads.

Priority 1 and every Ludo/animation item are intentionally parked, not unfinished
tasks in this implementation. First-time-player testing can be scheduled when the
onboarding work resumes. No additional chapter, renderer change, stable-ID
migration or resolution change is proposed.

## Review and verification

Use the existing server on port 5173:

- `/?play=1&review=election` — static room and conditional supporters.
- `/?play=1&review=convincing_win`, `narrow_win`, or `loss` — ending report and room toggle.
- `/?play=1` — normal play; Sound and Volume are in the pause menu.

Review presets use temporary saves. They do not overwrite the normal game.
Check BG and EN at desktop size and at 320×568, 390×844, 640×360 and 844×390.

Verification results and screenshots are retained in the local ignored folder
`target/chapter1-presentation-review-20260930/`:

- `npm-test-final.log`: **295 tests passed**, zero failures, cancellations or skips.
  This includes real-click BG loss and EN narrow/convincing-win journeys, save
  reloads, inventory/quest effects, fountain recovery and existing audio checks.
- `focused-engine.log`: 177 engine/presentation checks passed. The first full run
  caught three lightweight test setups without save state; the ending guard now
  tolerates absent state. The subsequent full run above is the final result.
- `focused-browser.log`: compact UI and actual Web Audio rendering passed. BG/EN
  checks cover four phone sizes, full-inventory scrolling, dialogue choices and
  all three read-only ending-room toggles. Foley/noise/hum output is non-silent;
  mute and zero volume are silent, with completed voices released.
- `phone-measurements.json`: top-bar controls are at least 44 CSS pixels high
  (within floating-point rounding), with no clipped labels at the checked sizes.
- `election-desktop.png`, `phone-*.png`, `dialogue-*.png`, `menu-*.png`,
  `ending-phone.png` and `ending-phone-room.png`: inspected runtime screenshots.
- `git diff --check`: passed. No artwork, animation definition, stable ID, save
  schema or outcome rule changed in this pass.

The read-only `npm run workflow:review` was run but fails its hardcoded environment
check: it expects `/home/ZeShad/baim` and a `marto` remote. This session uses the
user-approved `/home/ubuntu/git/baim` checkout. The helper was not modified or
bypassed, and this is not a passing publication check. No commit/push/PR/merge was
performed. Existing services and unrelated working-tree changes are preserved.
