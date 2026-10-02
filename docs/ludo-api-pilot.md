# Ludo REST API — one-animation pilot

This development tool replaces website clicking/download transport, not the game renderer or visual approval. It is not a batch generator and never changes production asset selection automatically.

## Status and prerequisites

Tooling can be tested without an account or spending. Live authentication and native output compatibility remain unverified until a private key and one explicitly approved pilot are available. Pro/Studio API access is currently advertised by Ludo; verify your account's API Settings. No real generation is authorized by installing this tool.

Official references: [API guide](https://ludo.ai/developers/api), [OpenAPI schema](https://api.ludo.ai/api-documentation/openapi.json), [API credit/security documentation](https://ludo.ai/docs/api-mcp). Parameters/pricing were checked on 2026-10-01 against schema version 0.9.10. The tool checks current documented pricing again before submission and stops if it changes.

## Private setup — user action once

1. Create a named key in Ludo API Settings, for example `BAIM VPS pilot`. Treat it as a password; do not paste it into chat or a command argument.
2. In your VPS terminal, on the focused feature branch in `/home/ZeShad/baim`, run:

   ```bash
   npm run ludo:api -- setup
   ```

3. Paste the key into the hidden terminal prompt. It validates authentication without generation, then stores the key at `.git/ludo-api/key` with owner-only permissions. Existing keys are never overwritten automatically. Rotation/revocation needs a separate explicit decision.
4. Run `npm run ludo:api -- check`. This validates access; it never starts generation.

Setup/use first probes that the active port-5173 server blocks existing private files. If the older server is running, the tool stops before key entry/storage. The agent checks its exact PID, ZeShad ownership and checkout, then refreshes only that preview. Do not use broad `pkill`, sudo/root, port 5174 or another checkout. Do not enter the key until this protection check passes.

An existing `LUDO_API_KEY` environment variable is also supported. Never put it in a committed file, browser code, shell command history or logs. Private raw responses/job state stay in `.git/ludo-api/` (not served or tracked); signed result URLs are not copied into public provenance.

## Normal per-animation sequence

The agent creates the candidate configuration in task-owned ignored staging, such as `target/ludo-api/candidate.json`. Example structure only; replace the placeholders with an approved reference and its real hash:

```json
{
  "label": "character-reaction-c01",
  "reference": "assets_src/characters/character/external_animation_v1/references/approved.png",
  "referenceSHA256": "REPLACE_WITH_APPROVED_SHA256",
  "sourceDir": "assets_src/characters/character/external_animation_v1/input",
  "motionPrompt": "A restrained seated skeptical glance, then settle back.",
  "model": "hydra",
  "duration": 3,
  "frames": 25,
  "frameSize": 384,
  "loop": false
}
```

Optional `finalReference` and `finalReferenceSHA256` use an approved end-frame PNG. No middle-keyframe, motion-transfer, image editing, audio, pixel-art, paid-upscaling or batch endpoint is implemented. Hydra/Forge only; crop off, Auto margin and prompt augmentation on. Align and review returned art against approved registration; do not assume API settings guarantee matching motion/geometry.

1. Agent: `npm run ludo:api -- plan target/ludo-api/candidate.json`. This reads local reference hashes and public schema, then prints the saved plan hash and estimate. No key or generation required. Existing candidate plans are not overwritten.
2. Agent shows the exact prompt, references, settings, estimate and cap. User explicitly approves one generation with that cap. Example: “Approve character-reaction-c01, one generation, maximum 9 credits.” The CLI cap is a local preflight safeguard, not a server-enforced billing limit; investigate any discrepant actual charge.
3. Only after that approval, agent: `npm run ludo:api -- submit character-reaction-c01 --approve-plan PLAN_SHA256 --max-credits 9`. The tool rejects changed hashes/pricing/references, wrong checkout/branch, and repeat submission. It persists the request ID and an exclusive intent BEFORE its only paid POST. Setup/publication approvals never substitute for this spending approval.
4. Agent: `npm run ludo:api -- collect character-reaction-c01`. Each invocation performs at most one long-poll; respect returned `poll_after_ms`. Repeat free collection as needed while reporting progress. HTTP errors or failed/canceled jobs stop the task; no automatic regeneration or paid POST retry exists.
5. On success, download the original PNG once, validate transparency/grid/duration, and preserve native raw response privately. The tool produces a new source folder containing `spritesheet.png`, `derived-atlas.json` and sanitized `provenance.json`. It never overwrites an existing source package.
6. Agent continues existing Stage 2: inspect source, register/derive runtime art, update candidate provenance/manifests, build, focused/full tests, confirm manifest/source readiness, and review actual 1280x720 gameplay on port 5173. Collection is not a runnable animation and must not be published as a source-only delivery.
7. User reviews actual runtime and approves publication once. Follow the existing bundled publication/merge-if-green/sync/exact-cleanup gates.

## Recovery and evidence

Connection loss preserves the original request ID and any response-header job ID. `collect` looks up existing jobs/results; it does not submit again. If recovery is ambiguous, stop and inspect that same request. Never mint a new label/request to bypass an uncertain or failed paid attempt.

Asset URLs expire after seven days per Ludo documentation. Download promptly. A failed download is not a failed generation: retain the response and retry collection, or obtain that same result manually. Download requests carry no API Authorization header, accept only explicitly allowed HTTPS Ludo/Google-storage hosts, and reject unsafe redirects. Unexpected hosts/schema/content require investigation, not guessing.

API grid/duration metadata does not supply per-frame timestamps. `derived-atlas.json` uses clearly labeled uniform timing from returned total duration. Human runtime review must verify timing, anchor stability, transparency, intro/return behavior and reaction priority before approval. Never claim derived timing is an original Ludo Sheet+JSON export. Original website ZIPs and previously approved assets remain unchanged.

Private state is durable job-recovery evidence, not disposable temp output. Retain it until source/runtime evidence and final publication are verified. List exact cleanup targets and ask before deleting it or rotating a key. Public provenance records actual reported credits (or null if unavailable), request/job IDs, submitted settings, approved reference hashes, downloaded source hash, derived-atlas hash and pending runtime status; never invent generation evidence.

The private response record preserves parsed native job/result fields, not an HTTP byte-for-byte transcript. The original downloaded sheet is preserved byte-for-byte. Do not describe reserialized response JSON or derived atlas JSON as an original website export.

## Verification and limits

Run focused API/security tests, the full browser-enabled `npm test`, `git diff --check` and `npm run workflow:review` before publication. Mock tests prove guards and transport behavior, not a real account, real billing or generation quality. Keep those limitations explicit until the live pilot passes. No engine/gameplay/approved art changes belong in the setup task.
