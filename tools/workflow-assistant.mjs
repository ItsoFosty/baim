import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export const EXPECTED_ROOT = "/home/ZeShad/baim";
export const EXPECTED_REMOTE = "https://github.com/tran4o/baim.git";
export const LUDO_PUBLISH_APPROVAL = "approve runtime and publish";

function runGit(args, { allowFailure = false } = {}) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (!allowFailure && result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `git ${args.join(" ")} failed`).trim());
  }
  return {
    ok: result.status === 0,
    stdout: (result.stdout || "").trimEnd(),
    stderr: (result.stderr || "").trim()
  };
}

function parseAheadBehind(value) {
  const [ahead = 0, behind = 0] = value.split(/\s+/).map(Number);
  return { ahead, behind };
}

export function changedPathsFromStatus(status) {
  return status
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(3).split(" -> ").at(-1));
}

export function classifyWorkflow({ branch, dirty, ahead = 0, behind = 0, upstream = "" }) {
  if (branch === "master" && dirty) {
    return {
      state: "blocked",
      next: "STOP: master has working-tree changes. Preserve them and investigate before doing anything else."
    };
  }
  if (branch === "master" && behind > 0) {
    return {
      state: "sync-needed",
      next: "Fast-forward local master to marto/master before creating a task branch."
    };
  }
  if (branch === "master") {
    return {
      state: "ready",
      next: "Choose one outcome in the BAIM development hub, open a focused chat, then create its task branch."
    };
  }
  if (dirty) {
    return {
      state: "in-progress",
      next: "Continue the focused task. Before approval, run npm run workflow:review."
    };
  }
  if (ahead === 0) {
    return {
      state: "branch-ready",
      next: "The task branch is clean with no commits ahead of marto/master. Confirm scope, then begin implementation."
    };
  }
  if (upstream.startsWith("zeshad/")) {
    return {
      state: "published",
      next: "The task branch is published. Check the PR/CI state; merging remains a human action."
    };
  }
  return {
    state: "committed-local",
    next: "Local commits exist. Push or create a PR only after explicit approval."
  };
}

export function reviewRequirements(paths) {
  const visual = paths.some((path) => /(^|\/)(assets|assets_src)\/|\.(png|webp|jpe?g|gif|svg)$/i.test(path));
  const ludo = paths.some((path) => /ludo|external_animation|animation-catalog-metadata|animation-library-metadata/i.test(path));
  const code = paths.some((path) => /\.(?:js|mjs|cjs|json|css|html)$/i.test(path) || path === "package.json");
  return { visual, ludo, code };
}

export function approvalGuidance({ ludo = false } = {}) {
  if (ludo) {
    return [
      "Providing the Ludo export authorizes candidate integration and VPS preview on port 5173 without intermediate approval pauses.",
      `After VPS visual review, ask once for '${LUDO_PUBLISH_APPROVAL}' to bundle runtime approval, commit, push, PR creation, merge-if-green, VPS sync, and the exact listed task cleanup.`
    ];
  }
  return [
    "Human approval remains required before commit, push, PR changes, merge, or destructive cleanup.",
    "Related Git actions may be bundled when the exact sequence and cleanup targets are shown before approval."
  ];
}

function inspectRepository() {
  const root = runGit(["rev-parse", "--show-toplevel"]).stdout;
  const remote = runGit(["remote", "get-url", "marto"], { allowFailure: true }).stdout;
  const branch = runGit(["branch", "--show-current"]).stdout;
  const upstream = runGit(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], { allowFailure: true }).stdout;
  const status = runGit(["status", "--porcelain=v1"]).stdout;
  const comparison = runGit(["rev-list", "--left-right", "--count", "HEAD...marto/master"], { allowFailure: true });
  const { ahead, behind } = comparison.ok ? parseAheadBehind(comparison.stdout) : { ahead: 0, behind: 0 };
  return {
    root,
    remote,
    branch,
    upstream,
    status,
    dirty: Boolean(status),
    ahead,
    behind,
    changedPaths: changedPathsFromStatus(status)
  };
}

function validateEnvironment(info) {
  const problems = [];
  if (info.root !== EXPECTED_ROOT) problems.push(`repository root must be ${EXPECTED_ROOT}`);
  if (info.remote !== EXPECTED_REMOTE) problems.push(`marto remote must be ${EXPECTED_REMOTE}`);
  return problems;
}

