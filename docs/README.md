# Documentation index

Return to the [project README](../README.md). Start with [PROJECT_RULES.md](../PROJECT_RULES.md) for the working agreement and [AGENTS.md](../AGENTS.md) for architecture/content contracts. This index organizes existing documents; it does not change their authority, move files or approve art.

## How to interpret the documents

- **Working rules and production guides** describe contracts and procedures. Check the relevant current source and approvals before changing content.
- **Design and planning references** describe intended behavior; they are not proof that every item is implemented or approved.
- **Generated catalogs** summarize source/runtime data. Check their freshness and the corresponding candidate records; a PDF or isolated animation preview is not human gameplay approval.
- **Dated reports and experiments** record observations at that time. They can contain superseded pending statements or old test counts; they are not the current task ledger. Reconcile them against source provenance, canonical history and current runtime evidence.
- Personal handbooks, learning logs, credentials and private task/evidence records are intentionally outside this shared index. Do not publish them to make links appear complete.

## Gameplay, writing and design

- [Chapter 1 script](chapter1-script-v1.md) and [gameplay flow](chapter1-gameplay-flow.md): story and interaction references.
- [Humor bible](humor-bible.md): tone and fictionalization.
- [Bulgarian satire intake](bulgarian-satire-intake.md) and [Chapter 1 seed bank](chapter1-satire-seed-bank.md): writing process and inspiration.
- [Content effects](content-effects.md): effect contracts.
- [Intoxication system](intoxication-system.md): gameplay-system reference.

## Art and scene production

- [Visual style bible](visual-style-bible.md), [production graphics plan](production-graphics-plan.md), [art pipeline](art-pipeline.md) and [image prompts](image-prompts.md): style, asset contracts and production references.
- [Raster scene runtime](raster-scene-runtime.md): raster-source/runtime relationship.
- [Stateful scene layers](stateful-scene-layer-workflow.md): layered scene workflow.
- [Runtime art integration](runtime-art-integration.md) and [runtime art coverage](runtime-art-coverage.md): integration process and coverage reference; verify actual current assets before relying on status statements.

## Animation production and evidence

- [Animation direction](animation-direction.md): motion direction and source pipeline.
- [Animation registration](animation-registration-pipeline.md): placement and registration.
- [Ludo animation production workflow](ludo-animation-production-workflow.md): candidate generation, reversible VPS preview, runtime/publication decision and closeout.
- [Ludo evidence template](ludo-animation-evidence-template.md): provenance and verification records.
- [Ludo API pilot](ludo-api-pilot.md): optional native-source transport and guarded paid-submission procedure. Read the separately maintained Telegram manager's current workflow/activation state before using its automation; this index does not authorize spending or a second bootstrap pilot.

## Technical operations

- [Server operations](server-operations.md): foreground/detached preview and deployment utilities. Respect the approved checkout/port boundaries; personal preview is5173, not the 5174 HTTPS shortcuts.
- [Installable web app](installable-web-app.md): installation, caching and offline behavior.
- [HTML HUD and inventory](html-hud-and-inventory.md): interface reference.
- [Package scripts](../package.json) and [CI test workflow](../.github/workflows/test.yml): actual command definitions and browser-test setup.

## Generated catalogs and storyboard viewers

| Reference | Browser view | PDF |
| --- | --- | --- |
| Animation library | [HTML](animation-library-index.html) | [PDF](animation-library-index.pdf) |
| Bai Mitko animation catalog | [HTML](bai-mitko-animation-catalog.html) | [PDF](bai-mitko-animation-catalog.pdf) |
| Chapter 1 NPC animation catalog | [HTML](chapter1-npc-animation-catalog.html) | [PDF](chapter1-npc-animation-catalog.pdf) |
| Chapter 1 world-motion catalog | [HTML](chapter1-world-motion-catalog.html) | [PDF](chapter1-world-motion-catalog.pdf) |
| Chapter 1 visual storyboard | [HTML](chapter1-storyboard.html) | [PDF](chapter-one-visual-storyboard.pdf) |

Storyboard pages illustrate intended production/gameplay direction, not complete runtime coverage. [Rendered storyboard pages](storyboard-pages/) support the existing viewer. Regenerate/review only the relevant catalog when a task changes it; do not rewrite unrelated approved PDFs just to update navigation.

## Dated plans, reviews and earlier experiments

Preserved in place for context and traceability. Their dates and approval statements must be reconciled before treating an old observation as current.

- [Chapter 1 completion plan — 16 September 2026](chapter1-completion-plan-160926.md): detailed planning/dependency reference, not a live completion checklist.
- [Storyboard review — 16 September 2026](chapter1-storyboard-review-160926.md).
- [Mayor office art — 16 September 2026](mayor-office-art-160926.md).
- Satire intake snapshots: [16 September](satire-intake-160926.md), [22 September](satire-intake-220926.md).
- [Chapter 1 browser review — 22 September 2026](chapter1-review-220926.md): historical gameplay/art review; later animation work can supersede its static-NPC observations.
- [FurtherSteps160926.txt](../FurtherSteps160926.txt): existing root planning/checkpoint notes, retained without relocation.
- [Bai Mitko simple animation test](bai-mitko-simple-animation-test.md) and [external-animation benchmark](bai-mitko-external-animation-v1-benchmark.md): earlier test/benchmark context, not approval to restore obsolete art tools or replace approved animation.

For an animation's current status, use its candidate/manifest records under `assets_src/` and the actual reviewed runtime. For an implementation task's published state, verify the canonical PR/commit and retained closeout evidence rather than relying on a dated report or stale chat reply.
