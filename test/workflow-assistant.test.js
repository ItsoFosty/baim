import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import {
  LUDO_PUBLISH_APPROVAL,
  approvalGuidance,
  changedPathsFromStatus,
  classifyWorkflow,
  collectReviewPaths,
  isHistoricalDocument,
  inspectRepository,
  reviewRequirements
} from "../tools/workflow-assistant.mjs";

test("workflow assistant blocks a dirty master checkout", () => {
  const result = classifyWorkflow({ branch: "master", dirty: true });
  assert.equal(result.state, "blocked");
  assert.match(result.next, /STOP/);
});

test("workflow assistant guides a clean canonical master toward a focused task", () => {
  const result = classifyWorkflow({ branch: "master", dirty: false, ahead: 0, behind: 0 });
  assert.equal(result.state, "ready");
  assert.match(result.next, /focused chat/);
});

test("workflow assistant detects an in-progress task branch", () => {
  const result = classifyWorkflow({ branch: "feat/tony-animation-pilot", dirty: true });
  assert.equal(result.state, "in-progress");
  assert.match(result.next, /workflow:review/);
});

test("workflow assistant distinguishes local and published commits", () => {
  assert.equal(classifyWorkflow({ branch: "feat/example", dirty: false, ahead: 1, upstream: "marto/master" }).state, "committed-local");
  assert.equal(classifyWorkflow({ branch: "feat/example", dirty: false, ahead: 1, upstream: "zeshad/feat/example" }).state, "published");
});

test("review requirements flag visual and Ludo-sensitive changes", () => {
  const result = reviewRequirements([
    "assets_src/characters/bai_mitko/external_animation_v1/example.zip",
    "assets/chapter1/characters/bai_mitko/example.webp"
  ]);
  assert.deepEqual(result, { visual: true, ludo: true, code: false });
});

test("review requirements recognize code without forcing visual review", () => {
  const result = reviewRequirements(["src/engine/Game.js", "test/engine.test.js"]);
  assert.deepEqual(result, { visual: false, ludo: false, code: true });
});

test("Git status parsing preserves filenames for unstaged changes", () => {
  assert.deepEqual(changedPathsFromStatus(" M PROJECT_RULES.md\0?? tools/example.mjs\0"), [
    "PROJECT_RULES.md",
    "tools/example.mjs"
  ]);
});

test("Ludo guidance removes intermediate approval pauses before VPS preview", () => {
  const guidance = approvalGuidance({ ludo: true }).join("\n");
  assert.match(guidance, /VPS preview on port 5173 without intermediate approval pauses/);
  assert.match(guidance, new RegExp(LUDO_PUBLISH_APPROVAL));
  assert.match(guidance, /merge-if-green/);
  assert.match(guidance, /exact listed task cleanup/);
});

test("non-Ludo guidance retains explicit Git and destructive cleanup approval", () => {
  const guidance = approvalGuidance().join("\n");
  assert.match(guidance, /approval remains required before commit/);
  assert.match(guidance, /may be bundled/);
});

const animationRoot = "assets_src/characters/bai_mitko/external_animation_v1/";
const historyPaths = [
  animationRoot + "historical/look-east-c02-production-notes.json",
  animationRoot + "look-into-distance-source-history.md"
];
const preservedSnapshots = (path) => [readFileSync(path)];

test("PR39 preserved historical snapshots are documentation only", () => {
  for (const path of historyPaths) assert.equal(isHistoricalDocument(path), true);
  assert.deepEqual(reviewRequirements(historyPaths), { visual: false, ludo: false, code: false });
});

test("historical exceptions fail closed for changed, staged, missing or ambiguous documents", () => {
  for (const path of historyPaths) {
    const original = readFileSync(path);
    for (const reader of [
      () => [Buffer.concat([original, Buffer.from("changed")])],
      () => [original, Buffer.from("changed staged bytes")],
      () => [],
      () => { throw new Error("unreadable"); }
    ]) {
      assert.equal(isHistoricalDocument(path, reader), false);
      const result = reviewRequirements([path], reader);
      assert.equal(result.visual, true);
      assert.equal(result.ludo, true);
    }
    assert.equal(isHistoricalDocument("./" + path, preservedSnapshots), false);
    assert.equal(isHistoricalDocument(path.toUpperCase(), preservedSnapshots), false);
  }
});

