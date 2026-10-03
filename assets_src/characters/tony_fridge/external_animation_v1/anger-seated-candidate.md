# Tony Fridge seated slow anger

## Current status

Candidate `toni-anger-seated-c01` is `runtime_approved` by Svetozar on 2026-10-03 for task `tony-anger` on branch `feat/tony-fridge-seated-anger`. Actual 1280x720 BG/EN gameplay capture passed on port 5173; the strict final suite passed 329 tests with zero skips or failures. Human runtime approval and publication authorization are recorded by the exact owner Telegram review decision. Canonical merge completion is recorded separately in the shared task. Source and captured evidence are preserved.

## Scope and trigger

The reaction is registered only on actual entry into `dialogue.tony_fridge` node `challenge_deferred`, as data-driven reaction `slow_anger` on `layer.mehana.tony_fridge_seated`. It changes no dialogue text, choices, effects, stable IDs, quests, save data, inventory, background, camera, or election content. Existing talk, chuckle, skeptical and approving-nod animations remain available.

Brief: seated Tony faces screen-left while anger builds slowly through expression and upper body, never snapping; hands, hips and feet remain anchored; he returns to the exact starting pose. Preserve approved identity, geometry and prior animations. No speech, laugh, viewer-facing turn, props, background or camera changes.

## Native API provenance and derived runtime

- This is a native Ludo REST API source package, not a website ZIP. The unchanged native WebP, preserved decoded PNG, provenance and derived atlas metadata remain under `input/toni-anger-seated-c01-api/`.
- Preserved PNG SHA-256: `93d112bf7031e7dc6f2ac10cc8eeef6678962b16c00b584049010a2b67c95d70`. Native WebP SHA-256: `6b8dc9d5a251008a57097d554bdfaea7cb1f7eeed49b4956c46ece969e52852c`.
- The API returned 36 frames in a 6x6 4608x4608 RGBA sheet and total duration `3.9166666666666665` seconds. It did not supply original per-frame timestamps. The runtime's uniform `109 ms` timing is rounded derived timing and must not be described as original export metadata.
- Derived runtime atlas: `assets/chapter1/characters/tony_fridge/anger-seated-v1.webp`, 6x6 at 2304x2304 with 384x384 frames, SHA-256 `e465b951e6adfea679833e1db8b1d9ae0a565177ce37a74b53312edba35425f1`.
- Approved registration remains x116/y91/w152/h198 at scene left 861/top 310/height 244/zIndex 35. Derived alpha content bounds are x113/y92/w156/h199.

## Review gate

The trusted verifier owns browser capture and final full tests. Required review is the actual game at 1280x720 on port 5173 in BG and EN, including entry/reentry, intro wait, menu pause, skip/cancellation, missing-asset behavior, return to speech/quiet pose, scene isolation and preservation of prior reactions. Runtime approval does not claim canonical publication is already complete; verify the shared task and PR completion record.
