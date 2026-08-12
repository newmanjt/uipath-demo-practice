import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

export const defaultProgressPath = () => resolve(process.env.DEMO_ARENA_PROGRESS_PATH || '.demo-arena/progress.json');

export function emptyProgress() {
  return { version: 1, sessions: [], bestScore: 0, streak: 0, lastPlayedOn: null };
}
export async function loadProgress(path = defaultProgressPath()) {
  try {
    const parsed = JSON.parse(await readFile(path, 'utf8'));
    if (parsed.version !== 1 || !Array.isArray(parsed.sessions)) throw new Error('Unsupported progress format');
    return { progress: parsed, warning: null };
  } catch (error) {
    if (error.code === 'ENOENT') return { progress: emptyProgress(), warning: null };
    return { progress: emptyProgress(), warning: `Progress could not be read; using a fresh profile (${error.message}).` };
  }
}

export async function saveResult(result, path = defaultProgressPath()) {
  const { progress } = await loadProgress(path);
  const today = result.completedAt.slice(0, 10);
  const previous = progress.lastPlayedOn;
  const yesterday = new Date(`${today}T00:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const next = {
    ...progress,
    sessions: [...progress.sessions, result].slice(-250),
    bestScore: Math.max(progress.bestScore, result.total),
    streak: previous === today ? progress.streak : previous === yesterday.toISOString().slice(0, 10) ? progress.streak + 1 : 1,
    lastPlayedOn: today
  };
  await writeProgress(next, path);
  return next;
}

export async function resetProgress(path = defaultProgressPath()) {
  const next = emptyProgress();
  await writeProgress(next, path);
  return next;
}

async function writeProgress(progress, path) {
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(progress, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  await rename(temporary, path);
}

export function progressSummary(progress) {
  const completed = progress.sessions.length;
  const average = completed ? Math.round(progress.sessions.reduce((sum, x) => sum + x.total, 0) / completed) : 0;
  const practiced = new Set(progress.sessions.map((x) => x.pathId)).size;
  const dimensionTotals = {};
  for (const session of progress.sessions) for (const item of session.dimensions || []) {
    dimensionTotals[item.name] ??= [];
    dimensionTotals[item.name].push(item.normalized);
  }
  const focus = Object.entries(dimensionTotals)
    .map(([name, values]) => ({ name, score: values.reduce((a, b) => a + b, 0) / values.length }))
    .sort((a, b) => a.score - b.score)[0]?.name || 'Complete a session to unlock coaching';
  return { completed, average, practiced, bestScore: progress.bestScore, streak: progress.streak, focus };
}
