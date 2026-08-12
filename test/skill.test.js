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
  const rubric = await readFile(new URL('references/coaching-rubric.md', skillUrl), 'utf8');
  const helper = await readFile(new URL('scripts/session-config.mjs', skillUrl), 'utf8');
  const packageJson = JSON.parse(await readFile(new URL('package.json', skillUrl), 'utf8'));
  assert.match(skill, /^---\r?\nname: uipath-demo-practice\r?\ndescription: .+\r?\n---/);
  assert.doesNotMatch(skill, /\[TODO/);
  assert.match(yaml, /display_name: "UiPath Demo Arena"/);
  assert.match(yaml, /\$uipath-demo-practice/);
  assert.equal(packageJson.type, 'module');
  assert.doesNotMatch([skill, rubric, helper, JSON.stringify(skillContent.products)].join('\n'), /\bpreview\b/i);
});

test('skill owns the canonical content exported through the CLI adapter', () => {
  assert.strictEqual(appContent.scenarios, skillContent.scenarios);
  assert.strictEqual(appContent.products, skillContent.products);
  assert.equal(skillContent.scenarios.length * skillContent.personalities.length * skillContent.roles.length, 600);
});

test('session helper lists the mapped roles and resolves Sales Specialist technology', () => {
  const listed = runHelper('list', 'roles');
  assert.equal(listed.status, 0, listed.stderr);
  assert.deepEqual(JSON.parse(listed.stdout).map(({ id, name }) => ({ id, name })), [
    { id: 'account-executive', name: 'Account Executive' },
    { id: 'sales-engineer', name: 'Sales Engineer' },
    { id: 'sales-specialist', name: 'Sales Specialist for <tech>' },
    { id: 'technical-account-manager', name: 'Technical Account Manager' },
    { id: 'customer-success', name: 'Customer Success Manager' }
  ]);

  const selected = runHelper(
    'select', '--seed', 'specialist-test', '--scenario', 'loan-origination',
    '--personality', 'skeptic', '--role', 'sales-specialist', '--technology', 'maestro'
  );
  assert.equal(selected.status, 0, selected.stderr);
  const mission = JSON.parse(selected.stdout);
  assert.equal(mission.pathId, 'loan-origination__skeptic__sales-specialist');
  assert.equal(mission.role.name, 'Sales Specialist for UiPath Maestro');
  assert.deepEqual(mission.role.technology, { id: 'maestro', name: 'UiPath Maestro' });

  const defaulted = runHelper(
    'select', '--seed', 'specialist-default', '--scenario', 'loan-origination', '--role', 'sales-specialist'
  );
  assert.equal(defaulted.status, 0, defaulted.stderr);
  assert.equal(JSON.parse(defaulted.stdout).role.technology.id, 'maestro-case');

  const unavailable = runHelper(
    'select', '--scenario', 'loan-origination', '--role', 'sales-specialist', '--technology', 'screenplay'
  );
  assert.equal(unavailable.status, 2);
  assert.match(unavailable.stderr, /Technology screenplay is not available for loan-origination/);

  const wrongRole = runHelper(
    'select', '--scenario', 'loan-origination', '--role', 'sales-engineer', '--technology', 'maestro'
  );
  assert.equal(wrongRole.status, 2);
  assert.match(wrongRole.stderr, /technology can only be used with the sales-specialist role/);
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
  assert.ok(mission.products.every((product) => product.status === 'GA'));
  assert.ok(mission.sourceSnapshot.sources.every((source) => ['www.uipath.com', 'docs.uipath.com'].includes(new URL(source.url).hostname)));
  assert.equal(mission.sourceSnapshot.verifiedAsOf, skillContent.VERIFIED_AS_OF);
});
