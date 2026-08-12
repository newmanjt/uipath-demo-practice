import { difficulties, products, rubric, VERIFIED_AS_OF } from './content.js';
import { resolveVariant } from './catalog.js';

export const STAGE_IDS = ['opening', 'discovery', 'solution', 'objection', 'close'];

const clean = (text) => String(text ?? '').toLowerCase().replace(/[^a-z0-9$%\s-]/g, ' ');
const includesConcept = (text, concept) => concept.split('|').some((word) => text.includes(clean(word).trim()));
const productFor = (id) => products.find((x) => x.id === id);

function stageDefinition(session, index) {
  const { scenario: s, personality: p, role: r } = session.variant;
  const namedProducts = s.products.map(productFor);
  const productNames = namedProducts.map((x) => `${x.name}${x.status === 'Preview' ? ' (Preview)' : ''}`).join(', ');
  const metricText = s.metrics.join(', ');
  const primary = namedProducts[0];
  const stages = [
    {
      id: 'opening', label: 'Earn attention', dimension: 'adaptability',
      buyer: `${p.opening}\n\nContext: ${s.situation}`,
      prompt: `Respond as the ${r.name}. Earn permission to explore rather than launching into a product tour.`,
      concepts: [...p.values, 'question', 'understand|explore', 'outcome|priority'],
      choices: [
        { text: `Before I show anything, which matters most here: ${s.metrics[0]}, ${s.metrics[1]}, or another outcome?`, scores: { adaptability: 1, discovery: .35 }, feedback: 'You matched the buyer and earned a discovery opening.' },
        { text: `I can show several UiPath products. Let me begin with an overview.`, scores: { adaptability: .35 }, feedback: 'Relevant, but product-first and not tailored to this buyer.' },
        { text: `UiPath is the market leader, so this will solve the problem.`, scores: { adaptability: .05, product: .1 }, feedback: 'An unsupported claim loses credibility and skips the customer.' }
      ]
    },
    {
      id: 'discovery', label: 'Diagnose the work', dimension: 'discovery',
      buyer: `Today, ${s.situation.toLowerCase()} The business impact is clear, but every team describes the process differently.`,
      prompt: 'Ask a layered discovery question that reveals baseline, variation, risk, and decision ownership.',
      concepts: ['today|current|baseline', 'exception|variation', 'risk|control', 'owner|stakeholder', ...s.metrics.flatMap((m) => m.split(' '))],
      choices: [
        { text: `What is the current ${s.metrics[0]}, which exceptions drive it, who owns those exceptions, and what target would justify change?`, scores: { discovery: 1, value: .55 }, feedback: 'Strong: baseline, exceptions, ownership, and target create a demo contract.' },
        { text: `How many people perform this process today?`, scores: { discovery: .48, value: .25 }, feedback: 'Useful sizing, but it misses variation, outcome, risk, and ownership.' },
        { text: `Would you like to see our AI features now?`, scores: { discovery: .08, adaptability: .15 }, feedback: 'You left discovery before earning a solution direction.' }
      ]
    },
    {
      id: 'solution', label: 'Map value to capability', dimension: 'product',
      buyer: `Assume our target is better ${s.metrics[0]} without weakening controls. Show only what supports that story.`,
      prompt: `Position a coherent solution using this scenario's relevant products: ${productNames}.`,
      concepts: [primary.name, primary.id, 'because|so that', s.metrics[0], 'governance|control', 'exception|human'],
      choices: [
        { text: `Start with ${primary.name}${primary.status === 'Preview' ? ' (Preview)' : ''} for ${primary.bestFor.toLowerCase()} Then connect only the supporting UiPath capabilities needed for governed exceptions and measure ${s.metrics[0]}.`, scores: { product: 1, value: .9, adaptability: .7 }, feedback: 'Accurate, outcome-led, and intentionally scoped.' },
        { text: `Use ${productNames}; together they can automate the process.`, scores: { product: .58, value: .38 }, feedback: 'The product set fits, but the causal story and operating controls are vague.' },
        { text: `Use an autonomous agent for every step so no human is required.`, scores: { product: .12, value: .18, adaptability: .1 }, feedback: 'Over-automation ignores risk, deterministic work, and human judgment.' }
      ]
    },
    {
      id: 'objection', label: 'Handle the challenge', dimension: 'objection',
      buyer: s.objection,
      prompt: 'Acknowledge the legitimate concern, answer precisely, and propose a way to prove the claim safely.',
      concepts: ['valid|fair|agree', 'risk|concern', 'control|guardrail|governance', 'pilot|test|validate', 'metric|measure', 'human|escalat'],
      choices: [
        { text: `That concern is valid. We would bound the use case, keep deterministic controls where rules are known, define human escalation, and validate against agreed ${metricText} before expanding.`, scores: { objection: 1, product: .78, adaptability: .8 }, feedback: 'You validated the concern and converted it into a testable control plan.' },
        { text: `UiPath has strong governance and many customers, so you do not need to worry.`, scores: { objection: .3, product: .4 }, feedback: 'Reassurance without mechanism or proof does not resolve the concern.' },
        { text: `That risk is outside the scope of this demo.`, scores: { objection: .05, adaptability: .05 }, feedback: 'Avoiding the objection signals that the demo cannot survive production questions.' }
      ]
    },
    {
      id: 'close', label: 'Secure the next step', dimension: 'nextStep',
      buyer: `I see the potential. I do not want another open-ended pilot.`,
      prompt: `Propose a mutual, bounded next step tied to ${s.stake.toLowerCase()}`,
      concepts: ['next|workshop|pilot|validation', 'owner|stakeholder', 'date|week|day', 'metric|success|target', 'data|sample', 'decision'],
      choices: [
        { text: `Let us schedule a 60-minute validation workshop with the process owner, risk lead, and technical owner; use representative samples, agree targets for ${metricText}, and leave with a go/no-go pilot decision and owners.`, scores: { nextStep: 1, value: .9, discovery: .55 }, feedback: 'Specific stakeholders, evidence, metrics, and decision make the next step mutual and bounded.' },
        { text: `I will send more information and we can reconnect soon.`, scores: { nextStep: .28, value: .2 }, feedback: 'Polite but unowned, undated, and not decision-oriented.' },
        { text: `The next step is to buy licenses so implementation can start.`, scores: { nextStep: .08, adaptability: .08 }, feedback: 'You asked for commitment before validating scope, risk, and success.' }
      ]
    }
  ];
  return stages[index];
}

