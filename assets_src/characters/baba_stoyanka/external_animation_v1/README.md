# Baba Stoyanka seated idle candidate

Date: 2026-09-30. Branch: `feat/baba-stoyanka-seated-idle`, base `1de06e9`.

The user generated and accepted the Ludo preview, then supplied the source ZIP. Svetozar approved the actual VPS runtime and publication on 2026-09-30 with "approve runtime and publish". This candidate only animates Baba in the village square; the election scene and approved static fallback remain unchanged.

- Label: `bs-idle-seated-c01`.
- Original filename: `sprite-384px-frames-25-rows-5-cols-5.zip`.
- Source ZIP SHA-256: `5c3429e10f96dd974ef4a7609189e8498492e5e38abcc85d916a8efd8fe56501`.
- Runtime WebP SHA-256: `d2acc087aa8e92cf8d9f72ddb7b67a7bd1ef144cb432c2df63c28c5b14e274b5`.
- Approved generation-reference SHA-256: `09df105b2fc11784b8a68aa57bf59e0dd47dae181ad2412a92e439286fb5b7db`.
- ZIP preserved unchanged; 25 frames, 198 ms each, 4950 ms total, 5×5 layout, 768×768 source frames, transparent RGBA.
- Derived atlas: 1920×1920, 384×384 frames, WebP quality 90, alpha quality 100, effort 6. Union alpha bounds (alpha > 8): x132 y95 w119 h193.
- Ludo settings and exact prompt are in `animation-pilot.json`. Result ID was unavailable in supplied evidence and is recorded as null.

## Verification

- `npm run build:scene-layer-runtime`: passed.
- `npm run build:runtime-assets`: passed (77 assets).
- `node tools/build-animation-library.mjs --html-only`: passed.
- `npm run check:animation-catalogs`: passed.
- `git diff --check`: passed.
- `npm run workflow:review`: passed automated checks; human runtime review approved on 2026-09-30.
- Final publication verification: `npm run build:runtime`, `npm run check:animation-catalogs`, and `npm test -- --test-force-exit` passed. All 271 tests passed, including complete Bulgarian/English browser gameplay journeys (201.7 seconds). The earlier apparent hang was additional long-running browser journeys continuing without progress output; the initial candidate-review run was stopped prematurely.
- Dedicated Playwright check on the existing port 5173 service at 1280×720: all 25 frame positions observed across a full loop, 359 draw calls, no page errors or failed HTTP responses. Placement x325 y330 height122 preserved. Local verification evidence was retained under `C:/Users/SveBiS/Desktop/myStuff/2026_GitPro/extraFixes/08_BabaStoyanka/`; the temporary VPS `target/baba-idle-review/` directory was removed after publication.

Review URL: http://51.38.50.3:5173/?play=1&scene=scene.chapter1.village_square

Publication scope: original ZIP, candidate provenance, derived WebP, asset alias, village-square layer animation, generated scene layers, and NPC catalog metadata/HTML. No engine changes.

Published through https://github.com/tran4o/baim/pull/21 (merge commit `c77c054`). Approved cleanup completed for the local and zeshad branches `feat/baba-stoyanka-seated-idle`, `/home/ZeShad/baim/target/baba-idle-review/`, and `/home/ZeShad/baim/target/baba-idle-frame0.png`. Local source/export files are retained.

## Seated talk follow-up

The approved idle above is preserved. Svetozar approved the actual VPS runtime and the reviewed
publication sequence for `bs-talk-seated-c01` on 2026-09-30 by replying "Approval". Its status is
`runtime_approved`. See
[talk-seated-candidate.md](talk-seated-candidate.md) and the Talk entry in `animation-pilot.json`
for its prompt, 15-credit generation evidence, hashes, registration, and review state.
