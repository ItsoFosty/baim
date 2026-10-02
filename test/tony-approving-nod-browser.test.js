import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { createServer } from 'node:net';
import path from 'node:path';
import { chromium } from 'playwright';
import { browserAvailable } from './helpers/browser-availability.js';

test('Tony approving nod renders in the actual BG/EN preview with retained evidence', { timeout: 90000 }, async t => {
  if (!browserAvailable(t, chromium.executablePath())) return;
  const root = process.cwd();
  const out = path.join(root, 'target/ludo-review/tony-approve', `verified-${Date.now()}`);
  mkdirSync(out, { recursive: true });
  const source = path.join(root, 'assets_src/characters/tony_fridge/external_animation_v1/input/toni-approve-seated-c01.zip');
  const sourceSHA256 = createHash('sha256').update(readFileSync(source)).digest('hex');
  assert.equal(sourceSHA256, '7fca21ae69b8cda46cf9b8a72931a015b5af36b0714f325b24ef79716a26205b');
  const port = await new Promise((resolve, reject) => {
    const probe = createServer(); probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => { const port = probe.address().port; probe.close(() => resolve(port)); });
  });
  const origin = process.env.BAIM_TONY_PREVIEW_URL || `http://127.0.0.1:${port}`;
  assert.match(origin, /^http:\/\/127\.0\.0\.1:\d+$/);
  const server = process.env.BAIM_TONY_PREVIEW_URL ? null : spawn(process.execPath, ['tools/dev-server.mjs'], {
    cwd: root, env: { ...process.env, PORT: String(port) }, stdio: 'ignore'
  });
  let browser;
  const captures = [];
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try { ready = (await fetch(origin)).ok; } catch {}
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, 'preview server must be available');
    // Same browser launch configuration as the existing browser-smoke suite.
    browser = await chromium.launch({ headless: true });
    for (const language of ['bg', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, serviceWorkers: 'block', recordVideo: { dir: out, size: { width: 1280, height: 720 } } });
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        return url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? route.continue() : route.abort();
      });
      const page = await context.newPage();
      await page.goto(`${origin}/?play=1&testHarness=1`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => window.__comradeCandidateTest.ready);
      await page.evaluate(async language => {
        const { game } = window.__comradeCandidateTest;
        game.setLanguage(language);
        await game.changeScene('scene.chapter1.mehana');
        game.dialogue.start('dialogue.tony_fridge');
        game.renderUi();
      }, language);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(out, `${language}-before.png`) });
      const reaction = await page.evaluate(() => {
        const { game } = window.__comradeCandidateTest;
        game.dialogue.choose({ next: 'contest_result' }); game.renderUi();
        return { reaction: game.dialogue.entry.reactionId, scene: game.currentScene.id };
      });
      assert.equal(reaction.reaction, 'approving_nod');
      assert.equal(reaction.scene, 'scene.chapter1.mehana');
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(out, `${language}-nod.png`) });
      await page.waitForTimeout(3400);
      await page.screenshot({ path: path.join(out, `${language}-after.png`) });
      const video = page.video(); await context.close();
      const webm = await video.path();
      const mp4 = path.join(out, `${language}-gameplay.mp4`);
      execFileSync('/usr/bin/ffmpeg', ['-nostdin', '-v', 'error', '-i', webm, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4], { timeout: 30000 });
      captures.push({ language, mp4, screenshots: ['before', 'nod', 'after'].map(stage => path.join(out, `${language}-${stage}.png`)) });
    }
    writeFileSync(path.join(out, 'capture.json'), JSON.stringify({ taskId: 'tony-approve', candidate: 'toni-approve-seated-c01', sourceSHA256, origin, width: 1280, height: 720, captures, visualReviewPending: true }, null, 2), { flag: 'wx' });
    console.log(`Tony evidence saved: ${out}`);
  } finally {
    await browser?.close();
    if (server && server.exitCode === null) {
      server.kill('SIGTERM');
      await new Promise(resolve => server.once('exit', resolve));
    }
  }
});
