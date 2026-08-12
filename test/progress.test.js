import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { emptyProgress, loadProgress, progressSummary, resetProgress, saveResult } from '../src/progress.js';

test('progress persists atomically, summarizes, resets, and recovers from malformed JSON', async (t) => {
  const folder = await mkdtemp(join(tmpdir(), 'demo-arena-test-'));
  const path = join(folder, 'progress.json');
  t.after(() => rm(folder, { recursive: true, force: true }));
  const result = { pathId: 'sample', total: 82, completedAt: '2026-07-20T10:00:00Z', dimensions: [{ name: 'Discovery', normalized: .6 }] };
  await saveResult(result, path);
  const loaded = await loadProgress(path);
  assert.equal(loaded.progress.sessions.length, 1);
  assert.equal(progressSummary(loaded.progress).bestScore, 82);
  const persisted = await readFile(path, 'utf8');
  assert.doesNotThrow(() => JSON.parse(persisted));
  assert.deepEqual(await resetProgress(path), emptyProgress());
  await writeFile(path, '{broken', 'utf8');
  const recovered = await loadProgress(path);
  assert.deepEqual(recovered.progress, emptyProgress());
  assert.match(recovered.warning, /could not be read/);
});
