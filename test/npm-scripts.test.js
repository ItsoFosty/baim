import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";

// Inspect literal local tool paths only; never execute npm commands or their tools.
function toolReferences(scripts) {
  return Object.entries(scripts).flatMap(([name, command]) =>
    [...command.matchAll(/\btools\/[A-Za-z0-9_./-]+\.(?:[cm]?js|py|sh)\b/g)]
      .map(([path]) => ({ name, path }))
  );
}

test("npm scripts reference existing local tool files", () => {
  const root = new URL("../", import.meta.url);
  const { scripts } = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));
  const references = toolReferences(scripts);
  assert.ok(references.length > 0, "Expected local tool references in package.json");
  const missing = references.filter(({ path }) => {
    try { return !statSync(new URL(path, root)).isFile(); }
    catch (error) {
      if (error.code === "ENOENT" || error.code === "ENOTDIR") return true;
      throw error;
    }
  });
  assert.deepEqual(missing, [], `Missing npm tool targets: ${JSON.stringify(missing)}`);
});

test("tool reference scan includes chained commands and environment prefixes", () => {
  assert.deepEqual(toolReferences({ build: "PORT=5173 node tools/first.js && node tools/second.mjs" }), [
    { name: "build", path: "tools/first.js" },
    { name: "build", path: "tools/second.mjs" }
  ]);
});

test("tool reference scan catches the historical obsolete character target", () => {
  assert.deepEqual(toolReferences({ "build:characters": "node tools/build-character-chroma-assets.js" }), [
    { name: "build:characters", path: "tools/build-character-chroma-assets.js" }
  ]);
});

test("tool reference scan supports quoted paths and ignores npm aliases", () => {
  assert.deepEqual(toolReferences({ build: "node 'tools/example.cjs'", alias: "npm run build" }), [
    { name: "build", path: "tools/example.cjs" }
  ]);
});
