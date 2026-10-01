import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { browserAvailable } from "./helpers/browser-availability.js";

test("available Chromium runs in local and strict environments without skipping", () => {
  for (const env of [{}, { CI: "true" }, { BAIM_REQUIRE_BROWSER_TESTS: "1" }]) {
    assert.equal(browserAvailable({ skip: () => assert.fail("unexpected skip") }, "/browser", { env, exists: () => true }), true);
  }
});
test("missing Chromium fails in CI or explicitly required mode without skipping", () => {
  for (const env of [{ CI: "true" }, { CI: "1" }, { BAIM_REQUIRE_BROWSER_TESTS: "1" }, { BAIM_REQUIRE_BROWSER_TESTS: "true" }]) {
    assert.throws(() => browserAvailable({ skip: () => assert.fail("unexpected skip") }, "/missing", { env, exists: () => false }), /Required browser tests cannot run/);
  }
});
test("optional local missing Chromium produces an explicit skip", () => {
  let reason;
  assert.equal(browserAvailable({ skip: value => { reason = value; } }, "/missing", { env: { CI: "false" }, exists: () => false }), false);
  assert.match(reason, /Playwright Chromium is not installed/);
});
test("CI installs Chromium before tests and all browser journeys use the required guard", () => {
  const workflow = readFileSync(".github/workflows/test.yml", "utf8");
  const install = workflow.indexOf("npx playwright install --with-deps chromium");
  assert.ok(install >= 0 && install < workflow.indexOf("- run: npm test"));
  assert.match(workflow, /BAIM_REQUIRE_BROWSER_TESTS: "1"/);
  const smoke = readFileSync("test/browser-smoke.test.js", "utf8");
  assert.equal((smoke.match(/if \(!browserAvailable\(t, chromium.executablePath\(\)\)\) return;/g) || []).length, 3);
  assert.doesNotMatch(smoke, /t\.skip\(/);
});
