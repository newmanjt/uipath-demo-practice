#!/usr/bin/env node
import { cp, mkdir, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const skillName = 'uipath-demo-practice';
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(repositoryRoot, 'skills', skillName);

function usage(message) {
  if (message) console.error(`Error: ${message}`);
  console.error(`Usage: node scripts/install-skill.mjs [--destination-root <path>] [--dry-run]

Installs the skill to <destination-root>/uipath-demo-practice.
The default root is $CODEX_HOME/skills or ~/.codex/skills.`);
  process.exitCode = 2;
}

function parse(args) {
  const options = { dryRun: false, destinationRoot: null };
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--dry-run') options.dryRun = true;
    else if (token === '--destination-root') {
      const value = args[index + 1];
      if (!value || value.startsWith('--')) throw new Error('Missing value for --destination-root');
      options.destinationRoot = value;
      index += 1;
    } else throw new Error(`Unknown option: ${token}`);
  }
  return options;
}

async function exists(path) {
  try { await stat(path); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function main() {
  const options = parse(process.argv.slice(2));
  const defaultRoot = process.env.CODEX_HOME
    ? join(process.env.CODEX_HOME, 'skills')
    : join(homedir(), '.codex', 'skills');
  const destinationRoot = resolve(options.destinationRoot || defaultRoot);
  const destination = join(destinationRoot, skillName);

  if (!(await exists(source))) throw new Error(`Skill source is missing: ${source}`);
  if (await exists(destination)) throw new Error(`Refusing to overwrite existing skill: ${destination}`);

  const plan = { source, destination, dryRun: options.dryRun };
  if (options.dryRun) {
    console.log(`INSTALL_PLAN ${JSON.stringify(plan)}`);
    return;
  }

  await mkdir(destinationRoot, { recursive: true });
  await cp(source, destination, { recursive: true, errorOnExist: true, force: false });
  console.log(`INSTALLED_OK ${JSON.stringify(plan)}`);
}

main().catch((error) => {
  usage(error.message);
});
