# Другарят Кандидат / Comrade Candidate

A high-resolution, painted 2D point-and-click adventure prototype, currently focused on Chapter 1. Gameplay content is authored in Bulgarian and English; reusable systems support scenes, dialogue, inventory, quests and sprite-sheet animation.

## Start here

- [Project rules](PROJECT_RULES.md): authoritative working agreement, repository boundaries, approvals and publication.
- [Agent instructions](AGENTS.md): architecture, art direction, localization and stable-ID contracts.
- [Documentation index](docs/README.md): production guides, technical references, catalogs and historical reports.

These pages are navigation, not replacements for the linked rules. The approved development checkout is `/home/ZeShad/baim`; verify the environment and ownership before making changes. Personal session helpers, handbooks and learning logs remain local-only and are not copied into the shared project by this guide.

## Development and verification

CI uses Node.js 22; its installation and browser-test steps are recorded in [the test workflow](.github/workflows/test.yml). On an approved development checkout that needs dependency setup:

```bash
npm ci
```

The postinstall step generates runtime animation outputs and metadata; this is not a read-only command. Respect the shared writer lock before installation or builds. Do not reinstall dependencies beneath an active worker merely to follow this example.

Browser tests need Playwright Chromium and its system dependencies. CI installs them with `npx playwright install --with-deps chromium`; installing host dependencies on a shared VPS needs the appropriate administrator authorization. Do not weaken browser checks or change security settings to hide a missing dependency.

Useful verification commands:

```bash
npm run workflow:status
npm test
BAIM_REQUIRE_BROWSER_TESTS=1 npm test
npm run workflow:review
git diff --check
```

The strict browser-test command is POSIX-shell syntax and requires browser availability rather than silently skipping browser suites. Review final summaries and exit codes, not just individual passing tests. Read [runtime integration](docs/runtime-art-integration.md) and [animation registration](docs/animation-registration-pipeline.md) before regenerating assets or catalogs.

## Preview

Use the existing development preview on port **5173**. If no preview is already running and startup is authorized, `npm run dev` starts the development server in the foreground. Open `http://localhost:5173/` on that host, or use your approved forwarded/public preview address.

Do not launch a duplicate server or stop another contributor's process. Port **5174** belongs to Itso's live checkout and is outside this workflow. The `server:https:*` npm shortcuts currently select 5174; do not use them for this personal development preview. See [server operations](docs/server-operations.md) for lifecycle/deployment details, subject to the project boundaries above.

## Repository map

| Location | Responsibility |
| --- | --- |
| `src/engine/` | Reusable game systems and rendering |
| `src/content/chapter1/` | Chapter-specific scenes, dialogue, quests and behavior |
| `src/content/localization/` | Bulgarian and English player-facing text |
| `src/content/art/` | Asset definitions, registration and generated runtime metadata |
| `assets/` | Runtime images, animation assets and app resources |
| `assets_src/` | Original art, approved references, export inputs and provenance |
| `docs/` | Design/production guides, generated references and dated reports |
| `tools/`, `test/`, `.github/workflows/` | Development utilities, regression checks and CI |
| `target/` | Ignored generated outputs and development artifacts |

Some source folders reflect earlier production stages; this map does not authorize moving them. Preserve originals and approved 1280x720 production geometry. Follow [the Ludo production workflow](docs/ludo-animation-production-workflow.md) for candidate integration and human runtime approval.

## Contribution route

Canonical integration is `tran4o/baim`, with new task branches based on `marto/master`. In this development workflow, approved feature branches are pushed to `zeshad` and PRs target `tran4o/baim:master`; game `origin` is not the publication target. Never edit directly on `master` or synchronize a personal fork's master as an incidental task step.

Keep one focused outcome per branch/PR. Commit, push, PR changes, merge and exact cleanup require explicit owner approval; merge only with green checks. Refer to [project rules](PROJECT_RULES.md) for the complete sequence.

The Telegram manager is a separate repository/service, not part of this game checkout. Its task records and secrets must not be added to this repository. No recurring AI checks or paid generation are enabled by these documentation commands.
