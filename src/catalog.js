import { personalities, products, roles, scenarios, sources } from './content.js';

export function buildCatalog() {
  return scenarios.flatMap((scenario) => personalities.flatMap((personality) => roles.map((role) => ({
    id: `${scenario.id}__${personality.id}__${role.id}`,
    scenarioId: scenario.id,
    personalityId: personality.id,
    roleId: role.id,
    title: `${scenario.title} / ${personality.name} / ${role.name}`
  }))));
}
export function resolveVariant(id) {
  const item = buildCatalog().find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown conversation path: ${id}`);
  return {
    ...item,
    scenario: scenarios.find((x) => x.id === item.scenarioId),
    personality: personalities.find((x) => x.id === item.personalityId),
    role: roles.find((x) => x.id === item.roleId)
  };
}

export function validateContent() {
  const errors = [];
  const unique = (items, label) => {
    const ids = items.map((x) => x.id);
    if (new Set(ids).size !== ids.length) errors.push(`${label} IDs must be unique`);
  };
  unique(sources, 'Source'); unique(products, 'Product'); unique(personalities, 'Personality');
  unique(roles, 'Role'); unique(scenarios, 'Scenario');

  if (scenarios.length < 20) errors.push('At least 20 authored scenarios are required');
  if (personalities.length < 6) errors.push('At least 6 personalities are required');
  if (roles.length < 3) errors.push('At least 3 roles are required');

  const sourceIds = new Set(sources.map((x) => x.id));
  const productIds = new Set(products.map((x) => x.id));
  for (const source of sources) {
    let host;
    try { host = new URL(source.url).hostname; } catch { errors.push(`Invalid source URL: ${source.id}`); }
    if (host && host !== 'www.uipath.com' && host !== 'docs.uipath.com') errors.push(`Non-official source: ${source.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.checked)) errors.push(`Invalid checked date: ${source.id}`);
  }
  for (const item of products) {
    if (!['GA', 'Preview'].includes(item.status)) errors.push(`Invalid product status: ${item.id}`);
    if (!item.sourceIds.length || item.sourceIds.some((id) => !sourceIds.has(id))) errors.push(`Broken sources: ${item.id}`);
    if (!item.quiz || item.quiz.options.length !== 3 || item.quiz.answer < 0 || item.quiz.answer > 2) errors.push(`Invalid quiz: ${item.id}`);
  }
  for (const item of scenarios) {
    if (item.products.length < 3 || item.products.some((id) => !productIds.has(id))) errors.push(`Broken products: ${item.id}`);
    if (item.metrics.length < 3) errors.push(`Scenario needs three metrics: ${item.id}`);
  }
  const catalog = buildCatalog();
  if (catalog.length <= 300) errors.push(`Catalog has only ${catalog.length} variants`);
  if (new Set(catalog.map((x) => x.id)).size !== catalog.length) errors.push('Catalog IDs must be unique');
  return { errors, counts: { scenarios: scenarios.length, personalities: personalities.length, roles: roles.length, products: products.length, sources: sources.length, variants: catalog.length } };
}