test("active configuration, original exports, art and prompts keep existing safeguards", () => {
  for (const suffix of [
    "external-animation-selection.json", "animation-catalog-metadata.json",
    "animation-production-notes.json", "historical/new-note.json",
    "historical/active-selection.json", "historical/source-history.md",
    "historical/original.zip", "input/original.zip", "historical/sheet.png",
    "current-art-prompt.md", "prompt.txt"
  ]) {
    const result = reviewRequirements([animationRoot + suffix]);
    assert.equal(result.visual, true, suffix);
    assert.equal(result.ludo, true, suffix);
    assert.equal(result.code, suffix.endsWith(".json"), suffix);
  }
  assert.deepEqual(reviewRequirements(["assets/chapter1/characters/example.webp"]),
    { visual: true, ludo: false, code: false });
  assert.deepEqual(reviewRequirements(["src/content/art/externalAnimationV1.generated.js"]),
    { visual: false, ludo: false, code: true });
});

test("mixed historical documentation and art or code diffs retain safeguards", () => {
  assert.deepEqual(reviewRequirements([...historyPaths, animationRoot + "input/new.zip"]),
    { visual: true, ludo: true, code: false });
  assert.deepEqual(reviewRequirements([...historyPaths, animationRoot + "external-animation-selection.json"]),
    { visual: true, ludo: true, code: true });
  assert.deepEqual(reviewRequirements([...historyPaths, "src/engine/Game.js"]),
    { visual: false, ludo: false, code: true });
});

test("NUL status parsing preserves both rename paths and literal unusual filenames", () => {
  assert.deepEqual(changedPathsFromStatus(
    "R  docs/source-history.md\0" + animationRoot + "current-art-prompt.md\0" +
    "?? assets_src/new folder/sheet -> final\nname.png\0"),
    ["docs/source-history.md", animationRoot + "current-art-prompt.md",
      "assets_src/new folder/sheet -> final\nname.png"]);
});

test("real Git status expands untracked directories and review collects committed rename sources", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "baim-workflow-review-"));
  const oldCwd = process.cwd();
  t.after(() => { process.chdir(oldCwd); rmSync(directory, { recursive: true, force: true }); });
  process.chdir(directory);
  const git = (...args) => {
    const result = spawnSync("git", args, { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout;
  };
  git("init", "-q");
  git("config", "user.email", "fixture@example.invalid");
  git("config", "user.name", "Workflow fixture");
  mkdirSync(animationRoot, { recursive: true });
  writeFileSync(animationRoot + "current-art-prompt.md", "active prompt");
  git("add", ".");
  git("commit", "-qm", "fixture base");
  git("update-ref", "refs/remotes/marto/master", "HEAD");
  mkdirSync("docs");
  git("mv", animationRoot + "current-art-prompt.md", "docs/archived-note.md");
  git("commit", "-qm", "fixture rename");
  mkdirSync(animationRoot + "new untracked", { recursive: true });
  writeFileSync(animationRoot + "new untracked/source sheet.png", "fixture");
  writeFileSync(animationRoot + "new untracked/settings.json", "{}");
  const { changedPaths } = inspectRepository();
  assert.deepEqual(changedPaths.sort(), [
    animationRoot + "new untracked/settings.json",
    animationRoot + "new untracked/source sheet.png"
  ]);
  const paths = collectReviewPaths({ changedPaths });
  assert.ok(paths.includes(animationRoot + "current-art-prompt.md"));
  assert.ok(paths.includes("docs/archived-note.md"));
  assert.deepEqual(reviewRequirements(paths), { visual: true, ludo: true, code: true });
});

test("real document reads reject hidden staged edits, missing files and non-file paths", (t) => {
  const path = historyPaths[0];
  const original = readFileSync(path);
  const directory = mkdtempSync(join(tmpdir(), "baim-historical-snapshots-"));
  const oldCwd = process.cwd();
  t.after(() => { process.chdir(oldCwd); rmSync(directory, { recursive: true, force: true }); });
  process.chdir(directory);
  mkdirSync(join(animationRoot, "historical"), { recursive: true });
  writeFileSync(path, original);
  assert.equal(isHistoricalDocument(path), false, "Git inspection failure is not an exception");
  const git = (...args) => {
    const result = spawnSync("git", args, { encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  };
  git("init", "-q");
  assert.equal(isHistoricalDocument(path), true, "unchanged untracked archive");
  git("add", path);
  assert.equal(isHistoricalDocument(path), true, "unchanged indexed archive");
  writeFileSync(path, Buffer.concat([original, Buffer.from("changed staged bytes")]));
  git("add", path);
  writeFileSync(path, original);
  assert.equal(isHistoricalDocument(path), false, "worktree cannot hide indexed changes");
  assert.deepEqual(reviewRequirements([path]), { visual: true, ludo: true, code: true });
  unlinkSync(path);
  assert.equal(isHistoricalDocument(path), false, "deleted archive");
  mkdirSync(path);
  assert.equal(isHistoricalDocument(path), false, "directory at registered file path");
});
