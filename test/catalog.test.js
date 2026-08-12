import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalog, resolveVariant, validateContent } from '../src/catalog.js';
import { personalities, products, roles, scenarios, sources } from '../src/content.js';

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

test('catalog contains only GA products backed by public official sources', () => {
  const maestroCase = products.find((product) => product.id === 'maestro-case');
  assert.equal(maestroCase?.status, 'GA');
  assert.equal(products.length, 14);
  assert.ok(products.every((product) => product.status === 'GA'));
  assert.equal(products.some((product) => ['maestro-flow', 'coding-agents'].includes(product.id)), false);
  assert.doesNotMatch(JSON.stringify({ products, scenarios }), /\bpreview\b/i);
  assert.ok(maestroCase.sourceIds.includes('maestro-case-reference'));
  assert.ok(maestroCase.sourceIds.includes('maestro-case-sla'));
  assert.match(maestroCase.facts.join(' '), /generally available/i);
  const sourceIds = new Set(sources.map((source) => source.id));
  const usedSourceIds = new Set(products.flatMap((product) => product.sourceIds));
  assert.ok(maestroCase.sourceIds.every((id) => sourceIds.has(id)));
  assert.equal(usedSourceIds.size, sources.length);
  assert.ok(sources.every((source) => ['www.uipath.com', 'docs.uipath.com'].includes(new URL(source.url).hostname)));
});