function printSummary(info) {
  console.log("BAIM workflow status");
  console.log(`Repository: ${info.root}`);
  console.log(`Branch: ${info.branch || "detached"}`);
  console.log(`Upstream: ${info.upstream || "none"}`);
  console.log(`Working tree: ${info.dirty ? "changed" : "clean"}`);
  console.log(`Compared with marto/master: ${info.ahead} ahead, ${info.behind} behind`);
}

function collectReviewPaths(info) {
  const committed = runGit(["diff", "--name-only", "marto/master...HEAD"], { allowFailure: true }).stdout;
  return [...new Set([...info.changedPaths, ...committed.split("\n").filter(Boolean)])].sort();
}

function runStatus(info) {
  const result = classifyWorkflow(info);
  console.log(`State: ${result.state}`);
  console.log(`Next: ${result.next}`);
  console.log("Human gates remain required for visual approval and Ludo credit spending.");
  console.log("Commit, push, PR, merge-if-green, synchronization, and exact task cleanup may use one explicit bundled approval.");
  if (result.state === "blocked") process.exitCode = 1;
}

function runReview(info) {
  if (info.branch === "master") {
    console.error("STOP: review must run on a focused task branch, not master.");
    process.exitCode = 1;
    return;
  }

  const workingCheck = runGit(["diff", "--check"], { allowFailure: true });
  const committedCheck = runGit(["diff", "--check", "marto/master...HEAD"], { allowFailure: true });
  if (!workingCheck.ok || !committedCheck.ok) {
    console.error(workingCheck.stderr || workingCheck.stdout || committedCheck.stderr || committedCheck.stdout);
    console.error("STOP: git diff --check failed.");
    process.exitCode = 1;
    return;
  }

  const paths = collectReviewPaths(info);
  const requirements = reviewRequirements(paths);
  console.log("Changed files:");
  for (const path of paths) console.log(`- ${path}`);
  if (!paths.length) console.log("- none");
  console.log("Automated check: git diff --check passed.");
  console.log("Remaining review:");
  if (requirements.code) console.log("- Run the smallest relevant checks, then npm test before commit approval.");
  else console.log("- Application tests are optional for documentation-only changes; explain why if skipped.");
  if (requirements.visual) console.log("- Verify the result in the actual runtime and obtain human visual approval.");
  if (requirements.ludo) {
    console.log("- Capture the stable candidate label and result ID/URL when available; document unavailable evidence explicitly.");
    console.log("- Reconcile approval status/date across source prompts, animation manifests, and review notes before publication.");
    console.log("- Verify matching HTML/PDF catalog state and retain final runtime/test evidence before temporary-file cleanup.");
    console.log("- Quiet browser tests may still be running: inspect elapsed time, process state, and timeout; require the final summary and exit status.");
    console.log("- Preserve the original website ZIP or native API source/response; record prompt, model/settings, source hash, request/job/result ID, credits, candidate status, rejection reason, approval, and timing origin. API setup is not spending approval; see docs/ludo-api-pilot.md.");
    console.log("- Run npm run build:runtime and npm run check:animation-catalogs.");
    console.log("- Integrate the uncommitted candidate as runtime_review and verify it in the VPS game on port 5173; do not use the Windows clone or a source-only PR.");
  }
  console.log("- Show the final diff and verification results.");
  for (const line of approvalGuidance({ ludo: requirements.ludo })) console.log(`- ${line}`);
}

function main() {
  const command = process.argv[2] || "status";
  if (!["status", "review"].includes(command)) {
    console.error("Usage: node tools/workflow-assistant.mjs <status|review>");
    process.exitCode = 1;
    return;
  }

  let info;
  try {
    info = inspectRepository();
  } catch (error) {
    console.error(`STOP: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  printSummary(info);
  const problems = validateEnvironment(info);
  if (problems.length) {
    for (const problem of problems) console.error(`ERROR: ${problem}`);
    console.error("STOP: environment verification failed; do not edit files.");
    process.exitCode = 1;
    return;
  }

  if (command === "review") runReview(info);
  else runStatus(info);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) main();
