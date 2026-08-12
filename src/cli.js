#!/usr/bin/env node
import { createInterface } from 'node:readline/promises';
import { randomInt } from 'node:crypto';
import { stdin as input, stdout as output } from 'node:process';
import { buildCatalog } from './catalog.js';
import { difficulties, personalities, products, roles, scenarios, sources, VERIFIED_AS_OF } from './content.js';
import { answerQuiz, createSession, currentStage, debrief, quizFor, submitTurn } from './engine.js';
import { loadProgress, progressSummary, resetProgress, saveResult } from './progress.js';

const ansi = Boolean(output.isTTY && !process.env.NO_COLOR);
const c = (code, text) => ansi ? `\x1b[${code}m${text}\x1b[0m` : text;
const color = { orange: (x) => c('38;5;208', x), cyan: (x) => c('36', x), green: (x) => c('32', x), red: (x) => c('31', x), dim: (x) => c('2', x), bold: (x) => c('1', x) };
const width = () => Math.max(54, Math.min(100, output.columns || 84));
const line = (char = '─') => char.repeat(width());
const clear = () => { if (ansi) output.write('\x1b[2J\x1b[H'); };
const say = (text = '') => output.write(`${text}\n`);

function wrap(text, indent = '') {
  const limit = width() - indent.length;
  return String(text).split('\n').flatMap((paragraph) => {
    const words = paragraph.split(/\s+/).filter(Boolean); const rows = []; let row = indent;
    for (const word of words) {
      if ((row + (row.trim() ? ' ' : '') + word).length > limit + indent.length) { rows.push(row); row = `${indent}${word}`; }
      else row += `${row.trim() ? ' ' : ''}${word}`;
    }
    rows.push(row); return rows;
  }).join('\n');
}

function banner() {
  clear();
  say(color.orange('╭────────────────────────────────────────────────────────────╮'));
  say(color.orange('│') + color.bold('  UIPATH DEMO ARENA  ') + color.dim('practice • adapt • prove • improve') + color.orange('  │'));
  say(color.orange('╰────────────────────────────────────────────────────────────╯'));
  say(color.dim(`Offline trainer • knowledge verified ${VERIFIED_AS_OF}`));
}

function heading(title, subtitle) {
  say(); say(color.cyan(line())); say(color.bold(title)); if (subtitle) say(color.dim(wrap(subtitle))); say(color.cyan(line()));
}

async function pick(rl, title, items, label = (x) => x.name, allowBack = true) {
  heading(title);
  items.forEach((item, i) => say(` ${color.orange(String(i + 1).padStart(2))}  ${label(item)}`));
  if (allowBack) say(` ${color.dim('B')}   Back`);
  for (;;) {
    const raw = (await rl.question(color.cyan('› '))).trim().toLowerCase();
    if (allowBack && ['b', 'back', 'q', 'quit'].includes(raw)) return null;
    const index = Number(raw) - 1;
    if (Number.isInteger(index) && index >= 0 && index < items.length) return items[index];
    say(color.red(`Choose 1-${items.length}${allowBack ? ' or B' : ''}.`));
  }
}

function randomOf(items) { return items[randomInt(items.length)]; }

async function configure(rl) {
  const role = await pick(rl, 'Choose your practitioner role', roles, (x) => `${x.name} — ${x.objective}`); if (!role) return null;
  const personality = await pick(rl, 'Choose the buyer personality', personalities, (x) => `${x.icon} ${x.name} — ${x.style}`); if (!personality) return null;
  const difficulty = await pick(rl, 'Choose pressure level', difficulties, (x) => `${x.name} — ${x.note}`); if (!difficulty) return null;
  const mode = await pick(rl, 'Choose practice mode', [{ id: 'guided', name: 'Guided', note: 'Choose authored responses and get immediate coaching.' }, { id: 'freestyle', name: 'Freestyle', note: 'Type your answer; transparent concept matching scores it.' }], (x) => `${x.name} — ${x.note}`); if (!mode) return null;
  const scenario = await pick(rl, 'Choose a customer scenario', scenarios, (x) => `[${x.industry}] ${x.title}`); if (!scenario) return null;
  return { role, personality, difficulty, mode, scenario };
}

function configToId(config) { return `${config.scenario.id}__${config.personality.id}__${config.role.id}`; }

