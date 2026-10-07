import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { chromium } from 'playwright';

async function clickTarget(page, id) {
  const point = await page.evaluate(async id => {
    const { game } = window.__comradeCandidateTest;
    const { findTargetAt } = await import('/src/engine/SceneGeometry.js');
    const points = [];
    for (let y = 80; y < 580; y += 8) for (let x = 16; x < 1260; x += 8) {
      if (findTargetAt(game.currentScene, { x, y }, t => game.targetAvailable(t))?.id === id) points.push({ x, y });
    }
    if (!points.length) throw Error(`No exposed target: ${id}`);
    return points[Math.floor(points.length / 2)];
  }, id);
  await page.locator('#game').click({ position: point });
}

async function useAccordion(page, target, point = null) {
  const before = await page.evaluate(() => window.audioChecks.length);
  await page.locator('[data-item-id="item.accordion"]').click();
  const use = await page.evaluate(() => window.__comradeCandidateTest.game.t('verb.use'));
  await page.locator('.inventory-item-actions').getByRole('button', { name: use, exact: true }).click();
  if (point) await page.locator('#game').click({ position: point });
  else await clickTarget(page, target);
  await page.waitForFunction(count => window.audioChecks.length > count, before, { timeout: 20000 });
  const result = await page.evaluate(async () => {
    await window.lastAudio;
    const { audio, npcSpeechBubble } = window.__comradeCandidateTest.game;
    return { cue: window.audioChecks.at(-1), durations: [...audio.voices].map(v => v.buffer?.duration), state: audio.context.state, gain: audio.master.gain.value, reaction: npcSpeechBubble };
  });
  assert.equal(result.cue.src, 'assets/chapter1/audio/accordion-vivid-v1.wav', target);
  assert.deepEqual(result.durations, [7], target);
  assert.equal(result.state, 'running', target);
  assert.ok(result.gain > 0, target);
  return result;
}

test('accordion recording survives square/mehana round trips, suspension and reload', { timeout: 120000 }, async () => {
  const port = await new Promise(resolve => {
    const socket = createServer(); socket.listen(0, '127.0.0.1', () => {
      const port = socket.address().port; socket.close(() => resolve(port));
    });
  });
  const server = spawn(process.execPath, ['tools/dev-server.mjs'], { env: { ...process.env, PORT: String(port), HTTPS: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let browser;
  try {
    await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
    browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, ignoreHTTPSErrors: true });
    const origin = process.env.ACCORDION_TEST_URL || `http://127.0.0.1:${port}`;
    await page.goto(`${origin}/manifest.webmanifest`);
    await page.evaluate(async () => {
      const oldCache = await caches.open('comrade-candidate-shell-v5');
      await oldCache.put('/src/content/chapter1/audio.js', new Response('old synthesized accordion'));
    });
    await page.goto(`${origin}/?play=1&testHarness=1&scene=scene.chapter1.village_square&walkSpeed=4`);
    await page.evaluate(() => window.__comradeCandidateTest.ready);
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    const cacheKeys = await page.evaluate(() => caches.keys());
    assert.ok(!cacheKeys.includes('comrade-candidate-shell-v5'), 'obsolete code cache removed');
    const instrument = async () => page.evaluate(async () => {
      const { game } = window.__comradeCandidateTest;
      game.inventory.add('item.accordion');
      game.state.flags.ballotBoxRecovered = true;
      game.state.audioEnabled = true;
      await game.audio.setEnabled(true);
      game.audio.setVolume(0.6);
      game.renderUi();
      window.audioChecks = [];
      const play = game.audio.play.bind(game.audio);
      game.audio.play = cue => {
        if (cue) window.audioChecks.push(cue);
        return window.lastAudio = play(cue);
      };
    });
    await instrument();
    for (const language of ['bg', 'en']) {
      await page.evaluate(language => window.__comradeCandidateTest.game.setLanguage(language), language);
      const heard = new Set();
      for (let i = 0; i < 4; i++) {
        const result = await useAccordion(page, 'hotspot.square.old_men_bench',
          i % 2 ? { x: 580, y: 391 } : { x: 514, y: 334 });
        assert.equal(result.reaction.npcId, 'hotspot.square.old_men_bench');
        assert.ok(!heard.has(result.reaction.text), 'shuffle must exhaust all four reactions');
        heard.add(result.reaction.text);
        const bubble = page.locator('.npc-reaction-bubble');
        await bubble.waitFor({ state: 'visible' });
        assert.equal(await bubble.getAttribute('aria-label'), language === 'bg' ? 'Двамата старци' : 'The Two Old Men');
        assert.equal(await bubble.textContent(), result.reaction.text);
      }
      assert.equal(heard.size, 4);
    }
    await useAccordion(page, 'npc.baba_stoyanka');
    await useAccordion(page, 'npc.journalist');
    // After a successful online refresh, offline fallback must retain the new cue.
    const onlineCue = await page.evaluate(async () => (await fetch('/src/content/chapter1/audio.js')).text());
    await page.context().setOffline(true);
    const offlineCue = await page.evaluate(async () => (await fetch('/src/content/chapter1/audio.js')).text());
    assert.ok(onlineCue.includes('accordion-vivid-v1.wav'));
    assert.equal(offlineCue, onlineCue);
    await page.context().setOffline(false);
    // Browsers can suspend an enabled context after an interruption/backgrounding.
    await page.evaluate(() => window.__comradeCandidateTest.game.audio.context.suspend());
    await useAccordion(page, 'npc.baba_stoyanka');
    await clickTarget(page, 'exit.square.to_mehana');
    await page.waitForFunction(() => window.__comradeCandidateTest.game.currentScene.id === 'scene.chapter1.mehana');
    await useAccordion(page, 'npc.tony_fridge');
    await page.evaluate(() => { window.__comradeCandidateTest.game.state.flags.tonyChallengeStarted = true; });
    await useAccordion(page, 'npc.tony_fridge');
    assert.equal(await page.evaluate(() => window.__comradeCandidateTest.game.state.flags.tonyDistracted), true);
    await useAccordion(page, 'npc.mehana_waiter');
    await clickTarget(page, 'exit.mehana.to_square');
    await page.waitForFunction(() => window.__comradeCandidateTest.game.currentScene.id === 'scene.chapter1.village_square');
    await useAccordion(page, 'npc.baba_stoyanka');
    await page.evaluate(() => { window.__comradeCandidateTest.game.state.babaStoyankaVote = true; });
    await useAccordion(page, 'npc.baba_stoyanka');
    await useAccordion(page, 'npc.journalist');
    await page.reload();
    await page.evaluate(() => window.__comradeCandidateTest.ready);
    await instrument();
    await useAccordion(page, 'npc.baba_stoyanka');
    await useAccordion(page, 'npc.journalist');
  } finally {
    await browser?.close();
    server.kill();
  }
});
