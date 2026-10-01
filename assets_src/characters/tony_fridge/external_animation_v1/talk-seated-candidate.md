# Tony Fridge seated talk preparation

Date: 2026-09-30. Candidate: `toni-talk-seated-c01`.
VPS repository: `/home/ZeShad/baim`, host `vps-b30ffe96`.
Branch: `feat/tony-fridge-seated-talk`, canonical base `9c09fbb`.
Status: preparation only; generation not authorized or started, no credits spent.

## Verified environment and references

Required rules, start-session, animation direction/workflow and daily lessons read.
Canonical fetch completed; clean master matched marto/master before task branch creation.
No open canonical PR or matching zeshad task branch was found.

- `assets/chapter1/characters/tony_fridge/seated-v1.png`
- `assets_src/chapter1/scenes/mehana/tony-fridge-seated-cutout-v1.png`

Both verified SHA-256: `b1d088b7d120490bcf5a4dcabcbab9531462a36e467661cff7242ae2c911bde8`.
Reference visually inspected: approved seated character on green background. Preserve this input;
verify alpha/chroma removal in the eventual export rather than assuming the source is transparent.
Local unchanged reference: `tony-fridge-approved-reference.png` in this preparation folder.

Preserve `assets/chapter1/characters/tony_fridge/idle-seated-v1.webp`, SHA-256
`1cca1e9231c9401f01625f16913e124c0ac3728c2d10f05b862e2836f6e2fd7e` (verified).

## Recommended prompt (not submitted-prompt evidence)

Create a seamless five-second seated talking loop for Tony Fridge, the large, imposing man in the approved reference. He stays heavily seated and anchored in exactly the supplied pose. Animate restrained conversational mouth shapes, gentle chest breathing, one small confident head nod, and a slight movement of the fingers of one resting hand. His expression is self-assured and mildly smug, without an exaggerated grin. Keep his hands close to their approved resting positions. Return smoothly to the reference resting pose at the loop boundary. Preserve his exact face, moustache, body mass, proportions, clothing, colors, silhouette, seated pose, framing, and painted cartoon style. Fixed camera and scale, isolated character with transparent background. No standing, body drift, large arm gestures, drinking action, new props, table or chair painted into the export, background, extra limbs, costume change, or facial redesign.

## Proposed settings and spending decision

Hydra; duration 5 seconds; maxFrames 25; spriteSize 384; Loop On; Trim Off; margin Auto.
Inspect Copy1stFrame availability and record the actual selection; prefer On for a clean loop if offered.
The current Ludo browser is signed out at https://app.ludo.ai/login.
Current controls, warning text and credit cost are therefore unverified.
Prior Tony idle provenance records 15 credits for Hydra with similar settings; this is historical,
not evidence of the current cost. Result ID/URL and actual submission evidence are pending.

Before agent generation, capture the displayed candidate/settings/cost and obtain explicit spending approval.
For phone generation, tapping Animate starts generation and spends the displayed credits.
Do not tap an embedded warning icon to inspect it. After generation starts, wait for that result.
Preserve the original downloaded ZIP and result URL/ID when available.

## Planned reversible integration after export

Reuse optional NPC-bound talkAnimation and existing Game speech windows from PR #23.
Configure only Mehana Tony, npc.tony_fridge, layer.mehana.tony_fridge_seated.
Placement: left861 top310 height244 zIndex35 on 1280x720 canvas.
Registration reference: idle x116 y91 w152 h198. Measure talk union bounds across all frames;
use those measured bounds with the existing registrationBounds path to preserve scale and anchor.
Talk during Tony speech only; idle while choices remain open; approved idle/static fallbacks retained.
Election, dialogue IDs/text, gameplay/save state and approved idle remain unchanged.

Affected files expected: original input ZIP, candidate provenance/notes, derived talk atlas,
Mehana layers source/generated configuration, scene asset manifest, focused tests, relevant catalogs.
No engine change is currently demonstrated necessary.

Verify source ZIP PNG/JSON geometry/timing/alpha and all hashes; build runtime; focused tests;
required full npm test with final summary/exit status; workflow review; diff check.
Review actual Mehana dialogue at 1280x720 and normal size, short/long BG/EN lines, all frames,
restart, pause/menu, close, fallback, election isolation and talk-to-idle transition/edges.
Retain actual-game recording and durable evidence in this local folder.
Do not commit/push/publish until final runtime review and explicit approval of the reviewed sequence.

## Current limits

No talk ZIP exists yet. No runtime integration/build/test claim is made during preparation.
Next input required: sign-in for settings/cost inspection, or phone settings/cost screenshot and export.

## Signed-in browser preparation, 2026-09-30

