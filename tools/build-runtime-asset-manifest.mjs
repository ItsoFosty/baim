import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { assetManifest as sourceManifest } from "../src/content/art/assetManifest.js";

const OUTPUT_ROOT = "target/runtime-assets";
const ASSET_ROOT = join(OUTPUT_ROOT, "assets");
const MANIFEST_PATH = join(OUTPUT_ROOT, "manifest.json");
const RASTER_PATTERN = /\.(?:avif|gif|jpe?g|png|webp)$/i;

rmSync(ASSET_ROOT, { recursive: true, force: true });
mkdirSync(ASSET_ROOT, { recursive: true });

const records = {};
const manifest = mapValue(sourceManifest);
const version = digest(JSON.stringify(manifest));
const totalBytes = Object.values(records).reduce((sum, record) => sum + record.bytes, 0);
const output = {
  version,
  generatedAt: new Date().toISOString(),
  manifest,
  assets: records,
  summary: { count: Object.keys(records).length, bytes: totalBytes }
};

writeFileSync(MANIFEST_PATH, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ version, count: output.summary.count, totalMiB: mib(totalBytes), manifest: MANIFEST_PATH }, null, 2));

function mapValue(value) {
  if (Array.isArray(value)) return value.map(mapValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, mapValue(entry)]));
  if (typeof value !== "string" || !RASTER_PATTERN.test(value)) return value;
  if (records[value]) return records[value].url;
  const data = readFileSync(value);
  const hash = digest(data);
  const extension = extname(value);
  const stem = basename(value, extension).replace(/[^a-zA-Z0-9_-]+/g, "-");
  const filename = `${stem}.${hash}${extension.toLowerCase()}`;
  const outputPath = join(ASSET_ROOT, filename);
  copyFileSync(value, outputPath);
  records[value] = {
    url: outputPath.replaceAll("\\", "/"),
    hash,
    bytes: statSync(outputPath).size
  };
  return records[value].url;
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function mib(bytes) {
  return Math.round((bytes / 1048576) * 100) / 100;
}
