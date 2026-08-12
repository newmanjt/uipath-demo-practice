import { buildCatalog, validateContent } from './catalog.js';
import { createSession, debrief, quizFor, submitTurn, answerQuiz } from './engine.js';

export function validateAll() {
  const result = validateContent();
  if (!result.errors.length) {
    const sampleIds = [buildCatalog()[0].id, buildCatalog().at(-1).id];
    for (const variantId of sampleIds) {
      const session = createSession({ variantId, mode: 'guided', difficulty: 'pressure' });
      while (!session.complete) submitTurn(session, 0);
      answerQuiz(session, quizFor(session).map((x) => x.answer));
      const report = debrief(session);
      if (report.total < 0 || report.total > 100) result.errors.push(`Score out of bounds: ${variantId}`);
      if (report.dimensions.length !== 6) result.errors.push(`Rubric incomplete: ${variantId}`);
    }
  }
  return result;
}

if (process.argv[1] && import.meta.url === new URL(`file:///${process.argv[1].replaceAll('\\', '/')}`).href) {
  const result = validateAll();
  if (result.errors.length) {
    console.error('Content validation failed:');
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`VALIDATION_OK ${JSON.stringify(result.counts)}`);
  }
}
