import test from "node:test";
import assert from "node:assert/strict";
import {
  LUDO_PUBLISH_APPROVAL,
  approvalGuidance,
  changedPathsFromStatus,
  classifyWorkflow,
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
  assert.deepEqual(changedPathsFromStatus(" M PROJECT_RULES.md\n?? tools/example.mjs"), [
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
