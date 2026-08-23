const RASTER_ASSET_PATTERN = /\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;

export function imageAssetPaths(assetGroup) {
  return [...new Set(Object.values(assetGroup || {})
    .filter((value) => typeof value === "string" && RASTER_ASSET_PATTERN.test(value)))];
}

export class AssetLoader {
  constructor(manifest) {
    this.manifest = manifest;
    this.runtimeVersion = null;
    this.images = new Map();
    this.imageReady = new Map();
    this.imageLastUsed = new Map();
    this.protectedPaths = new Set();
    this.useSequence = 0;
    this.decodedImageBudgetBytes = 256 * 1024 * 1024;
  }

  async loadRuntimeManifest(path = "target/runtime-assets/manifest.json") {
    if (typeof fetch !== "function") return false;
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) return false;
      const runtime = await response.json();
      if (!runtime?.manifest?.scenes || !runtime?.manifest?.characters || !runtime?.manifest?.items) return false;
      this.manifest = runtime.manifest;
      this.runtimeVersion = runtime.version || null;
      return true;
    } catch {
      return false;
    }
  }

  getSceneImage(sceneId, layer) {
    const path = this.getSceneAssetPath(sceneId, layer);
    return this.getImage(path);
  }

  getCharacterImage(characterId, slot) {
    const path = this.manifest.characters[characterId]?.[slot];
    return this.getImage(path);
  }

  getCharacterAssetPath(characterId, slot) {
    return this.manifest.characters[characterId]?.[slot] || null;
  }

  getItemImage(itemId) {
    const path = this.getItemAssetPath(itemId);
    return this.getImage(path);
  }

  getItemAssetPath(itemId) {
    return this.manifest.items?.[itemId]?.icon || null;
  }

  getImage(path) {
    if (!path) return null;
    this.imageLastUsed.set(path, ++this.useSequence);
    if (this.images.has(path)) return this.images.get(path);

    const image = new Image();
    image.dataset.loaded = "false";
    const ready = new Promise((resolve) => {
      image.addEventListener("load", async () => {
        try {
          if (typeof image.decode === "function") await image.decode();
          image.dataset.loaded = "true";
        } catch {
          image.dataset.loaded = image.naturalWidth > 0 ? "true" : "error";
        }
        this.trimDecodedCache();
        resolve(image);
      }, { once: true });
      image.addEventListener("error", () => {
        image.dataset.loaded = "error";
        resolve(image);
      }, { once: true });
    });
    this.images.set(path, image);
    this.imageReady.set(path, ready);
    image.src = path;
    return image;
  }

  preload(paths) {
    const uniquePaths = [...new Set((paths || []).filter(Boolean))];
    return Promise.all(uniquePaths.map((path) => {
      this.getImage(path);
      return this.imageReady.get(path);
    }));
  }

  preloadCharacterAssets(characterId) {
    return this.preload(imageAssetPaths(this.manifest.characters?.[characterId]));
  }

  preloadCharacterSlots(characterId, slots = []) {
    return this.preload(slots.map((slot) => this.getCharacterAssetPath(characterId, slot)));
  }

  preloadCharacterSlot(characterId, slot) {
    return this.preloadCharacterSlots(characterId, [slot]);
  }

  preloadAllCharacterAssets() {
    return this.preload(Object.values(this.manifest.characters || {})
      .flatMap((characterAssets) => imageAssetPaths(characterAssets)));
  }

  preloadAllItemAssets() {
    return this.preload(Object.values(this.manifest.items || {})
      .flatMap((itemAssets) => imageAssetPaths(itemAssets)));
  }

  preloadItemAssets(itemId) {
    return this.preload(imageAssetPaths(this.manifest.items?.[itemId]));
  }

  preloadOwnedItemAssets(itemIds = []) {
    return this.preload(itemIds.flatMap((itemId) => imageAssetPaths(this.manifest.items?.[itemId])));
  }

  preloadSceneAssets(sceneId) {
    return this.preload(imageAssetPaths(this.manifest.scenes?.[sceneId]));
  }

  protectWorkingSet({ sceneIds = [], characterId, characterSlots = [], itemIds = [] } = {}) {
    this.protectedPaths = new Set([
      ...sceneIds.flatMap((sceneId) => imageAssetPaths(this.manifest.scenes?.[sceneId])),
      ...characterSlots.map((slot) => this.getCharacterAssetPath(characterId, slot)).filter(Boolean),
      ...itemIds.flatMap((itemId) => imageAssetPaths(this.manifest.items?.[itemId]))
    ]);
    this.trimDecodedCache();
  }

  trimDecodedCache(maximumBytes = this.decodedImageBudgetBytes) {
    const loaded = [...this.images.entries()]
      .filter(([, image]) => this.isLoaded(image))
      .map(([path, image]) => ({
        path,
        image,
        bytes: Math.max(0, Number(image.naturalWidth || image.width) * Number(image.naturalHeight || image.height) * 4),
        lastUsed: this.imageLastUsed.get(path) || 0
      }));
    let total = loaded.reduce((sum, entry) => sum + entry.bytes, 0);
    if (total <= maximumBytes) return 0;
    let released = 0;
    for (const entry of loaded.filter((item) => !this.protectedPaths.has(item.path)).sort((a, b) => a.lastUsed - b.lastUsed)) {
      if (total <= maximumBytes) break;
      entry.image.src = "";
      this.images.delete(entry.path);
      this.imageReady.delete(entry.path);
      this.imageLastUsed.delete(entry.path);
      total -= entry.bytes;
      released += 1;
    }
    return released;
  }

  getSceneAssetPath(sceneId, layer) {
    return this.manifest.scenes[sceneId]?.[layer] || null;
  }

  getImageStatus(image) {
    return image?.dataset.loaded || "missing";
  }

  isLoaded(image) {
    return image?.dataset.loaded === "true";
  }
}