export function createSession({ variantId, mode = 'guided', difficulty = 'field' }) {
  if (!['guided', 'freestyle'].includes(mode)) throw new Error(`Invalid mode: ${mode}`);
  if (!difficulties.some((x) => x.id === difficulty)) throw new Error(`Invalid difficulty: ${difficulty}`);
  const variant = resolveVariant(variantId);
  return {
    version: 1, variant, mode, difficulty, stageIndex: 0, complete: false,
    startedAt: new Date().toISOString(), transcript: [], evidence: Object.fromEntries(rubric.map((x) => [x.id, []])),
    samples: Object.fromEntries(rubric.map((x) => [x.id, []])), quizAnswers: []
  };
}

export function currentStage(session) {
  return session.complete ? null : stageDefinition(session, session.stageIndex);
}

function buyerReaction(session, quality) {
  const threshold = difficulties.find((x) => x.id === session.difficulty).threshold;
  const p = session.variant.personality;
  if (quality >= threshold + .2) return `Good. That addresses my ${p.values[0]} concern. Keep going.`;
  if (quality >= threshold) return 'That is directionally useful, but make the connection more concrete.';
  return `${p.name}: You have not answered what matters to me yet. ${p.coach}`;
}

function addScores(session, scores, evidence) {
  for (const [dimension, value] of Object.entries(scores)) {
    const bounded = Math.max(0, Math.min(1, value));
    session.samples[dimension].push(bounded);
    if (evidence) session.evidence[dimension].push(evidence);
  }
}

