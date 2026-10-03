import { constants, lstatSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

function existingDirectory(path) {
  if (!lstatSync(path).isDirectory() || realpathSync(path) !== path) {
    throw new Error(`Use a real directory without symlink components: ${path}`);
  }
}

// Preflight the entire batch before writing. Never remove or overwrite an input.
// An I/O failure during copying may leave earlier NEW files; reruns safely skip them.
export function copyInputZips({ sourceDir, destinationDir, dryRun = false } = {}) {
  if (typeof sourceDir !== "string" || !sourceDir.trim()) throw new Error("An explicit source directory is required");
  if (typeof destinationDir !== "string" || !destinationDir.trim()) throw new Error("An explicit destination directory is required");
  const source = resolve(sourceDir), destination = resolve(destinationDir);
  existingDirectory(source);
  // Require an existing destination: the repository input directory already exists.
  // This also prevents a bad path from creating an unexpected directory tree.
  existingDirectory(destination);
  const entries = readdirSync(source, { withFileTypes: true }).filter(entry => /\.zip$/i.test(entry.name));
  if (!entries.length) throw new Error("Source directory contains no ZIP inputs");
  const names = new Set();
  const plan = entries.sort((a, b) => a.name.localeCompare(b.name)).map(entry => {
    if (!entry.isFile()) throw new Error(`ZIP input must be a regular file: ${entry.name}`);
    const folded = entry.name.toLowerCase();
    if (names.has(folded)) throw new Error(`Ambiguous ZIP filenames: ${entry.name}`);
    names.add(folded);
    const input = resolve(source, entry.name), output = resolve(destination, entry.name);
    // Snapshot bytes before copying, rather than rereading a changed source path.
    const bytes = readFileSync(input, { flag: constants.O_RDONLY | (constants.O_NOFOLLOW || 0) });
    if (bytes.length < 22 || !["504b0304", "504b0506"].includes(bytes.subarray(0, 4).toString("hex"))) {
      throw new Error(`Input lacks a ZIP header: ${entry.name}`);
    }
    const digest = sha256(bytes);
    let identical = false;
    // lstat catches dangling symlinks too; existsSync alone does not.
    let current;
    try { current = lstatSync(output); } catch (error) { if (error.code !== "ENOENT") throw error; }
    if (current) {
      if (!current.isFile()) throw new Error(`Destination is not a regular file: ${entry.name}`);
      const retained = readFileSync(output, { flag: constants.O_RDONLY | (constants.O_NOFOLLOW || 0) });
      if (!bytes.equals(retained)) throw new Error(`Conflicting destination ZIP; no inputs copied: ${entry.name}`);
      identical = true;
    }
    return { input, output, bytes, digest, identical };
  });
  // Catch case-only conflicts with retained files on case-sensitive systems too.
  const retainedNames = readdirSync(destination);
  for (const item of plan) {
    const name = item.output.slice(destination.length + 1);
    if (retainedNames.some(other => other !== name && other.toLowerCase() === name.toLowerCase())) {
      throw new Error(`Case-conflicting destination filename; no inputs copied: ${name}`);
    }
  }
  return plan.map(({ input, output, bytes, digest, identical }) => {
    if (!identical && !dryRun) {
      // Exclusive creation refuses a destination created after preflight.
      writeFileSync(output, bytes, { flag: "wx" });
    }
    return { source: input, destination: output, sha256: digest, bytes: bytes.length,
      copied: !identical && !dryRun, identical, dryRun };
  });
}
