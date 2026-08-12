import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCatalog } from '../src/catalog.js';
import { answerQuiz, createSession, currentStage, debrief, quizFor, submitTurn } from '../src/engine.js';

function finishGuided(choice) {
  const session = createSession({ variantId: buildCatalog()[0].id, mode: 'guided', difficulty: 'field' });
  while (!session.complete) submitTurn(session, choice);
  return session;
}

test('best guided branch completes and produces a bounded six-part rubric', () => {
  const session = finishGuided(0);
  const questions = quizFor(session);
  answerQuiz(session, questions.map((x) => x.answer));
  const report = debrief(session);
  assert.equal(session.transcript.length, 5);
  assert.equal(report.dimensions.length, 6);
  assert.ok(report.total >= 90 && report.total <= 100);
  assert.equal(report.quizCorrect, 3);
});
test('weak guided choices score below the best path', () => {
  const best = finishGuided(0); answerQuiz(best, quizFor(best).map((x) => x.answer));
  const weak = finishGuided(2); answerQuiz(weak, quizFor(weak).map(() => 2));
  assert.ok(debrief(weak).total < debrief(best).total);
});

test('freestyle exposes matched concepts as evidence', () => {
  const session = createSession({ variantId: buildCatalog()[1].id, mode: 'freestyle', difficulty: 'warm' });
  const result = submitTurn(session, 'May I ask a question to understand your priority outcome and risk?');
  assert.ok(result.matched.length >= 3);
  assert.equal(session.transcript[0].matched.length, result.matched.length);
  assert.equal(currentStage(session).id, 'discovery');
});

test('invalid state transitions are rejected', () => {
  const session = createSession({ variantId: buildCatalog()[0].id, mode: 'guided', difficulty: 'field' });
  assert.throws(() => submitTurn(session, 9), /Invalid guided answer/);
  assert.throws(() => answerQuiz(session, [0, 0, 0]), /Finish the conversation/);
});
