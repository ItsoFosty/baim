# BAIM Project Rules

This file is the central working agreement for `/home/ZeShad/baim`. Read it before changing the repository. Keep detailed workflow rules here and project-specific game direction in `AGENTS.md` and the linked design documents.

## Repository Boundary

- Work only in `/home/ZeShad/baim` unless the user explicitly names another location.
- Never modify `/home/ubuntu/git/baim` unless the user explicitly approves work in Itso's live checkout.
- Treat existing tracked and untracked changes as user work. Preserve them and stop if they overlap the requested task.
- Do not alter unrelated files, generated assets, approved content, or stable IDs.

## Work Mode Permissions

When operating in Work mode:

- Work may inspect, read, and edit files and run non-destructive commands, builds, and tests inside `/home/ZeShad/baim` without asking conversationally for each small step.
- Work must not touch `/home/ubuntu/git/baim`.
- Work must ask before destructive actions; deleting or overwriting user work; committing; pushing; merging; or rewriting Git history.

## Start Every Session

1. Read `PROJECT_RULES.md`, `AGENTS.md`, `00_START_SESSION.md`, and `docs/Developer-Handbook/PERSONAL_RULES.md`.
2. Check the current branch, working tree, and recent commits before editing.
3. Confirm the task scope, affected files, likely risks, and required verification.
4. Check `docs/Developer-Handbook/13_Daily_Learning_Log.md` for relevant prior lessons.
5. Check that the work is not already owned or underway by Itso, Marto, or another contributor.

## Scope And Implementation

- Keep each task small, focused, reviewable, and easy to revert.
- Plan before editing and explain significant changes, affected files, and risks.
- Make reasonable small implementation decisions when they preserve the approved direction.
- Prefer reusable, data-driven behavior over one-off fixes and Chapter 1 hardcoding.
- Follow the established directory structure and the domain rules in `AGENTS.md`.
- Never rename stable gameplay IDs or replace approved content without explicit approval.
- Do not expand the task, refactor neighboring code, or clean up unrelated files without approval.

## Git And Approval Gates

- `tran4o/baim` is the canonical integration repository.
- `marto/master` is the canonical development base for new work.
- Itso's fork may be used for comparison or collaboration, but do not base new feature work on it unless explicitly requested.
- Never work directly on `master`.
- Use one descriptive task branch per task, normally under `feat/` when appropriate.
- One task should produce one focused pull request.
- Show the user the diff and verification results before asking for final approval.
- Never commit, push, merge, open or modify a pull request, or rewrite history without explicit human approval.
- Recheck the branch and working tree immediately before any approved commit or push.

## Collaboration

- Avoid duplicating work owned by Itso, Marto, or another contributor.
- Announce task ownership before substantial implementation when working in a shared workflow.
- Keep changes easy for another contributor to inspect, test, and revert.
- Record durable workflow lessons in `docs/Developer-Handbook/13_Daily_Learning_Log.md` only when the task calls for it.

## Verification

- Inspect the final diff for scope, accidental changes, secrets, and generated noise.
- Run the smallest relevant checks while developing, then run `npm test` for code changes unless the task clearly does not affect code.
- Run `git diff --check` before presenting work for approval.
- Add or update tests when changing localization, save schema/defaults, geometry, quest state, inventory state, or dialogue effects.
- Verify behavior in the actual runtime when changing visuals or interaction; isolated previews are not sufficient.
- Report any check that could not be run and why.

## Art And Content Safeguards

- Generated art is a proposal, not approved production art.
- Obtain human visual approval before replacing or integrating scene art.
- Preserve approved source assets unless replacement is explicitly requested.
- Follow the art, animation, localization, humor, and satire-intake rules referenced by `AGENTS.md`.
- Keep all player-facing content naturally authored in both Bulgarian and English.

## Communication And Learning

- State assumptions and decision points clearly.
- Explain important architectural and Git choices in plain language so the project owner can learn from the work.
- End each task with the changed files, verification performed, remaining risks, and the exact approval needed for any next step.
