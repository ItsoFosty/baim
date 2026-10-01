import { existsSync } from "node:fs";

// Optional local setup may skip; required CI must fail instead of silently
// reporting green without running the browser journeys.
export function browserAvailable(t, executablePath, { env = process.env, exists = existsSync } = {}) {
  if (exists(executablePath)) return true;
  const message = "Playwright Chromium is not installed; run `npx playwright install chromium`";
  const enabled = value => ["1", "true"].includes(String(value).toLowerCase());
  if (enabled(env.CI) || enabled(env.BAIM_REQUIRE_BROWSER_TESTS)) {
    throw new Error(`Required browser tests cannot run. ${message}`);
  }
  t.skip(message);
  return false;
}
