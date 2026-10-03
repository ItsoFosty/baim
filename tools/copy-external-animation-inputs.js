import { copyKnownInputZips, INPUT_DIR } from "./external-animation-utils.mjs";
import { fileURLToPath } from "node:url";

const usage = "Usage: node tools/copy-external-animation-inputs.js --source-dir /absolute/export-folder [--dry-run]";
try {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    console.log(usage);
  } else {
    let sourceDir, dryRun = false;
    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--source-dir" && !sourceDir && args[i + 1] && !args[i + 1].startsWith("--")) sourceDir = args[++i];
      else if (args[i] === "--dry-run" && !dryRun) dryRun = true;
      else throw new Error(usage);
    }
    if (!sourceDir) throw new Error(usage);
    const destinationDir = fileURLToPath(new URL(`../${INPUT_DIR}/`, import.meta.url));
    console.log(JSON.stringify(copyKnownInputZips({ sourceDir, destinationDir, dryRun }), null, 2));
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