User completed sign-in. The existing Sprite Generator Animate screen was inspected directly.
Approved reference was uploaded; Ludo displays it against a checkerboard background.
The recommended prompt above was entered exactly, but has not been submitted for generation.
Hydra, duration5s, maxFrames25, spriteSize384, marginAuto, Loop On and Trim Off verified.
Copy1stFrame was available and used to populate Final Frame with the same reference.
The current displayed generation cost is 15 credits; current balance displays389.
Queue reports no jobs running. Animate has not been clicked and no paid generation is authorized.
An embedded warning icon is visible on Animate. Its meaning is unavailable from current visible
text/accessibility labels; it was not clicked or claimed harmless.
Prepared-settings evidence: `ludo-prepared-settings.jpg` in this durable local folder.
Next decision: explicit approval to generate this candidate for15credits, or further warning inspection
through a verified separate help surface. Publication approval remains a later runtime decision.

## Head-turn revision requested by user, 2026-09-30

This supersedes the original recommended motion prompt above. Bai Mitko approaches from screen-left;
Tony should turn his head toward screen-left (Tony's own right). No character mirroring or body turn.
The following exact revised prompt was entered and verified in the signed-in Ludo browser,
but has not been submitted. Settings and displayed 15-credit cost remain unchanged. No spend approved.

Create a seamless five-second seated talking loop for Tony Fridge, the large, imposing man in the approved reference. His conversation partner stands off-screen to the LEFT of the image. Start in the supplied resting pose. During the first 0.7 seconds, Tony smoothly turns only his head and gaze toward SCREEN-LEFT, his own right, to face that partner. Hold this readable leftward three-quarter head orientation for most of the loop while animating restrained conversational mouth shapes, gentle chest breathing, and one small confident nod. During the final 0.6 seconds, smoothly return his head and gaze to the exact supplied resting pose for a clean loop boundary. Keep his seated body, shoulders, hips, legs and both hands anchored in their supplied positions throughout. A slight finger movement of one resting hand is allowed. His expression is self-assured and mildly smug, without an exaggerated grin. Preserve the same recognizable face, moustache, body mass, proportions, clothing, colors, silhouette, seated pose, framing, and painted cartoon style. The head must rotate naturally in perspective; do not mirror or flip the character. Fixed camera and scale, isolated character with transparent background. No standing, torso turn, body drift, large arm gestures, drinking action, new props, table or chair painted into the export, background, extra limbs, costume change, or facial redesign.

Prepared prompt screenshot: `ludo-revised-head-turn.jpg` in the durable local folder.
Runtime review must inspect leftward head orientation and whether repeated head turns or a short-line
return to idle appear awkward. Generated motion remains a proposal pending actual-game review.

## Shortened prompt, 2026-09-30

User screenshot exposed the warning text: long prompts cause competing details to be dropped.
The following concise prompt supersedes both earlier drafts and was entered/verified in Ludo:

Seated talking loop, 5 seconds. Tony turns only his head toward screen-left to face an off-screen listener, speaks with clear mouth movements and one small confident nod, then smoothly returns to the starting pose. Keep his body and hands anchored. Preserve the reference character and painted style. Fixed camera, transparent background. No mirroring, body drift or new props.

Animate's warning icon disappeared after shortening. No generation was started; displayed cost remains
15 credits. Existing reference, copied final frame and other settings are unchanged.
Durable local evidence: `ludo-short-prompt.jpg`, `ludo-short-prompt-settings.jpg`,
`ludo-short-prompt-warning-cleared.jpg`. This is prepared-prompt evidence, not a submitted generation.

## Precise compact revision, 2026-09-30

User requested a longer, more precise prompt. A 754-character draft triggered the warning again.
The final 475-character prompt below retains explicit motion phases and supersedes all prior drafts.
Ludo's button changed back to its cost-only tooltip after this revision; no generation was started.

5-second seated talk loop. In the first 0.7s, turn his head and eyes toward SCREEN-LEFT to face an off-screen listener. Hold this three-quarter view while talking with clear mouth shapes, subtle breathing and one confident nod. Return to the exact starting pose in the final 0.6s. Keep body, legs and hands anchored. Preserve his face, build, clothing and painted style. Fixed camera and scale; transparent background. No mirroring, body drift, new props or exaggerated grin.

Exact prepared prompt verified in browser. Settings/cost unchanged (15 credits); spend approval pending.
Evidence: `ludo-precise-prompt-warning-check.jpg` (final prompt) and
`ludo-precise-prompt-settings.jpg` (superseded 754-character draft).

## Approved generation started, 2026-09-30

User replied `yes` to the explicit request to start toni-talk-seated-c01 for15credits.
The agent inspected the exact final475-character prompt, Hydra5s and15-credit cost, then clicked Animate once.
Ludo reports1pending generation and the balance changed from389to374, confirming15credits spent.
No second generation is authorized. Generation/result/export are pending.
Evidence: `ludo-generation-started.jpg`; browser URL https://app.ludo.ai/sprite-generator.

## Generation complete; export blocked, 2026-09-30

Queue returned to0 and a new Tony result appeared. Its details independently show the exact final
475-character submitted prompt. Generated settings were inspected in Adjust Sprite Sheet:
Loop On, Trim Off, maxFrames25, spriteSize384. No settings were changed there.
The result was labeled `toni-talk-seated-c01` through Ludo's label control; saved label verified.
No Fix Loop, new generation, transition or other paid control was activated.
The result panel displays Created Sep30,2026,3:56PM; this is Ludo's display, not a verified timezone.
No unique result ID or share URL is exposed in inspected UI; do not substitute a DOM element ID.
Observed result thumbnail URL: https://storage.googleapis.com/ludo-assets/22bc5504967df73fc7612ca15ba907f5.webp
Generated-result evidence: `ludo-generated-result.jpg` in the durable local folder.

More options > Download Sheet + JSON was invoked once. The browser download-event tool timed out
without returning a file path; no recent ZIP was found in the user's Downloads or Temp folder.
No browser error was logged. Original ZIP is not acquired yet; do not claim import/runtime verification.
The labeled Ludo result is preserved. Next required input is the downloaded ZIP or its actual path;
this authorizes the already planned automatic VPS runtime_review pipeline without another approval.

## Export imported; sustained speaking playback, 2026-09-30

User supplied Downloads/sprite-384px-frames-25-rows-5-cols-5.zip and confirmed that Tony should keep facing the listener throughout speech. This supersedes the earlier export-blocked status.
Original ZIP preserved unchanged; SHA-256: 51469c2e21de203e2aac6be1658ac78e1838dba898d58a9824feaf6761a9dc56.
Export contains 25 untrimmed 768px frames in a 5x5 PNG sheet, with 187ms frame duration.
Runtime derivative uses 384px frames in a 1920px WebP sheet. No additional generation or credits spent.
Visual head-frame inspection: turn in frames 0-3; screen-left speaking view in frames 4-21; return in frames 22-24.
The reusable NPC playback path now plays the initial turn once, repeats frames 4-21 for the remaining speech, and plays frames 22-24 only after speech ends. Pause/menu time is excluded from the return. Another line restarts the speech phase. Mehana only; approved reference, idle and election remain unchanged.
Candidate status: runtime_review; no runtime approval, commit, push or PR.
Focused NPC/Tony/engine tests: 180 passed, 0 failed. Runtime build succeeded.
Initial full npm test: 281 tests, 280 passed, 1 failed, exit 1. Failure: browser-smoke.test.js line 313, campaign pamphlet inventory image was not loaded at the immediate assertion. Isolated rerun pending; no unrelated test or gameplay changes made.
NPC catalog PDF Tony page rendered and inspected; layout and runtime_review label verified.
Actual-game preview blocked: port 5173 serves older files and is owned by ubuntu. Personal ZeShad server status reports not running. ZeShad cannot verify the foreign process checkout or restart it without sudo authorization. Those processes and port 5174 remain untouched. Requested release of port 5173 or the authorized personal service control. No successful runtime recording or review claimed.

## Final automated verification, 2026-09-30

Isolated failed browser journey rerun: 1 passed, 0 failed. The shell wrapper had a quoting error while forwarding its exit status; the actual test summary was clean. A subsequent complete npm test run produced the authoritative clean result: 281 tests, 281 passed, 0 failed, 0 cancelled/skipped/todo; duration 259917ms; process exit 0. Log: npm-test-retry.log.
Workflow review and git diff --check passed. Animation catalogs current: 17 Bai Mitko entries, 11 NPCs, 23 world entries; check exit 0.
Reference/idle SHA-256 unchanged against approved values.
Actual-game visual review remains blocked on personal preview port 5173 ownership; no runtime approval or publication requested while this review is outstanding. No commit/push/PR/merge occurred.


## Conversation-wide head orientation, 2026-10-01

User clarified that Tony must stay facing left for the entire conversation, including reply choices and gaps between lines. This supersedes post-speech return behavior. The renderer uses the active Tony dialogue session to keep a quiet left-facing frame between lines and continue left-facing speech without repeating the introductory turn. Closing the conversation plays return frames 22-24, then the approved idle resumes. Existing source export and exact generation prompt remain unchanged; no new generation or credits.
Focused tests: 181 passed. Actual-game review on port 5173 passed in BG and EN: choices hold frame 4; later speech remains in frames 4-21; return frames occur only after dialogue closes; final image uses approved idle. Preview now runs as ZeShad and serves the updated code. Full regression suite pending. Candidate remains runtime_review, uncommitted and unpublished.

Final conversation-change verification: npm test passed all 282 tests, 0 failures/skips/cancellations; exit 0; duration 219398ms. Animation library consistency check and git diff --check passed. Updated NPC catalog page rendered and visually verified. Actual-game BG/EN review evidence: target/tony-talk-review/conversation-review.json and conversation-hold-bg.png. Human visual approval and publication remain pending.


## Human runtime approval, 2026-10-01

After reviewing the updated conversation-wide head orientation, the user replied "looks good". Runtime visual acceptance recorded as runtime_approved. This approves the visual candidate; commit, push, PR, merge, sync and cleanup remain pending explicit publication approval.
