# Ludo Animation Production Workflow

## Goal

Move one Ludo export from candidate to approved production animation with two human decisions at most:

1. The user chooses to spend credits/generate and download the candidate in Ludo.
2. After viewing the integrated animation on the VPS, the user either rejects it or approves runtime publication.

The normal path is **Ludo export -> VPS feature-branch preview on port 5173 -> one approval to publish and merge**. The obsolete Windows clone is not a staging, preview, or merge environment.

## Review Responsibilities

- The agent reads accessible project files and performs technical review, documentation consistency checks, relative-link validation, builds, tests, evidence verification, and checkout readiness checks. Do not ask the user to copy accessible files or perform routine technical checks on the agent's behalf.
- The user decides artistic intent, visual acceptance at actual game size, credit spending, and publication authorization. Ask for missing access or files only after establishing the specific access limitation; explain what remains unverified.
- Two human decisions are the normal animation path, not a waiver of safety boundaries. Unexpected spending, material scope changes, failed checks, or separately protected actions remain exceptions. Do not add duplicate approvals for already authorized, unchanged work.
- Scope status reports explicitly: publication of an animation does not imply publication of later CI/documentation fixes. Historical audits cannot declare themselves the current authority; link to the current candidate record or evidence index instead.
- Cleanup reports distinguish byte-identical recovery copies from superseded intermediates whose final implementation is preserved but whose exact original bytes may not be recoverable.

## Stage 1: Candidate Generation

### Optional API Pilot

Follow [Ludo API pilot](ludo-api-pilot.md) for private setup and exact command steps. The pilot supports one reviewed character animation at a time, not batches. The agent prepares a no-spend plan and shows reference hashes, prompt/settings, live documented estimate, maximum charge and plan hash. One explicit generation approval authorizes that exact paid request and its automatic collection/Stage 2 preview; it does not authorize publication or another paid attempt.

The API returns native sheet bytes plus grid/duration metadata, not necessarily the website ZIP. Preserve raw responses privately and the unchanged downloaded sheet; label generated atlas/timing metadata as derived. API collection alone is not gameplay implementation: the agent must continue through Stage 2 without another routine approval pause. Preserve the website/manual export route as fallback; never use fallback to generate again without a new spending decision.

- Agree on one animation slot, approved reference asset, prompt, model/settings, and expected runtime scene.
- Give the candidate a stable label before export (for example `bs-idle-seated-c01`), and capture its result ID or result URL while the generation is open. If unavailable, record that explicitly with the reason; never invent an ID.
- Evaluate motion at its actual game size. Preserve an approved idle unless a visible issue warrants revision; choose the next useful slot, such as Talk, as a separate focused task. Low frame rate alone is not a reason to spend credits regenerating approved work.
- Agent-controlled credit spending requires explicit approval before generation.
- Preserve a downloaded website ZIP exactly. For native API output, preserve the unchanged source sheet and raw response; explicitly label derived atlas/timing metadata. Do not rename website ZIP members or re-encode original source sheets.
- Providing the ZIP or its path to the focused task chat authorizes Stage 2. No additional approval is needed to copy and integrate it for preview.

### Export Failure Fallback

- Attempt the completed candidate's free Sheet + JSON export once and wait for the normal download result. If automation fails or times out, check whether that attempt already saved a file, then ask the user to download the same labeled candidate manually and provide its saved ZIP path.
- Do not keep retrying an unverified download mechanism. A different automated recovery may be attempted only after a specific cause and safe remedy are established; record that reason.
- An export failure is not a generation failure. Preserve the completed result, do not regenerate or use paid repair controls, and do not request another spending approval just to export it.

### Manual Phone Generation And Uncertain Controls

- Identify the current screen from the user's screenshot. Do not imply the agent can operate or verify a separate phone browser.
- Treat the full Generate/Animate button, including embedded or overlapping icons, as one generation action unless a separate non-generating control is verified. Never ask the user to tap its warning icon to discover what the warning means.
- Inspect uncertain warnings through a screenshot, visible text, or a separate help/settings surface whose action is known. If the warning cannot be read, say so; do not probe it through the generation button or claim the warning is harmless.
- Before intentional generation, summarize the candidate label, reference, current settings, and displayed credit cost. Make the instruction explicit: "Tapping Animate starts this candidate and spends the displayed credits." Use an already given generation approval when it covers that candidate and cost; do not add a duplicate approval gate.
- Once generation starts, have the user wait for that result. Do not recommend another tap or retry while it is queued/running. If generation starts unexpectedly, record the incident and observed cost, review that result first, and require explicit authorization before a new paid attempt. Do not assume a refund.
- Distinguish the recommended prompt/settings from independently observed or user-confirmed submission evidence in provenance. Capture the result ID/URL when accessible; otherwise record why it is unavailable.

## Stage 2: Automatic VPS Candidate Preview

On the existing focused task branch in `/home/ZeShad/baim`, the agent should continue through all of these steps without conversational approval pauses:

1. Inspect the website ZIP or native API source read-only and validate its image/metadata structure, transparency, frame geometry, timing origin, and hash.
2. Copy the unchanged website ZIP or collected native API source package into the character's `assets_src/.../input/` folder. Do not invent an original ZIP for API output.
3. Record the prompt, tool/model/settings, result ID when available, credits, export filename, source hash, frame metadata, candidate status, and reference hashes.
4. Produce optimized runtime assets without changing the approved source ZIP.
5. Integrate the candidate into the actual scene as `runtime_review`, retaining the approved static/runtime fallback.
6. Build generated runtime data and ignored runtime assets, run focused checks and `npm test`, and run `git diff --check`.
7. Serve or refresh `/home/ZeShad/baim` on port 5173 and provide the direct review URL.
8. Verify the animation in the real 1280x720 game scene, not only as an isolated sprite sheet.