async function runPractice(rl, config, save = true) {
  const session = createSession({ variantId: configToId(config), mode: config.mode.id, difficulty: config.difficulty.id });
  const { scenario, personality, role } = session.variant;
  heading('MISSION BRIEF', session.variant.id);
  say(`${color.bold(scenario.customer)} • ${scenario.industry}`);
  say(wrap(scenario.situation));
  say(); say(`${color.bold('Business stake:')} ${scenario.stake}`);
  say(`${color.bold('Your role:')} ${role.name} — ${role.objective}`);
  say(`${color.bold('Buyer:')} ${personality.name} — ${personality.style}`);
  say(`${color.bold('Relevant portfolio:')} ${scenario.products.map((id) => { const p = products.find((x) => x.id === id); return `${p.name}${p.status === 'Preview' ? ' [PREVIEW]' : ''}`; }).join(' • ')}`);

  while (!session.complete) {
    const stage = currentStage(session);
    heading(`ROUND ${session.stageIndex + 1}/5 — ${stage.label.toUpperCase()}`, stage.prompt);
    say(color.orange(`${personality.name}:`)); say(wrap(stage.buyer, '  ')); say();
    let answer;
    if (session.mode === 'guided') {
      stage.choices.forEach((choice, i) => { say(` ${color.orange(String(i + 1))}  ${wrap(choice.text, '    ').trimStart()}`); say(); });
      const selected = await pickNumber(rl, stage.choices.length, true); if (selected === null) { say(color.dim('Practice abandoned; no result saved.')); return null; }
      answer = selected;
    } else {
      say(color.dim('Freestyle scoring matches explicit coaching concepts. Be concise but name the mechanism.'));
      const text = (await rl.question(color.cyan('You › '))).trim();
      if (['q', 'quit', 'back'].includes(text.toLowerCase())) { say(color.dim('Practice abandoned; no result saved.')); return null; }
      if (!text) { say(color.red('Answer cannot be empty.')); continue; }
      answer = text;
    }
    const result = submitTurn(session, answer);
    say(color.green(`Coach: ${result.feedback}`));
    say(color.cyan(`Buyer: ${result.reaction}`));
  }

  heading('KNOWLEDGE CHECK', 'Three questions test the products used in this conversation.');
  const questions = quizFor(session); const answers = [];
  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i];
    say(); say(color.bold(`${i + 1}. ${q.q}`)); say(color.dim(`${q.productName} • ${q.status}`));
    q.options.forEach((option, j) => say(`   ${j + 1}  ${option}`));
    const selected = await pickNumber(rl, q.options.length, false); answers.push(selected);
  }
  const reviewed = answerQuiz(session, answers);
  say();
  reviewed.forEach((item, i) => say(`${item.correct ? color.green('✓') : color.red('×')} ${i + 1}. ${item.why}`));
  const report = debrief(session);
  printDebrief(report);
  if (save) { await saveResult(report); say(color.dim('Progress saved locally.')); }
  return report;
}

async function pickNumber(rl, count, allowQuit) {
  for (;;) {
    const raw = (await rl.question(color.cyan('› '))).trim().toLowerCase();
    if (allowQuit && ['q', 'quit', 'b', 'back'].includes(raw)) return null;
    const index = Number(raw) - 1;
    if (Number.isInteger(index) && index >= 0 && index < count) return index;
    say(color.red(`Choose 1-${count}${allowQuit ? ' or Q' : ''}.`));
  }
}

function bar(value, size = 20) {
  const filled = Math.round(value * size);
  return `${color.orange('█'.repeat(filled))}${color.dim('░'.repeat(size - filled))}`;
}

function printDebrief(report) {
  heading(`DEBRIEF — ${report.total}/100 • ${report.grade}`, `Product knowledge: ${report.quizCorrect}/${report.quizTotal} • Facts verified ${report.verifiedAsOf}`);
  for (const item of report.dimensions) {
    say(`${item.name.padEnd(21)} ${bar(item.normalized)} ${String(item.points).padStart(2)}/${item.weight}`);
    say(color.dim(wrap(item.coaching, '  ')));
  }
  say(); say(`${color.bold('Next practice focus:')} ${report.focus.join(' + ')}`);
  say(color.dim(`Path: ${report.pathId}`)); say();
}

