# Tony Fridge seated skeptical reaction

## Current status

`toni-skeptical-seated-c01` is `runtime_approved` and published. Svetozar approved the actual runtime and publication on 2026-10-01, accepting the brief viewer-facing head rotation. [PR #28](https://github.com/tran4o/baim/pull/28) merged after green CI; feature `2ddb0596847e65ca92fc68fb09ada4934bd21855`, merge `bc6973d92fba7a8cd95a1012aec6869821be06bc`. Canonical synchronization, rebuild, BG/EN post-merge verification and approved VPS branch/temp-directory cleanup completed. No animation approval gate remains.

## Source and runtime contract

- Original unchanged [ZIP](input/toni-skeptical-seated-c01.zip): SHA-256 `b6c57a2686d5e0d9654379825ecbcf412fdbb10cd2af855f10dde049b730dc0e`.
- Approved [reference derivative](references/talk-seated-left-frame004.png): SHA-256 `911e8e3bc413dbfed39059f977b27b38cb9eb3f2e99fbf70bbefb9820d8dd587`, extracted from approved talk frame 4.
- [Animation manifest](animation-pilot.json) holds prompt, generation evidence, frame metadata, reference hashes and runtime approval. One approved 9-credit generation; no paid repair/regeneration.
- Runtime asset: `assets/chapter1/characters/tony_fridge/skeptical-seated-v1.webp`; SHA-256 `26bac7a7fdf49c9a453070ef0ecb623207e33591da1b7af1bfbcc2e80d9219ed`.
- Mehana only: `dialogue.tony_fridge` / `challenge_waiting`, reaction `skeptical_glance`; 25 frames at 118 ms, 2.95 seconds, one shot per actual entry.
- Preserve 1280x720, left 861/top 310/height 244/zIndex 35, fixed registration against approved idle. Return to speech or quiet left-facing frame; original turn/return and confident chuckle remain intact. No text, quest/save/election effects or stable ID changes.

## Verification and evidence

Full VPS run: 297 passes, zero failures/skips/cancellations, exit 0. Approval/catalog/playback checks and separate BG/EN post-merge runtime review passed. Historical GitHub master CI passed 292 tests but skipped three browser suites due to missing Chromium; this is not equivalent browser coverage. The complete VPS run covered those suites.

Durable local-only evidence root: `C:/Users/SveBiS/Desktop/myStuff/2026_GitPro/extraFixes/09_TonyFridge/skeptical/`. Its `README.md`, `publication-complete.md`, `vps-review-evidence/` and `cleanup-manifest.md` identify actual completion, logs, visuals and retention/recovery. They are not files in the Git repository.

See [historical preparation audit](skeptical-seated-audit.md) for dated observations. Earlier pending statements are historical, not current status. Production assets and original export remain preserved.
