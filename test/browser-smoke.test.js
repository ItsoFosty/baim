import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

test("browser completes the required Chapter 1 path and restores the ending after reload", { timeout: 60_000 }, async (t) => {
  if (!existsSync(chromium.executablePath())) {
    t.skip("Playwright Chromium is not installed; run `npx playwright install chromium`");
    return;
  }

  const port = await availablePort();
  const server = spawn(process.execPath, ["tools/dev-server.mjs"], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let serverOutput = "";
  server.stdout.on("data", (chunk) => { serverOutput += chunk; });
  server.stderr.on("data", (chunk) => { serverOutput += chunk; });

  let browser;
  try {
    await waitForServer(`http://127.0.0.1:${port}/`);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      serviceWorkers: "block"
    });
    const page = await context.newPage();
    const url = `http://127.0.0.1:${port}/?play=1&testHarness=1`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.__comradeCandidateTest.ready);

    const initial = await page.evaluate(() => {
      const { game } = window.__comradeCandidateTest;
      return {
        sceneId: game.currentScene.id,
        inventory: [...game.state.inventory],
        completedQuests: [...game.state.completedQuests],
        chapter1Completed: game.state.chapter1Completed
      };
    });
    assert.deepEqual(initial, {
      sceneId: "scene.chapter1.apartment",
      inventory: [],
      completedQuests: [],
      chapter1Completed: false
    });

    const beforeInterview = await page.evaluate(async () => {
      const { game } = window.__comradeCandidateTest;
      const find = (entries, id) => entries.find((entry) => entry.id === id);

      game.takeTarget(find(game.currentScene.interactables, "hotspot.apartment.unpaid_bills"));
      await game.changeScene("scene.chapter1.village_square");
      game.takeTarget(find(game.currentScene.interactables, "hotspot.square.empty_envelope"));
      game.useInventoryItemOnItem("item.unpaid_bills", "item.empty_envelope");

      await game.changeScene("scene.chapter1.municipality");
      game.useInventoryItemOnTarget(
        "item.fake_diploma",
        find(game.currentScene.npcs, "npc.municipality_clerk")
      );
      game.takeTarget(find(game.currentScene.interactables, "hotspot.municipality.stamp_desk"));
      game.useInventoryItemOnTarget(
        "item.municipality_stamp",
        find(game.currentScene.interactables, "hotspot.municipality.candidate_register")
      );
      game.useTarget(find(game.currentScene.interactables, "hotspot.municipality.archive_cabinet"));

      await game.changeScene("scene.chapter1.mehana");
      game.useTarget(find(game.currentScene.interactables, "hotspot.mehana.cellar_hatch"));
      game.takeTarget(find(game.currentScene.interactables, "hotspot.mehana.ballot_box"));

      await game.changeScene("scene.chapter1.village_square");
      game.selectedVerb = "talk";
      game.performTargetAction(find(game.currentScene.npcs, "npc.journalist"));
      return {
        sceneId: game.currentScene.id,
        hasFakeDiploma: game.inventory.has("item.fake_diploma"),
        hasBallotBox: game.inventory.has("item.ballot_box"),
        completedQuests: [...game.state.completedQuests]
      };
    });
    assert.equal(beforeInterview.sceneId, "scene.chapter1.village_square");
    assert.equal(beforeInterview.hasFakeDiploma, true);
    assert.equal(beforeInterview.hasBallotBox, true);
    assert.ok(beforeInterview.completedQuests.includes("quest.chapter1.fake_diploma"));
    assert.ok(beforeInterview.completedQuests.includes("quest.chapter1.ballot_box"));

    const choices = page.locator(".dialogue-choice-list button");
    for (let step = 0; step < 4; step += 1) {
      await choices.first().click();
    }

    const gate = await page.evaluate(() => {
      const { game } = window.__comradeCandidateTest;
      const electionExit = game.currentScene.exits.find((entry) => entry.id === "exit.square.to_election_booth");
      return {
        journalistInterviewCompleted: game.state.journalistInterviewCompleted,
        journalistQuestCompleted: game.state.completedQuests.includes("quest.chapter1.journalist"),
        electionExitAvailable: game.targetAvailable(electionExit)
      };
    });
    assert.deepEqual(gate, {
      journalistInterviewCompleted: true,
      journalistQuestCompleted: true,
      electionExitAvailable: true
    });

    await page.evaluate(async () => {
      const { game } = window.__comradeCandidateTest;
      game.dialogue.close();
      await game.changeScene("scene.chapter1.election_booth");
      game.selectedVerb = "use";
      game.renderUi();
    });
    page.once("dialog", (dialog) => dialog.accept());
    await page.evaluate(() => {
      const { game } = window.__comradeCandidateTest;
      const table = game.currentScene.interactables.find(
        (entry) => entry.id === "hotspot.election_booth.commission_table"
      );
      game.performTargetAction(table);
    });

    await page.locator('.ending-panel[data-ending-id="ending.chapter1.loss"]').waitFor();
    const saved = JSON.parse(await page.evaluate(() => (
      localStorage.getItem("comrade-candidate.save.v1")
    )));
    assert.equal(saved.chapter1Completed, true);
    assert.equal(saved.endingId, "ending.chapter1.loss");
    assert.equal(saved.currentSceneId, "scene.chapter1.election_booth");
    assert.equal(saved.ballotBoxDelivered, true);
    assert.equal(saved.inventory.includes("item.ballot_box"), false);
    assert.ok(saved.completedQuests.includes("quest.chapter1.main"));

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.evaluate(() => window.__comradeCandidateTest.ready);
    await page.locator('.ending-panel[data-ending-id="ending.chapter1.loss"]').waitFor();
    const restored = await page.evaluate(() => {
      const { game } = window.__comradeCandidateTest;
      return {
        sceneId: game.currentScene.id,
        endingId: game.state.endingId,
        chapter1Completed: game.state.chapter1Completed,
        ballotBoxDelivered: game.state.ballotBoxDelivered
      };
    });
    assert.deepEqual(restored, {
      sceneId: "scene.chapter1.election_booth",
      endingId: "ending.chapter1.loss",
      chapter1Completed: true,
      ballotBoxDelivered: true
    });
  } catch (error) {
    error.message += `\nDev server output:\n${serverOutput}`;
    throw error;
  } finally {
    await browser?.close();
    if (server.exitCode === null) server.kill("SIGTERM");
    await new Promise((resolve) => {
      if (server.exitCode !== null) resolve();
      else server.once("exit", resolve);
    });
  }
});

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  return port;
}

async function waitForServer(url) {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The child process is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Timed out waiting for ${url}`);
}
