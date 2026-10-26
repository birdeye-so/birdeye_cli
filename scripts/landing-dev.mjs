import { spawn } from 'node:child_process';
import { syncCatalog, root } from './sync-landing-catalog.mjs';
await syncCatalog();
const children = [
  spawn(process.execPath, ['scripts/sync-landing-catalog.mjs', '--watch'], {cwd: root, stdio: 'inherit'}),
  spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['--prefix', 'apps/landing', 'run', 'dev'], {cwd: root, stdio: 'inherit'}),
];
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill('SIGTERM');
  process.exitCode = code;
}
for (const child of children) {child.on('error', error => {console.error(error.message); stop(1);}); child.on('exit', code => stop(code ?? 0));}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());