async function showProgress(rl) {
  const { progress, warning } = await loadProgress(); const summary = progressSummary(progress);
  heading('YOUR PROGRESS'); if (warning) say(color.red(warning));
  say(`Sessions completed  ${color.bold(summary.completed)}`);
  say(`Distinct paths      ${color.bold(summary.practiced)} / ${buildCatalog().length}`);
  say(`Average score       ${color.bold(summary.average)}`);
  say(`Personal best       ${color.bold(summary.bestScore)}`);
  say(`Practice streak     ${color.bold(summary.streak)} day(s)`);
  say(`Recommended focus   ${color.bold(summary.focus)}`);
  await rl.question(color.dim('\nPress Enter to return.'));
}

async function showCatalog(rl) {
  heading('CATALOG & KNOWLEDGE SOURCES', `${buildCatalog().length} stable variants = ${scenarios.length} scenarios × ${personalities.length} personalities × ${roles.length} roles, before response branching.`);
  say(`${products.length} product topics • ${difficulties.length} pressure levels • guided + freestyle`);
  say(); say(color.bold(`Official sources (checked ${VERIFIED_AS_OF})`));
  sources.forEach((source) => { say(` • ${source.title}`); say(color.dim(`   ${source.url}`)); });
  say(); say(color.dim('Cloud capabilities change continuously. Recheck these links before external claims.'));
  await rl.question(color.dim('\nPress Enter to return.'));
}

async function resetFlow(rl) {
  heading('RESET LOCAL PROGRESS', 'This replaces the local progress profile with an empty one.');
  const value = (await rl.question('Type RESET to confirm: ')).trim();
  if (value === 'RESET') { await resetProgress(); say(color.green('Local progress reset.')); }
  else say(color.dim('Reset cancelled.'));
  await rl.question(color.dim('Press Enter to return.'));
}

async function scripted() {
  const variant = buildCatalog()[0];
  const session = createSession({ variantId: variant.id, mode: 'guided', difficulty: 'field' });
  while (!session.complete) submitTurn(session, 0);
  const questions = quizFor(session); answerQuiz(session, questions.map((x) => x.answer));
  const report = debrief(session); banner(); printDebrief(report);
  if (!process.argv.includes('--no-save')) await saveResult(report);
  say(`SMOKE_OK path=${report.pathId} score=${report.total} quiz=${report.quizCorrect}/${report.quizTotal}`);
}

async function main() {
  if (process.argv.includes('--scripted')) { await scripted(); return; }
  const rl = createInterface({ input, output });
  process.on('SIGINT', () => { say('\nPractice paused. See you next round.'); rl.close(); process.exit(130); });
  try {
    for (;;) {
      banner();
      const { progress, warning } = await loadProgress(); const summary = progressSummary(progress);
      if (warning) say(color.red(warning));
      say(`\n${color.bold('HOME')}  ${summary.completed} sessions • best ${summary.bestScore} • ${buildCatalog().length} paths\n`);
      say(' 1  Configure a practice'); say(' 2  Quick random challenge'); say(' 3  Progress & coaching');
      say(' 4  Catalog & sources'); say(' 5  Reset local progress'); say(' Q  Quit');
      const action = (await rl.question(color.cyan('\n› '))).trim().toLowerCase();
      if (['q', 'quit', 'exit'].includes(action)) break;
      if (action === '1') { const config = await configure(rl); if (config) { await runPractice(rl, config); await rl.question(color.dim('Press Enter for home.')); } }
      else if (action === '2') await runPractice(rl, { role: randomOf(roles), personality: randomOf(personalities), difficulty: randomOf(difficulties), mode: randomOf([{ id: 'guided' }, { id: 'freestyle' }]), scenario: randomOf(scenarios) });
      else if (action === '3') await showProgress(rl);
      else if (action === '4') await showCatalog(rl);
      else if (action === '5') await resetFlow(rl);
      else { say(color.red('Choose 1-5 or Q.')); await rl.question(color.dim('Press Enter to continue.')); }
    }
  } finally { rl.close(); }
  say('Keep practicing the conversation, not just the click path.');
}

main().catch((error) => { console.error(color.red(`Fatal: ${error.message}`)); if (process.env.DEBUG) console.error(error); process.exitCode = 1; });
