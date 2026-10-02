import { execFileSync } from 'node:child_process';
import { hostname } from 'node:os';
import { existsSync, readFileSync, writeFileSync, mkdirSync, lstatSync, realpathSync, renameSync, unlinkSync } from 'node:fs';
import { resolve, relative, join, isAbsolute } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { LudoClient, SPEC_URL, validateCandidate, pricingFromSpec, makePayload, referenceData, sha256, downloadSheet, deriveAtlas, submitWithIntent, verifyApproval } from './ludo-api-client.mjs';

const ROOT = '/home/ZeShad/baim';
const PRIVATE = join(ROOT, '.git/ludo-api');
const KEY = join(PRIVATE, 'key');
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const read = path => JSON.parse(readFileSync(path, 'utf8'));

export function requireEnvironment(root = ROOT, run = execFileSync, host = hostname()) {
  const git = (...args) => run('git', args, { cwd: root, encoding: 'utf8' }).trim();
  if (host !== 'vps-b30ffe96' || root !== ROOT || git('rev-parse', '--show-toplevel') !== ROOT
      || git('remote', 'get-url', 'marto') !== 'https://github.com/tran4o/baim.git') throw new Error('Wrong host/repository/canonical remote; stop');
  const branch = git('branch', '--show-current');
  if (!branch.startsWith('feat/')) throw new Error('Use a focused feat/ branch, never master');
  return { branch, base: git('rev-parse', 'marto/master') };
}

