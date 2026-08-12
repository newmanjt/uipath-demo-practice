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
- [x] Users can select or randomize at least 20 scenarios, 6 buyer personalities, exactly 5 UiPath-aligned roles,
  3 difficulty levels, and guided or freestyle mode.
- [x] Playable roles are Account Executive, Sales Engineer, Sales Specialist for `<tech>`, Technical Account Manager,
  and Customer Success Manager.
- [x] Sales Specialist resolves to a requested product in the selected scenario or the scenario's primary product by
  default, and rejects technologies outside the scenario.
- [x] The scenario, personality, and role dimensions generate 600 unique stable path IDs.
- [x] Seeded selection is deterministic and exposes a replayable path ID.
- [x] Rehearsals run one learner turn at a time through opening, discovery, solution, objection, and close.
- [x] The coach does not reveal an ideal answer before the learner responds or fabricate learner turns.
- [x] Completed sessions include three product questions and a 100-point evidence-based rubric across six dimensions.
- [x] Product facts cover only GA capabilities, use publicly accessible official UiPath sources, and expose a visible verification date.
- [x] The skill does not persist or export transcript text without explicit user direction.
- [x] The local CLI remains dependency-free, Node.js 20+ compatible, and private by default.
- [x] A protected installer supports dry-run, custom destination, first install, and overwrite refusal.
- [x] Automated checks cover skill metadata, content integrity, stable variants, scoring bounds, persistence, installation, and CLI smoke behavior.

## Non-goals

- Simulating a real customer or guaranteeing sales readiness.
- Acting as an official UiPath certification, product, or source of current availability truth.
- Calling hosted models from repository scripts, requiring UiPath credentials, or writing to CRM systems.
- Persisting agent-session transcripts or team leaderboards.
- Publishing customer-specific, confidential, internal-only, pre-release, roadmap, or unreleased product content.

## Privacy and accuracy constraints

- Never require credentials or customer data for practice.
- Keep terminal progress local and ignored by Git.
- Retain source dates and reject any product entry that is not generally available.
- Treat qualitative scores as coaching evidence, not objective performance measurement.
- Prefer bounded automation, least privilege, observable controls, and human escalation over unsupported autonomy.

## Product-content baseline

The bundled catalog carries its own `VERIFIED_AS_OF` date and public official source list in `skills/uipath-demo-practice/references/content.js`. A public release must verify unauthenticated access to those sources, confirm every retained capability is GA, and run the full validation suite before changing the date.
