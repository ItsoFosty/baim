import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { chromium } from "playwright";

test("phone controls, dialogue, ending room view and audio output work in Chromium", { timeout: 120000 }, async () => {
  const port = await new Promise(resolve => {
    const socket = createServer();
    socket.listen(0, "127.0.0.1", () => {
      const port = socket.address().port;
      socket.close(() => resolve(port));
    });
  });
  const server = spawn(process.execPath, ["tools/dev-server.mjs"], {
    env: { ...process.env, PORT: String(port), HTTPS: "0" }, stdio: ["ignore", "pipe", "pipe"]
  });
  let browser;
  try {
    await new Promise((resolve, reject) => { server.stdout.once("data", resolve); server.once("error", reject); });
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ serviceWorkers: "block" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    const origin = `http://127.0.0.1:${port}`;
    await page.goto(`${origin}/?play=1&testHarness=1&review=election`);
    await page.evaluate(() => window.__comradeCandidateTest.ready);
    for (const [width, height] of [[320,568], [390,844], [640,360], [844,390]]) {
      await page.setViewportSize({ width, height });
      for (const language of ["bg", "en"]) {
        await page.evaluate(language => {
          const { game } = window.__comradeCandidateTest;
          game.dialogue.close();
          game.setLanguage(language);
          for (const id of Object.keys(game.content.items)) game.inventory.add(id);
          game.renderUi();
        }, language);
        const controls = await page.locator(".top-bar button").evaluateAll(nodes => nodes.map(node => {
          const r = node.getBoundingClientRect();
          return { x:r.x, y:r.y, width:r.width, height:r.height, font:parseFloat(getComputedStyle(node).fontSize) };
        }));
        for (const r of controls) {
          assert.ok(r.height >= 43.9 && r.font >= 15, `${width}x${height} ${language}: touch size`);
          assert.ok(r.x >= -0.1 && r.y >= -0.1 && r.x + r.width <= width + 0.1, "control within viewport");
        }
        // The end of a full inventory must remain reachable by horizontal scrolling.
        const lastItem = page.locator(".inventory-item").last();
        await lastItem.scrollIntoViewIfNeeded();
        await lastItem.click();
        const closeLabel = await page.evaluate(() => window.__comradeCandidateTest.game.t("ui.inventory.close"));
        await page.locator(".inventory-item-actions").getByRole("button", { name:closeLabel, exact:true }).click();
        assert.equal(await page.locator(".inventory-item-actions").count(), 0);
        await page.evaluate(() => {
          const { game } = window.__comradeCandidateTest;
          game.dialogue.start(game.currentScene.npcs.find(npc => npc.id === "npc.mayor").dialogueId);
          game.renderUi();
        });
        const line = page.locator(".compact-dialogue-line");
        assert.ok(await line.isVisible());
        assert.ok((await line.textContent()).trim().length > 20);
        const choices = page.locator(".dialogue-choice-list button");
        assert.ok(await choices.count());
        for (const choice of await choices.all()) {
          await choice.scrollIntoViewIfNeeded();
          const box = await choice.boundingBox();
          assert.ok(box.height >= 43.9 && box.y >= 0 && box.y + box.height <= height + 0.1);
        }
        await choices.last().click();
      }
    }
    for (const ending of ["convincing_win", "narrow_win", "loss"]) {
      await page.goto(`${origin}/?play=1&testHarness=1&review=${ending}`);
      await page.evaluate(() => window.__comradeCandidateTest.ready);
      const before = await page.evaluate(() => JSON.stringify(window.__comradeCandidateTest.game.state));
      await page.locator(".ending-scene-toggle").click();
      assert.equal(await page.locator(".ending-panel-collapsed").count(), 1);
      await page.locator("#game").click({ position: { x:150, y:150 } });
      await page.locator(".ending-scene-toggle").click();
      assert.equal(await page.locator(".ending-panel-collapsed").count(), 0);
      assert.equal(await page.evaluate(() => JSON.stringify(window.__comradeCandidateTest.game.state)), before);
    }

    // Render real Web Audio graphs, including the shared mute/volume output.
    const audio = await page.evaluate(async () => {
      const { AudioSystem } = await import("/src/engine/AudioSystem.js");
      async function render({ cue, ambience, muted = false, volume = 0.6 }) {
        const system = new AudioSystem();
        const context = system.context = new OfflineAudioContext(1, 48000, 48000);
        system.master = context.createGain();
        system.master.gain.value = 0;
        system.master.connect(context.destination);
        system.enabled = true;
        system.setVolume(volume);
        if (cue) system.play(cue);
        if (ambience) {
          system.setAmbience(ambience);
          const first = system.ambient;
          system.setAmbience(ambience);
          if (system.ambient !== first) throw Error("ambient loop restarted for unchanged state");
        }
        if (muted) await system.setEnabled(false);
        const result = await context.startRendering();
        const samples = result.getChannelData(0);
        const rms = Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);
        system.setAmbience(null);
        return { rms, remainingVoices: system.voices.size, stopped: system.ambient === null };
      }
      const heard = [];
      for (const foley of ["paper", "glass", "water", "wood", "stamp"]) heard.push(await render({ cue:{foley,duration:0.4} }));
      for (const ambience of [{noise:{cutoff:600},volume:0.06}, {frequency:100,volume:0.02}]) heard.push(await render({ ambience }));
      return {
        heard,
        muted: await render({cue:{foley:"paper"}, ambience:{noise:{cutoff:600}}, muted:true}),
        zero: await render({cue:{foley:"glass"}, volume:0})
      };
    });
    for (const output of audio.heard) {
      assert.ok(output.rms > 0.00001 && output.rms < 0.15);
      assert.equal(output.remainingVoices, 0);
      assert.equal(output.stopped, true);
    }
    assert.equal(audio.muted.rms, 0);
    assert.equal(audio.zero.rms, 0);
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    server.kill();
  }
});
