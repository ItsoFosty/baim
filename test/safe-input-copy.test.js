import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, symlinkSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { copyInputZips } from "../tools/safe-input-copy.mjs";

const zip = (tag = "") => Buffer.concat([Buffer.from("504b0506000000000000000000000000000000000000", "hex"), Buffer.from(tag)]);
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "baim-safe-import-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const sourceDir = join(root, "source"), destinationDir = join(root, "input");
  mkdirSync(sourceDir); mkdirSync(destinationDir);
  return { root, sourceDir, destinationDir };
}

test("explicit source required; missing/empty source preserves destination", t => {
  const f = fixture(t), retained = join(f.destinationDir, "approved.zip");
  writeFileSync(retained, zip());
  assert.throws(() => copyInputZips({ destinationDir: f.destinationDir }), /explicit source/);
  assert.throws(() => copyInputZips({ ...f, sourceDir: join(f.root, "missing") }), /ENOENT/);
  assert.throws(() => copyInputZips(f), /no ZIP/);
  assert.deepEqual(readFileSync(retained), zip());
  assert.deepEqual(readdirSync(f.destinationDir), ["approved.zip"]);
});

test("copies new ZIP byte-exact; identical rerun and unrelated inputs preserved", t => {
  const f = fixture(t), bytes = zip("source");
  writeFileSync(join(f.sourceDir, "new.zip"), bytes);
  writeFileSync(join(f.sourceDir, "notes.txt"), "ignored");
  writeFileSync(join(f.destinationDir, "approved.zip"), zip("approved"));
  assert.equal(copyInputZips(f)[0].copied, true);
  assert.deepEqual(readFileSync(join(f.destinationDir, "new.zip")), bytes);
  const before = statSync(join(f.destinationDir, "new.zip")).mtimeMs;
  const again = copyInputZips(f)[0];
  assert.equal(again.identical, true); assert.equal(again.copied, false);
  assert.equal(statSync(join(f.destinationDir, "new.zip")).mtimeMs, before);
  assert.deepEqual(readFileSync(join(f.destinationDir, "approved.zip")), zip("approved"));
  assert.match(again.sha256, /^[a-f0-9]{64}$/);
});

test("preflights whole batch: late conflict cannot copy earlier new file", t => {
  const f = fixture(t);
  writeFileSync(join(f.sourceDir, "a-new.zip"), zip());
  writeFileSync(join(f.sourceDir, "z-conflict.zip"), zip("new"));
  writeFileSync(join(f.destinationDir, "z-conflict.zip"), zip("old"));
  assert.throws(() => copyInputZips(f), /Conflicting/);
  assert.deepEqual(readdirSync(f.destinationDir), ["z-conflict.zip"]);
  assert.deepEqual(readFileSync(join(f.destinationDir, "z-conflict.zip")), zip("old"));
});

test("invalid ZIP header or directory entry causes zero copies", t => {
  const f = fixture(t);
  writeFileSync(join(f.sourceDir, "a-new.zip"), zip());
  writeFileSync(join(f.sourceDir, "z-bad.zip"), "not a ZIP");
  assert.throws(() => copyInputZips(f), /ZIP header/);
  assert.deepEqual(readdirSync(f.destinationDir), []);
  rmSync(join(f.sourceDir, "z-bad.zip")); mkdirSync(join(f.sourceDir, "z-bad.zip"));
  assert.throws(() => copyInputZips(f), /regular file/);
  assert.deepEqual(readdirSync(f.destinationDir), []);
});

test("dry run validates and reports without writes; missing destination not created", t => {
  const f = fixture(t);
  writeFileSync(join(f.sourceDir, "new.zip"), zip());
  const result = copyInputZips({ ...f, dryRun: true })[0];
  assert.equal(result.dryRun, true); assert.equal(result.copied, false);
  assert.deepEqual(readdirSync(f.destinationDir), []);
  assert.throws(() => copyInputZips({ ...f, destinationDir: join(f.root, "missing") }), /ENOENT/);
  assert.deepEqual(readdirSync(f.root).sort(), ["input", "source"]);
});

test("source equals destination is an unchanged identical batch", t => {
  const f = fixture(t); writeFileSync(join(f.sourceDir, "same.zip"), zip());
  assert.equal(copyInputZips({ ...f, destinationDir: f.sourceDir })[0].identical, true);
});

test("symlink ZIP sources and dangling destination links rejected", t => {
  const f = fixture(t);
  writeFileSync(join(f.sourceDir, "actual.bin"), zip());
  symlinkSync(join(f.sourceDir, "actual.bin"), join(f.sourceDir, "linked.zip"));
  assert.throws(() => copyInputZips(f), /regular file/);
  rmSync(join(f.sourceDir, "linked.zip"));
  writeFileSync(join(f.sourceDir, "new.zip"), zip());
  symlinkSync(join(f.root, "missing"), join(f.destinationDir, "new.zip"));
  assert.throws(() => copyInputZips(f), /regular file/);
});

test("case-only destination conflicts cause zero copies", t => {
  const f = fixture(t);
  writeFileSync(join(f.sourceDir, "new.zip"), zip());
  writeFileSync(join(f.destinationDir, "NEW.zip"), zip());
  assert.throws(() => copyInputZips(f), /Case-conflicting/);
  assert.deepEqual(readdirSync(f.destinationDir), ["NEW.zip"]);
});

test("CLI without source or with bad arguments exits before touching inputs", () => {
  for (const args of [[], ["--source-dir"], ["--unknown"]]) {
    const result = spawnSync(process.execPath, ["tools/copy-external-animation-inputs.js", ...args], { encoding: "utf8" });
    assert.equal(result.status, 1); assert.match(result.stderr, /Usage:/);
  }
  const help = spawnSync(process.execPath, ["tools/copy-external-animation-inputs.js", "--help"], { encoding: "utf8" });
  assert.equal(help.status, 0); assert.match(help.stdout, /--source-dir/);
});
