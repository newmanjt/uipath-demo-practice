# Product specification: UiPath Demo Arena

## Purpose

Provide a reusable, privacy-conscious, game-based environment for customer discovery, UiPath positioning, objection
handling, and sales-call closeouts. The primary interface is an agent skill; a dependency-free terminal application
provides an optional deterministic interface.

## Audience

- UiPath employees preparing for customer conversations.
- UiPath partners building discovery and positioning skills.
- Customers and automation practitioners evaluating use cases and operating-model choices.

## Acceptance criteria

- [x] The neutral `uipath-demo-practice` skill is self-contained and contains no participant-specific naming.
- [x] Human-facing copy presents a professional game loop built around missions, five rounds, a knowledge challenge,
  an evidence-based scorecard, and replayable improvement.
- [x] A bare practice request starts a random field-ready freestyle mission without a long setup interview.
- [x] Users can select or randomize at least 20 scenarios, 6 buyer personalities, 3 roles, 3 difficulty levels, and guided or freestyle mode.
- [x] Seeded selection is deterministic and exposes a replayable path ID.
- [x] Rehearsals run one learner turn at a time through opening, discovery, solution, objection, and close.
- [x] The coach does not reveal an ideal answer before the learner responds or fabricate learner turns.
- [x] Completed sessions include three product questions and a 100-point evidence-based rubric across six dimensions.
- [x] Product facts use official UiPath sources, explicit GA/Preview status, and a visible verification date.
- [x] The skill does not persist or export transcript text without explicit user direction.
- [x] The local CLI remains dependency-free, Node.js 20+ compatible, and private by default.
- [x] A protected installer supports dry-run, custom destination, first install, and overwrite refusal.
- [x] Automated checks cover skill metadata, content integrity, stable variants, scoring bounds, persistence, installation, and CLI smoke behavior.

## Non-goals

- Simulating a real customer or guaranteeing sales readiness.
- Acting as an official UiPath certification, product, or source of current availability truth.
- Calling hosted models from repository scripts, requiring UiPath credentials, or writing to CRM systems.
- Persisting agent-session transcripts or team leaderboards.
- Publishing customer-specific, confidential, or unreleased product content.

## Privacy and accuracy constraints

- Never require credentials or customer data for practice.
- Keep terminal progress local and ignored by Git.
- Retain source dates and lifecycle labels when product content changes.
- Treat qualitative scores as coaching evidence, not objective performance measurement.
- Prefer bounded automation, least privilege, observable controls, and human escalation over unsupported autonomy.

## Product-content baseline

The bundled catalog carries its own `VERIFIED_AS_OF` date and official source list in `skills/uipath-demo-practice/references/content.js`. A public release must verify those sources and run the full validation suite before changing the date.
