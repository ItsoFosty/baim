// Test-only image readiness: resolve the current DOM node on every poll.
// Record image responses before the action that creates the inventory image.
export function observeImageRequests(page) {
  const events = [];
  const safeUrl = value => {
    try {
      const url = new URL(value);
      return `${url.protocol}//${url.host}${url.pathname}`;
    } catch { return "[invalid URL]"; }
  };
  const record = event => {
    events.push(event);
    if (events.length > 20) events.shift();
  };
  const response = result => {
    if (result.request().resourceType() === "image") {
      record({ url: safeUrl(result.url()), status: result.status() });
    }
  };
  const failed = request => {
    if (request.resourceType() === "image") {
      record({ url: safeUrl(request.url()), error: request.failure()?.errorText });
    }
  };
  page.on("response", response);
  page.on("requestfailed", failed);
  return {
    events,
    dispose() {
      page.off("response", response);
      page.off("requestfailed", failed);
    }
  };
}

export async function waitForLoadedImage(page, selector, { timeout = 5_000, network } = {}) {
  try {
    const ready = await page.waitForFunction(selector => {
      const image = document.querySelector(selector);
      return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
    }, selector, { timeout });
    await ready.dispose();
  } catch (cause) {
    const state = await page.evaluate(selector => {
      const safeUrl = value => {
        try {
          const url = new URL(value, document.baseURI);
          return `${url.protocol}//${url.host}${url.pathname}`;
        } catch { return "[invalid URL]"; }
      };
      const image = document.querySelector(selector);
      const game = window.__comradeCandidateTest?.game;
      return {
        scene: game?.currentScene?.id ?? null,
        language: game?.localization?.language ?? null,
        image: image ? {
          src: safeUrl(image.getAttribute("src") || ""),
          currentSrc: image.currentSrc ? safeUrl(image.currentSrc) : "",
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        } : null
      };
    }, selector).catch(error => ({ diagnosticError: error.name }));
    const sources = [state.image?.src, state.image?.currentSrc].filter(Boolean);
    const relevantNetwork = (network?.events || []).filter(event => sources.includes(event.url));
    throw new Error(`Image readiness failed within ${timeout}ms for ${selector}: ${JSON.stringify({ ...state, network: relevantNetwork })}`, { cause });
  }
}
