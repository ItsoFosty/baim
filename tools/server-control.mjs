import { closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { spawn } from "node:child_process";
import { request as httpsRequest } from "node:https";
import { fileURLToPath } from "node:url";

const root = normalize(join(fileURLToPath(new URL("..", import.meta.url))));
const stateDir = join(root, "target", "server");
const secure = process.env.HTTPS === "1";
const protocol = secure ? "https" : "http";
const serverName = secure ? "https-dev-server" : "dev-server";
const pidPath = join(stateDir, `${serverName}.pid.json`);
const logPath = join(stateDir, `${serverName}.log`);
const port = Number(process.env.PORT || (secure ? 5174 : 5173));
const command = process.argv[2];

if (!new Set(["start", "status", "stop", "restart"]).has(command)) {
  console.error("Usage: node tools/server-control.mjs <start|status|stop|restart>");
  process.exit(2);
}

mkdirSync(stateDir, { recursive: true });

if (command === "start") await start();
if (command === "status") await status();
if (command === "stop") await stop();
if (command === "restart") {
  await stop();
  await start();
}

async function start() {
  const current = readState();
  if (current && isRunning(current.pid)) {
    console.log(`Comrade Candidate is already running (PID ${current.pid}) at ${protocol}://localhost:${current.port}/`);
    return;
  }
  removeState();

  const logFd = openSync(logPath, "a");
  const child = spawn(process.execPath, ["tools/dev-server.mjs"], {
    cwd: root,
    detached: true,
    env: { ...process.env, PORT: String(port), HTTPS: secure ? "1" : "0" },
    stdio: ["ignore", logFd, logFd]
  });
  child.unref();
  closeSync(logFd);
  writeFileSync(pidPath, `${JSON.stringify({ pid: child.pid, port, secure, startedAt: new Date().toISOString() }, null, 2)}\n`);

  await delay(500);
  if (!isRunning(child.pid)) {
    removeState();
    throw new Error(`Server exited during startup. Check ${logPath}`);
  }
  console.log(`Comrade Candidate started in detached mode (PID ${child.pid}) at ${protocol}://localhost:${port}/`);
  console.log(`Log: ${logPath}`);
}

async function status() {
  const current = readState();
  if (!current || !isRunning(current.pid)) {
    removeState();
    console.log("Comrade Candidate is not running in detached mode.");
    process.exitCode = 1;
    return;
  }

  let health = "not responding";
  try {
    const statusCode = secure
      ? await getSelfSignedHttpsStatus(current.port)
      : (await fetch(`http://127.0.0.1:${current.port}/`, { signal: AbortSignal.timeout(3000) })).status;
    health = `HTTP ${statusCode}`;
  } catch {}
  console.log(`Comrade Candidate is running (PID ${current.pid}, ${health}) at ${protocol}://localhost:${current.port}/`);
  if (health !== "HTTP 200") process.exitCode = 1;
}

async function stop() {
  const current = readState();
  if (!current || !isRunning(current.pid)) {
    removeState();
    console.log("Comrade Candidate is not running in detached mode.");
    return;
  }

  process.kill(current.pid, "SIGTERM");
  for (let attempt = 0; attempt < 25 && isRunning(current.pid); attempt += 1) await delay(100);
  if (isRunning(current.pid)) throw new Error(`Server PID ${current.pid} did not stop after SIGTERM.`);
  removeState();
  console.log(`Comrade Candidate stopped cleanly (PID ${current.pid}).`);
}

function readState() {
  if (!existsSync(pidPath)) return null;
  try {
    const state = JSON.parse(readFileSync(pidPath, "utf8"));
    return Number.isInteger(state.pid) && Number.isInteger(state.port) ? state : null;
  } catch {
    return null;
  }
}

function removeState() {
  rmSync(pidPath, { force: true });
}

function isRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function getSelfSignedHttpsStatus(targetPort) {
  return new Promise((resolve, reject) => {
    const request = httpsRequest({ hostname: "127.0.0.1", port: targetPort, path: "/", rejectUnauthorized: false }, (response) => {
      response.resume();
      resolve(response.statusCode);
    });
    request.setTimeout(3000, () => request.destroy(new Error("HTTPS health check timed out")));
    request.on("error", reject);
    request.end();
  });
}