Before step 8, wait for the runtime build to finish successfully, including manifest generation. A running build or HTTP 200 on the scene page is not readiness. Verify served manifest/source parity with the reviewed checkout and each new asset's registration, availability and recorded hash. Start a fresh dialogue entry after readiness: missing-asset fallback may consume a one-shot reaction during an earlier incomplete attempt. Never report that incomplete review as passing.

Keep this work uncommitted and unpublished during review. Do not create a source-only PR when the task is intended to deliver a runnable animation.

## Stage 3: Human Runtime Decision

The user reviews the VPS candidate:

- **Reject or revise:** keep work on the same branch, record the rejection reason, and replace or adjust only the candidate-owned files. Return to Stage 2.
- **Approve:** before asking, show the complete diff, test/build results, remaining risks, PR scope, and exact task branch and temporary files proposed for cleanup.

The exact response `approve runtime and publish`, or equally explicit wording, authorizes the reviewed sequence as one package:

1. Mark the candidate and review record `runtime_approved`.
2. Re-run required builds, tests, and diff checks.
3. Commit the reviewed task.
4. Push the task branch to `zeshad`.
5. Create one PR targeting `tran4o/baim:master`.
6. Wait for required checks and merge only if they pass without material changes.
7. Fast-forward `/home/ZeShad/baim` master to `marto/master`.
8. Rebuild ignored runtime outputs and verify the port 5173 preview from canonical master.
9. Delete only the previously listed merged task branch and task-owned temporary files, then prune references.

Before committing, reconcile all source-art and animation approval records with the user's decision, reviewer, date, and approved scene scope. Verification-only reruns need not repeat checks already passed for identical inputs; approval metadata or generated catalog changes require their relevant freshness checks.

Before cleanup, retain the final test summary, runtime verification, and review images in a durable location documented in the review record. Distinguish retained evidence from deleted temporary files. Local evidence may remain local, but record its actual location and do not imply it is available from the repository.

### Evidence Index And Task Closeout

- Keep one README index at the durable evidence root, using `docs/ludo-animation-evidence-template.md`. Identify the candidate, current status, source/export and runtime hashes, approval/date, PR and feature/merge commits, final test summary/exit status, pre-publication versus post-merge runtime evidence, and exact retained locations.
- Preserve dated review packages as historical snapshots. When publication completes, add a prominent historical banner linking to the evidence index/completion record; do not leave an earlier snapshot labeled as the current pending gate.
- Update the candidate note's current-status section and the evidence index to say whether publication, canonical synchronization, runtime verification, and approved cleanup actually completed. Keep earlier dated observations unchanged; approval alone is not evidence of a successful merge.
- Before removing duplicates, verify their hashes against retained copies or original ZIP members. Retain one final reviewed patch or identify its reproducible Git commit. Remove only explicitly approved extraction copies/intermediate patches, record exact paths and recovery sources in the index, and preserve original ZIPs, provenance, final logs, screenshots/videos, and approved production assets.
- Shared workflow/templates belong under `docs/`; per-candidate prompts/provenance belong beside the character source in `assets_src/`; runtime assets belong under `assets/`. Personal learning notes may remain ignored/local-only. Keep local evidence paths explicit so collaborators do not mistake them for repository files.
- Keep the current README index concise; move chronological preparation/generation history into a separately labeled audit file. Validate file links relative to each document's own folder before publication, including copied review packages. Tracked documentation must not use relative links to screenshots held only on the user's computer; state the explicit local evidence root instead. Keep cleanup manifests separate from immutable hash inventories captured at earlier stages.

When regenerating catalogs, check both HTML and the corresponding PDF for the final animation status. Keep relevant PDF changes; discard only unrelated re-render noise produced by the current task.

## Test Progress And Completion

- Announce the active test phase and elapsed time during long runs; browser journeys may continue quietly for several minutes after the first passing test.
- Inspect configured timeouts, process state, and available logs before diagnosing a hang. Silence alone is not evidence of a stall.
- Let a healthy run finish. Stop only a confirmed stalled task-owned process, and record that run as interrupted/incomplete.
- Require the final suite summary and exit status before claiming the suite passed. Explain any force-exit workaround and verify it did not skip tests; do not use it as a substitute for diagnosing leaked resources.

Stop and request a new decision if checks fail, conflict resolution or material edits are required, the reviewed diff changes, or any action would touch `/home/ubuntu/git/baim`, port 5174, unrelated work, approved production assets outside scope, or Git history.

## Required Evidence

Every accepted animation should preserve, where the available tool provides it:

- original website ZIP and export filename, or unchanged native API sheet plus raw response and explicitly derived metadata;
- SHA-256 source and derived-output hashes;
- prompt, tool, model, settings, result ID, and credits spent;
- frame count, dimensions, timings, duration, sheet layout, and transparency format;
- approved reference asset hashes;
- candidate/rejection status and reason;
- reviewer, approval decision, and date;
- runtime asset path, scene/slot, fallback, placement, and production geometry;
- verification commands and actual-runtime review result.

## Approval Boundaries

No separate approval is required for task-branch creation, candidate file transfer, provenance updates, derived asset generation, runtime-review integration, builds/tests, or starting/refreshing port 5173.

Separate approval is still required for new credit spending, materially expanded scope, replacement of previously approved art outside the task, destructive unrelated cleanup, history rewriting, port 5174, or `/home/ubuntu/git/baim`.
