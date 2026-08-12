#!/usr/bin/env node
// Dependency-free mission selection and catalog validation for the public skill.
import { randomBytes } from 'node:crypto';
import {
  VERIFIED_AS_OF,
  difficulties,
  personalities,
  products,
  roles,
  rubric,
  scenarios,
  sources
} from '../references/content.js';

const modes = ['guided', 'freestyle'];
const stageIds = ['opening', 'discovery', 'solution', 'objection', 'close'];

function usage(message) {
  if (message) console.error(`Error: ${message}`);
  console.error(`Usage:
  node scripts/session-config.mjs validate
  node scripts/session-config.mjs list <scenarios|personalities|roles|difficulties|products>
  node scripts/session-config.mjs select [--seed text] [--scenario id] [--personality id] [--role id] [--difficulty id] [--mode guided|freestyle]
  node scripts/session-config.mjs show <scenario__personality__role> [--difficulty id] [--mode guided|freestyle]`);
  process.exitCode = 2;
}

function parseFlags(args) {
  const flags = {};
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}`);
    const key = token.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for --${key}`);
    flags[key] = value;
    index += 1;
  }
  return flags;
}

function hashSeed(seed) {
  let hash = 2166136261;
  for (const character of seed) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomFromSeed(seed) {
  let value = hashSeed(seed);
  return () => {
    value += 0x6D2B79F5;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

function find(items, id, label) {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Unknown ${label}: ${id}`);
  return item;
}

function pick(items, random) {
  return items[Math.floor(random() * items.length)];
}

function mission({ seed, scenarioId, personalityId, roleId, difficultyId, mode }) {
  const replaySeed = seed || randomBytes(8).toString('hex');
  const random = randomFromSeed(replaySeed);
  const scenario = scenarioId ? find(scenarios, scenarioId, 'scenario') : pick(scenarios, random);
  const personality = personalityId ? find(personalities, personalityId, 'personality') : pick(personalities, random);
  const role = roleId ? find(roles, roleId, 'role') : pick(roles, random);
  const difficulty = difficultyId ? find(difficulties, difficultyId, 'difficulty') : find(difficulties, 'field', 'difficulty');
  const selectedMode = mode || 'freestyle';
  if (!modes.includes(selectedMode)) throw new Error(`Unknown mode: ${selectedMode}`);

  const relevantProducts = scenario.products.map((id) => find(products, id, 'product'));
  const relevantSourceIds = new Set(relevantProducts.flatMap((product) => product.sourceIds));
  return {
    schemaVersion: 1,
    seed: replaySeed,
    pathId: `${scenario.id}__${personality.id}__${role.id}`,
    mode: selectedMode,
    difficulty,
    role,
    buyer: personality,
    scenario,
    products: relevantProducts,
    stages: stageIds,
    rubric,
    sourceSnapshot: {
      verifiedAsOf: VERIFIED_AS_OF,
      sources: sources.filter((source) => relevantSourceIds.has(source.id))
    }
  };
}

function validate() {
  const errors = [];
  const unique = (items, label) => {
    if (new Set(items.map((item) => item.id)).size !== items.length) errors.push(`${label} IDs must be unique`);
  };
  unique(sources, 'Source');
  unique(products, 'Product');
  unique(personalities, 'Personality');
  unique(roles, 'Role');
  unique(scenarios, 'Scenario');

  const sourceIds = new Set(sources.map((source) => source.id));
  const productIds = new Set(products.map((product) => product.id));
  if (scenarios.length < 20) errors.push('At least 20 scenarios are required');
  if (personalities.length < 6) errors.push('At least 6 personalities are required');
  if (roles.length < 3) errors.push('At least 3 roles are required');
  if (rubric.reduce((sum, item) => sum + item.weight, 0) !== 100) errors.push('Rubric weights must total 100');

  for (const source of sources) {
    let url;
    try { url = new URL(source.url); } catch { errors.push(`Invalid source URL: ${source.id}`); continue; }
    if (!['www.uipath.com', 'docs.uipath.com'].includes(url.hostname)) errors.push(`Non-official source: ${source.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.checked)) errors.push(`Invalid source date: ${source.id}`);
  }
  for (const product of products) {
    if (!['GA', 'Preview'].includes(product.status)) errors.push(`Invalid lifecycle status: ${product.id}`);
    if (!product.sourceIds.length || product.sourceIds.some((id) => !sourceIds.has(id))) errors.push(`Broken product sources: ${product.id}`);
    if (!product.quiz || product.quiz.options?.length !== 3 || ![0, 1, 2].includes(product.quiz.answer)) errors.push(`Invalid quiz: ${product.id}`);
  }
  for (const scenario of scenarios) {
    if (scenario.products.length < 3 || scenario.products.some((id) => !productIds.has(id))) errors.push(`Broken scenario products: ${scenario.id}`);
    if (scenario.metrics.length < 3) errors.push(`Scenario needs three metrics: ${scenario.id}`);
  }

  const counts = {
    scenarios: scenarios.length,
    personalities: personalities.length,
    roles: roles.length,
    products: products.length,
    sources: sources.length,
    variants: scenarios.length * personalities.length * roles.length
  };
  if (counts.variants <= 300) errors.push(`Only ${counts.variants} stable variants`);
  return { errors, counts };
}

function list(kind) {
  const collections = { scenarios, personalities, roles, difficulties, products };
  const items = collections[kind];
  if (!items) throw new Error(`Unknown list: ${kind}`);
  return items.map((item) => ({
    id: item.id,
    name: item.title || item.name,
    detail: item.industry || item.style || item.objective || item.note || `${item.status}: ${item.summary}`
  }));
}

function show(pathId, flags) {
  const matched = scenarios.flatMap((scenario) => personalities.flatMap((personality) => roles.map((role) => ({ scenario, personality, role }))))
    .find(({ scenario, personality, role }) => `${scenario.id}__${personality.id}__${role.id}` === pathId);
  if (!matched) throw new Error(`Unknown path ID: ${pathId}`);
  return mission({
    seed: flags.seed || `path:${pathId}`,
    scenarioId: matched.scenario.id,
    personalityId: matched.personality.id,
    roleId: matched.role.id,
    difficultyId: flags.difficulty,
    mode: flags.mode
  });
}

try {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'validate') {
    const result = validate();
    if (result.errors.length) {
      console.error(JSON.stringify(result, null, 2));
      process.exitCode = 1;
    } else console.log(`SKILL_CONTENT_OK ${JSON.stringify(result.counts)}`);
  } else if (command === 'list') {
    if (args.length !== 1) usage('list requires one collection name');
    else console.log(JSON.stringify(list(args[0]), null, 2));
  } else if (command === 'select') {
    const flags = parseFlags(args);
    console.log(JSON.stringify(mission({
      seed: flags.seed,
      scenarioId: flags.scenario,
      personalityId: flags.personality,
      roleId: flags.role,
      difficultyId: flags.difficulty,
      mode: flags.mode
    }), null, 2));
  } else if (command === 'show') {
    if (!args[0] || args[0].startsWith('--')) usage('show requires a path ID');
    else console.log(JSON.stringify(show(args[0], parseFlags(args.slice(1))), null, 2));
  } else usage(command ? `Unknown command: ${command}` : 'Missing command');
} catch (error) {
  usage(error.message);
}
