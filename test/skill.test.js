import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as appContent from '../src/content.js';
import * as skillContent from '../skills/uipath-demo-practice/references/content.js';

const skillUrl = new URL('../skills/uipath-demo-practice/', import.meta.url);
const helperPath = fileURLToPath(new URL('scripts/session-config.mjs', skillUrl));

function runHelper(...args) {
  return spawnSync(process.execPath, [helperPath, ...args], { encoding: 'utf8' });
}

test('skill metadata is complete and UI metadata invokes the skill', async () => {
  const skill = await readFile(new URL('SKILL.md', skillUrl), 'utf8');
  const yaml = await readFile(new URL('agents/openai.yaml', skillUrl), 'utf8');
  const packageJson = JSON.parse(await readFile(new URL('package.json', skillUrl), 'utf8'));
  assert.match(skill, /^---\r?\nname: uipath-demo-practice\r?\ndescription: .+\r?\n---/);
  assert.doesNotMatch(skill, /\[TODO/);
  assert.match(yaml, /display_name: "UiPath Demo Practice"/);
  assert.match(yaml, /\$uipath-demo-practice/);
  assert.equal(packageJson.type, 'module');
});

test('skill owns the canonical content exported through the CLI adapter', () => {
  assert.strictEqual(appContent.scenarios, skillContent.scenarios);
  assert.strictEqual(appContent.products, skillContent.products);
  assert.equal(skillContent.scenarios.length * skillContent.personalities.length * skillContent.roles.length, 360);
});

test('session helper validates content and resolves replayable missions', () => {
  const validation = runHelper('validate');
  assert.equal(validation.status, 0, validation.stderr);
  assert.match(validation.stdout, /SKILL_CONTENT_OK/);

  const args = ['select', '--seed', 'repeatable-test'];
  const first = runHelper(...args);
  const second = runHelper(...args);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(first.stdout, second.stdout);

  const mission = JSON.parse(first.stdout);
  assert.match(mission.pathId, /^.+__.+__.+$/);
  assert.equal(mission.mode, 'freestyle');
  assert.equal(mission.difficulty.id, 'field');
  assert.equal(mission.stages.length, 5);
  assert.equal(mission.rubric.reduce((sum, item) => sum + item.weight, 0), 100);
  assert.ok(mission.products.length >= 3);
  assert.equal(mission.sourceSnapshot.verifiedAsOf, skillContent.VERIFIED_AS_OF);
});