function privateDir(path) {
  if (lstatSync(join(ROOT, '.git')).isSymbolicLink()) throw new Error('Pilot requires the primary checkout');
  const rel = relative(join(ROOT, '.git'), path);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('Invalid private state path');
  let current = join(ROOT, '.git');
  for (const part of rel.split('/')) {
    current = join(current, part);
    if (existsSync(current)) {
      const st = lstatSync(current);
      if (!st.isDirectory() || st.isSymbolicLink()) throw new Error('Unsafe private state directory');
      if ((st.mode & 0o077) !== 0) throw new Error('Private API state requires owner-only permissions');
    } else mkdirSync(current, { mode: 0o700 });
  }
}
function save(path, data, exclusive = false) {
  if (exclusive) { writeFileSync(path, json(data), { flag: 'wx', mode: 0o600 }); return; }
  if (existsSync(path) && lstatSync(path).isSymbolicLink()) throw new Error('Unsafe state file');
  const temp = `${path}.${randomUUID()}.tmp`;
  writeFileSync(temp, json(data), { flag: 'wx', mode: 0o600 });
  renameSync(temp, path);
}
function candidateDir(label) {
  if (!/^[a-z][a-z0-9-]{2,63}$/.test(label || '')) throw new Error('Invalid candidate label');
  const path = join(PRIVATE, label); privateDir(path); return path;
}
function safeReference(path) {
  const full = realpathSync(resolve(ROOT, path));
  const rel = relative(join(ROOT, 'assets_src/characters'), full);
  if (rel.startsWith('..') || isAbsolute(rel) || !lstatSync(full).isFile()) throw new Error('Reference must stay within character source assets');
  return readFileSync(full);
}
function sourceDir(path) {
  if (!/^assets_src\/characters\/[a-z0-9_]+\/external_animation_v1\/input$/.test(path || '')) throw new Error('Use the established character source input directory');
  const full = resolve(ROOT, path);
  let current = ROOT;
  for (const part of path.split('/')) {
    current = join(current, part);
    if (existsSync(current) && (lstatSync(current).isSymbolicLink() || !lstatSync(current).isDirectory())) throw new Error('Unsafe source directory');
  }
  return full;
}
function loadKey() {
  if (process.env.LUDO_API_KEY) return process.env.LUDO_API_KEY;
  if (!existsSync(KEY)) throw new Error('No API key configured. Run npm run ludo:api -- setup privately in your VPS terminal');
  const st = lstatSync(KEY);
  if (!st.isFile() || st.isSymbolicLink() || (st.mode & 0o077)) throw new Error('API key must be an owner-only regular file');
  return readFileSync(KEY, 'utf8').trim();
}
async function verifyPrivacy() {
  privateDir(PRIVATE);
  const name = `probe-${randomUUID()}.txt`, file = join(PRIVATE, name);
  writeFileSync(file, 'non-secret privacy probe', { flag: 'wx', mode: 0o600 });
  try {
    const response = await fetch(`http://127.0.0.1:5173/.git/ludo-api/${name}`, { signal: AbortSignal.timeout(5000) });
    if (response.status !== 404) throw new Error('Preview does not protect private API state. Restart only the verified ZeShad port-5173 server before setup/use');
  } finally { unlinkSync(file); }
}
async function readHiddenKey() {
  if (!process.stdin.isTTY) throw new Error('Setup requires an interactive VPS terminal; never paste the key into chat or a command argument');
  process.stdout.write('Paste Ludo API key (hidden), then Enter: ');
  process.stdin.setRawMode(true); process.stdin.resume(); process.stdin.setEncoding('utf8');
  return new Promise((resolveKey, reject) => {
    let key = '';
    const finish = (error) => {
      process.stdin.off('data', onData); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n');
      if (error) reject(error); else resolveKey(key);
    };
    const onData = chunk => {
      for (const char of chunk) {
        if (char === '\u0003') { finish(new Error('Setup cancelled')); return; }
        if (char === '\r' || char === '\n') { finish(); return; }
        if (char === '\u007f' || char === '\b') key = key.slice(0, -1);
        else key += char;
        if (key.length > 1000) { finish(new Error('Invalid key length')); return; }
      }
    };
    process.stdin.on('data', onData);
  });
}
async function currentSpec() {
  const response = await fetch(SPEC_URL, { redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error('Cannot verify official API pricing/schema');
  return response.json();
}
function print(value) { console.log(json(value)); }

export async function main(args) {
  const [command, labelOrPath, ...options] = args;
  if (!command || command === 'help') {
    console.log('Ludo pilot: setup | check | plan candidate.json | submit LABEL --approve-plan HASH --max-credits N | collect LABEL\nNo command generates by default. See docs/ludo-api-pilot.md.'); return;
  }
  const environment = requireEnvironment();
  if (command === 'setup') {
    if (existsSync(KEY)) throw new Error('Key already configured; do not overwrite it without an explicit rotation decision');
    await verifyPrivacy();
    const key = await readHiddenKey(); await new LudoClient(key).check();
    writeFileSync(KEY, key, { flag: 'wx', mode: 0o600 });
    console.log('API key validated and stored privately. No generation or credits spent.'); return;
  }
  if (command === 'check') {
    await verifyPrivacy(); await new LudoClient(loadKey()).check();
    console.log('API authentication passed. No generation submitted.'); return;
  }
  if (command === 'plan') {
    await verifyPrivacy();
    const config = validateCandidate(read(resolve(ROOT, labelOrPath)));
    sourceDir(config.sourceDir);
    const initial = safeReference(config.reference); await referenceData(initial, config.referenceSHA256);
    if (config.finalReference) await referenceData(safeReference(config.finalReference), config.finalReferenceSHA256);
    const pricing = pricingFromSpec(await currentSpec(), config.model, config.duration);
    const plan = { config, environment, requestId: randomUUID(), pricing, createdAt: new Date().toISOString() };
    const dir = candidateDir(config.label); save(join(dir, 'plan.json'), plan, true);
    print({ label: config.label, planSHA256: sha256(json(plan)), estimatedCredits: pricing.estimatedCredits,
      submitted: false, note: 'Ask the user to approve this exact plan and maximum charge before submit.' }); return;
  }
  if (!['submit', 'collect'].includes(command)) throw new Error('Unknown command; run help');
  const dir = candidateDir(labelOrPath), plan = read(join(dir, 'plan.json'));
  validateCandidate(plan.config);
  if (plan.environment.branch !== environment.branch) throw new Error('Candidate belongs to a different task branch');
  await verifyPrivacy(); const client = new LudoClient(loadKey());
  const statePath = join(dir, 'job.json');
  if (command === 'submit') {
    const pricing = pricingFromSpec(await currentSpec(), plan.config.model, plan.config.duration);
    const cap = verifyApproval(plan, options, pricing);
    const images = { initial: await referenceData(safeReference(plan.config.reference), plan.config.referenceSHA256) };
    if (plan.config.finalReference) images.final = await referenceData(safeReference(plan.config.finalReference), plan.config.finalReferenceSHA256);
    const payload = makePayload(plan.config, images, plan.requestId);
    // Exclusive intent is durable BEFORE the only paid POST. Even a timeout cannot trigger another submission.
    const state = { requestId: plan.requestId, status: 'submission-uncertain', approvedPlanSHA256: options[1], approvedMaxCredits: cap, submittedAt: new Date().toISOString() };
    await submitWithIntent(client, payload, state, value => save(statePath, value, true), value => save(statePath, value));
    if (state.credits_charged > cap) throw new Error('Reported charge exceeds approval cap; saved job must be investigated, never resubmitted');
    print({ label: labelOrPath, jobId: state.id || null, status: state.status, next: 'collect the saved candidate; never repeat submit' }); return;
  }
  const state = read(statePath);
  if (!state.id && !state.result) {
    const jobs = await client.jobs();
    const job = Array.isArray(jobs) && jobs.find(job => job.request_id === plan.requestId);
    if (job) Object.assign(state, job);
    else {
      const results = await client.results(plan.requestId);
      if (!Array.isArray(results) || results.length !== 1 || results[0].request_id !== plan.requestId) throw new Error('Submission unresolved; preserve request ID and stop. No new paid POST is permitted');
      state.status = 'succeeded'; state.result = results[0];
    }
  }
  if (state.id && state.status !== 'succeeded') {
    const after = Math.max(0, Number(state.poll_after_ms) || 0);
    if (state.lastPollAt && Date.now() - state.lastPollAt < after) throw new Error('Respect saved poll_after_ms before collecting again');
    Object.assign(state, await client.job(state.id)); state.lastPollAt = Date.now();
  }
  save(statePath, state);
  if (state.credits_charged > state.approvedMaxCredits) throw new Error('Reported charge exceeds approval cap; preserve the saved job and investigate');
  if (state.status !== 'succeeded') {
    print({ label: labelOrPath, jobId: state.id || null, status: state.status,
      pollAfterMs: state.poll_after_ms || null, next: ['failed', 'canceled'].includes(state.status) ? 'stop; a new paid attempt needs a new decision' : 'collect again after the recommended delay; this is a free read' }); return;
  }
  if (existsSync(join(dir, 'download.json'))) {
    const report = read(join(dir, 'download.json'));
    const destination = join(sourceDir(plan.config.sourceDir), `${plan.config.label}-api`);
    for (const [name, digest] of [['spritesheet.png', report.sourceSHA256], ['derived-atlas.json', report.derivedAtlasSHA256], ['provenance.json', report.provenanceSHA256]]) {
      if (sha256(readFileSync(join(destination, name))) !== digest) throw new Error('Collected source package changed; preserve user work and investigate');
    }
    print(report); return;
  }
  const bytesPath = join(dir, 'spritesheet.png');
  const bytes = existsSync(bytesPath) ? readFileSync(bytesPath) : await downloadSheet(state.result.spritesheet_url);
  if (!existsSync(bytesPath)) writeFileSync(bytesPath, bytes, { flag: 'wx', mode: 0o600 });
  const atlas = await deriveAtlas(bytes, state.result);
  const config = plan.config, destination = join(sourceDir(config.sourceDir), `${config.label}-api`);
  if (existsSync(destination)) throw new Error('Source package exists; preserve it and investigate before overwriting');
  const provenance = { candidate: config.label, status: 'candidate', transport: 'ludo-rest-api', requestId: plan.requestId,
    jobId: state.id || null, generationCreatedAt: state.result.created_at || null, creditsCharged: state.credits_charged ?? null,
    approvedMaxCredits: state.approvedMaxCredits, estimatedCredits: plan.pricing.estimatedCredits,
    settings: { ...makePayload(config, { initial: '[reference-bytes-recorded-by-hash]' }, plan.requestId),
      ...(config.finalReference ? { final_image: '[reference-bytes-recorded-by-hash]' } : {}) },
    references: { initial: { path: config.reference, sha256: config.referenceSHA256 },
      ...(config.finalReference ? { final: { path: config.finalReference, sha256: config.finalReferenceSHA256 } } : {}) },
    sourceSHA256: sha256(bytes), returnedMetadata: { num_frames: state.result.num_frames, num_cols: state.result.num_cols,
      num_rows: state.result.num_rows, duration: state.result.duration }, derivedAtlasSHA256: sha256(json(atlas)),
    timingOrigin: 'derived-uniform-from-api-duration', schemaVersion: plan.pricing.specVersion,
    note: 'Native API sheet + metadata; not an original website ZIP. Raw responses retained privately. Runtime integration and visual approval pending.' };
  mkdirSync(destination, { recursive: true });
  writeFileSync(join(destination, 'spritesheet.png'), bytes, { flag: 'wx' });
  writeFileSync(join(destination, 'derived-atlas.json'), json(atlas), { flag: 'wx' });
  writeFileSync(join(destination, 'provenance.json'), json(provenance), { flag: 'wx' });
  const report = { label: config.label, status: 'source-collected-not-runtime-approved', sourceDir: relative(ROOT, destination), sourceSHA256: sha256(bytes),
    derivedAtlasSHA256: sha256(json(atlas)), provenanceSHA256: sha256(json(provenance)),
    creditsCharged: state.credits_charged ?? null, next: 'Agent continues the existing Stage 2 runtime integration/build/test/5173 preview. No new approval pause.' };
  save(join(dir, 'download.json'), report, true); print(report);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
