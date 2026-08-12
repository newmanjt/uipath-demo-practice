import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const installer = fileURLToPath(new URL('../scripts/install-skill.mjs', import.meta.url));

function run(...args) {
  return spawnSync(process.execPath, [installer, ...args], { encoding: 'utf8' });
}

test('public installer supports dry run, protected install, and refuses overwrite', async (t) => {
  const destinationRoot = await mkdtemp(join(tmpdir(), 'uipath-demo-practice-install-'));
  t.after(() => rm(destinationRoot, { recursive: true, force: true }));

  const dryRun = run('--destination-root', destinationRoot, '--dry-run');
  assert.equal(dryRun.status, 0, dryRun.stderr);
  assert.match(dryRun.stdout, /INSTALL_PLAN/);

  const installed = run('--destination-root', destinationRoot);
  assert.equal(installed.status, 0, installed.stderr);
  assert.match(installed.stdout, /INSTALLED_OK/);

  const skill = await readFile(join(destinationRoot, 'uipath-demo-practice', 'SKILL.md'), 'utf8');
  assert.match(skill, /name: uipath-demo-practice/);

  const overwrite = run('--destination-root', destinationRoot);
  assert.notEqual(overwrite.status, 0);
  assert.match(overwrite.stderr, /Refusing to overwrite existing skill/);
});
