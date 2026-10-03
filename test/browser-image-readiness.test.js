import test from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { browserAvailable } from "./helpers/browser-availability.js";
import { observeImageRequests, waitForLoadedImage } from "./helpers/browser-image-readiness.js";

const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=", "base64");
const selector = '[data-item-id="item.campaign_pamphlets"] img';

test("browser image readiness preserves successful loads and reports broken images", { timeout: 20_000 }, async t => {
  if (!browserAvailable(t, chromium.executablePath())) return;
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  async function fixture() {
    const page = await browser.newPage();
    t.after(() => page.close());
    await page.route("http://127.0.0.1/image-fixture", route => route.fulfill({ contentType: "text/html", body: '<div data-item-id="item.campaign_pamphlets"></div>' }));
    await page.goto("http://127.0.0.1/image-fixture");
    await page.evaluate(() => {
      window.__comradeCandidateTest = { game: { currentScene: { id: "scene.chapter1.village_square" }, localization: { language: "bg" } } };
    });
    const network = observeImageRequests(page);
    t.after(() => network.dispose());
    return { page, network };
  }
  const insert = (page, src) => page.evaluate(src => {
    const image = document.createElement("img");
    image.width = 16;
    image.height = 16;
    image.src = src;
    document.querySelector("[data-item-id]").replaceChildren(image);
  }, src);

  for (const replacement of [false, true]) {
    await t.test(replacement ? "wait follows a replaced DOM image" : "delayed valid response succeeds", async () => {
      const { page, network } = await fixture();
      let release;
      let requested;
      const held = new Promise(resolve => { release = resolve; });
      const arrived = new Promise(resolve => { requested = resolve; });
      await page.route("**/held.png", async route => {
        requested();
        await held;
        await route.fulfill({ contentType: "image/png", body: png });
      });
      await page.route("**/replacement.png", route => route.fulfill({ contentType: "image/png", body: png }));
      await insert(page, "/held.png");
      await arrived;
      assert.equal(await page.locator(selector).isVisible(), true);
      assert.equal(await page.locator(selector).evaluate(image => image.complete), false);
      const waiting = waitForLoadedImage(page, selector, { network });
      if (replacement) await insert(page, "/replacement.png");
      release();
      await waiting;
      assert.equal(await page.locator(selector).isVisible(), true);
      assert.equal(await page.locator(selector).evaluate(image => image.complete && image.naturalWidth > 0), true);
      if (replacement) assert.match(await page.locator(selector).getAttribute("src"), /replacement/);
    });
  }
  for (const failure of ["missing", "aborted"]) {
    await t.test(`${failure} request fails with image, context and network diagnostics`, async () => {
      const { page, network } = await fixture();
      await page.route(`**/${failure}.png*`, route => failure === "missing"
        ? route.fulfill({ status: 404, contentType: "text/plain", body: "missing fixture" })
        : route.abort("failed"));
      await insert(page, `/${failure}.png?private=must-not-appear`);
      await assert.rejects(waitForLoadedImage(page, selector, { timeout: 500, network }), error => {
        assert.match(error.message, /Image readiness failed within 500ms/);
        assert.match(error.message, new RegExp(`${failure}\\.png`));
        assert.match(error.message, /"currentSrc":/);
        assert.match(error.message, /"complete":true/);
        assert.match(error.message, /"naturalWidth":0/);
        assert.match(error.message, /"naturalHeight":0/);
        assert.match(error.message, /scene.chapter1.village_square/);
        assert.match(error.message, /"language":"bg"/);
        assert.match(error.message, failure === "missing" ? /"status":404/ : /net::ERR_FAILED/);
        assert.doesNotMatch(error.message, /private|must-not-appear/);
        return true;
      });
    });
  }
});