export function submitTurn(session, answer) {
  if (session.complete) throw new Error('Conversation is already complete');
  const stage = currentStage(session);
  let text; let scores; let feedback; let matched = [];
  if (session.mode === 'guided') {
    const index = Number(answer);
    if (!Number.isInteger(index) || index < 0 || index >= stage.choices.length) throw new Error('Invalid guided answer');
    const choice = stage.choices[index];
    ({ text, scores, feedback } = choice);
  } else {
    text = String(answer ?? '').trim();
    if (!text) throw new Error('Freestyle answer cannot be empty');
    const normalized = clean(text);
    matched = [...new Set(stage.concepts.filter((concept) => includesConcept(normalized, concept)).map((x) => x.replaceAll('|', '/')))];
    const quality = Math.min(1, matched.length / Math.max(3, Math.ceil(stage.concepts.length * .6)));
    scores = { [stage.dimension]: quality };
    if (stage.id === 'solution') scores.value = quality * .8;
    if (stage.id === 'discovery') scores.value = quality * .45;
    if (stage.id === 'objection') scores.product = quality * .55;
    if (stage.id === 'opening') scores.adaptability = quality;
    if (stage.id === 'close') scores.value = quality * .5;
    feedback = matched.length ? `Matched coaching signals: ${matched.join(', ')}.` : 'No target coaching signals matched; be more explicit and specific.';
  }
  const quality = Math.max(...Object.values(scores));
  addScores(session, scores, `${stage.label}: ${text.slice(0, 180)}`);
  const reaction = buyerReaction(session, quality);
  session.transcript.push({ stage: stage.id, buyer: stage.buyer, player: text, feedback, reaction, matched });
  session.stageIndex += 1;
  session.complete = session.stageIndex >= STAGE_IDS.length;
  return { feedback, reaction, complete: session.complete, matched };
}

export function quizFor(session) {
  return session.variant.scenario.products.slice(0, 3).map((id) => {
    const item = productFor(id);
    return { productId: id, productName: item.name, status: item.status, ...item.quiz };
  });
}

export function answerQuiz(session, answers) {
  if (!session.complete) throw new Error('Finish the conversation before the quiz');
  const questions = quizFor(session);
  if (!Array.isArray(answers) || answers.length !== questions.length) throw new Error('Answer every quiz question');
  session.quizAnswers = questions.map((item, i) => ({ ...item, selected: Number(answers[i]), correct: Number(answers[i]) === item.answer }));
  return session.quizAnswers;
}

const demonstrated = (values) => values.length ? Math.max(...values) : 0;

export function debrief(session) {
  if (!session.complete || !session.quizAnswers.length) throw new Error('Conversation and quiz must be complete');
  const quizRate = session.quizAnswers.filter((x) => x.correct).length / session.quizAnswers.length;
  const dimensions = rubric.map((item) => {
    let normalized = demonstrated(session.samples[item.id]);
    if (item.id === 'product') normalized = normalized * .7 + quizRate * .3;
    const points = Math.round(normalized * item.weight);
    return { ...item, normalized, points, evidence: session.evidence[item.id], coaching: coachingFor(item.id, normalized) };
  });
  const total = dimensions.reduce((sum, item) => sum + item.points, 0);
  const grade = total >= 90 ? 'Demo virtuoso' : total >= 75 ? 'Field ready' : total >= 60 ? 'Building confidence' : 'Practice recommended';
  return {
    pathId: session.variant.id, total, grade, dimensions, quizCorrect: session.quizAnswers.filter((x) => x.correct).length,
    quizTotal: session.quizAnswers.length, verifiedAsOf: VERIFIED_AS_OF, completedAt: new Date().toISOString(),
    focus: dimensions.toSorted((a, b) => a.normalized - b.normalized).slice(0, 2).map((x) => x.name)
  };
}

function coachingFor(id, score) {
  if (score >= .85) return 'Strong and repeatable—keep the precision while shortening the delivery.';
  const tips = {
    discovery: 'Ask for baseline, exceptions, ownership, risk, and a measurable target before showing.',
    value: 'Connect each capability to one customer outcome and an agreed measure.',
    product: 'Name the capability accurately, explain why it fits, and label preview status.',
    objection: 'Validate the concern, explain the control, and propose a bounded proof.',
    adaptability: 'Mirror this buyer’s priorities and trade detail for the evidence they value.',
    nextStep: 'Name stakeholders, date, evidence, success measures, owners, and a decision.'
  };
  return tips[id];
}
