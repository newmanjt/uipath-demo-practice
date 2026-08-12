import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalog, resolveVariant, validateContent } from '../src/catalog.js';
import { personalities, roles, scenarios } from '../src/content.js';

test('catalog exposes one stable variant per scenario/personality/role tuple', () => {
  const catalog = buildCatalog();
  assert.equal(catalog.length, scenarios.length * personalities.length * roles.length);
  assert.ok(catalog.length > 300);
  assert.equal(new Set(catalog.map((x) => x.id)).size, catalog.length);
  const resolved = resolveVariant(catalog[42].id);
  assert.equal(resolved.id, catalog[42].id);
  assert.ok(resolved.scenario && resolved.personality && resolved.role);
});
test('all authored content and official sources validate', () => {
  const result = validateContent();
  assert.deepEqual(result.errors, []);
  assert.equal(result.counts.variants, 360);
});
