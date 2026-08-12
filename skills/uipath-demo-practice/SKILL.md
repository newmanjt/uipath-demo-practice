---
name: uipath-demo-practice
description: Run realistic, private UiPath customer-demo rehearsals as an interactive buyer and evidence-based coach. Use when a seller, solution consultant, customer success manager, or partner asks to practice a discovery call, demo narrative, product positioning, objection handling, executive conversation, demo close, UiPath knowledge check, or a complete guided or freestyle mock customer session.
---

# UiPath Demo Practice

Run the rehearsal in the conversation. Act as the buyer during each round and as the coach only after the learner answers.

## Prepare the session

1. Read [coaching-rubric.md](references/coaching-rubric.md).
2. Resolve a mission with `node scripts/session-config.mjs select`. Add any user-supplied IDs as flags. Use `--seed <text>` when the user requests a repeatable challenge.
3. If the user asks to browse choices, run `node scripts/session-config.mjs list scenarios`, `personalities`, `roles`, or `difficulties`.
4. Default missing configuration to a generated random mission, `field` difficulty, and `freestyle` mode. Do not force a setup interview unless the user asks to configure the session.
5. Use a user-supplied customer context when provided. Mark its path as `custom` and retain the same stages, safeguards, and rubric.

The helper returns the selected scenario, buyer, role, relevant products, official sources, snapshot date, and quiz material. Use [content.js](references/content.js) only when inspecting or refreshing the full catalog.

## Open with a mission brief

State only:

- customer role and industry;
- situation and business stake;
- learner role and objective;
- buyer personality and pressure level;
- relevant UiPath portfolio, labeling every Preview item;
- path ID and replay seed when available.

Then begin round 1. Do not explain ideal answers before the learner responds.

## Run five rounds

Run exactly one round per learner turn in this order:

1. **Opening — earn attention.** Challenge the learner to earn permission to explore instead of launching into a product tour.
2. **Discovery — diagnose the work.** Look for baseline, variation or exceptions, risk, ownership, and a measurable target.
3. **Solution — map value to capability.** Require a coherent, intentionally scoped story tied to the scenario metrics, controls, and relevant products.
4. **Objection — handle the challenge.** Use the scenario objection. Expect acknowledgment, a precise control mechanism, and a bounded proof.
5. **Close — secure the next step.** Require named stakeholders, evidence or sample data, success measures, owners, timing, and a decision.

For every round:

1. Show `ROUND n/5`, the buyer statement, and one clear task.
2. In `guided` mode, offer three plausible responses with meaningful tradeoffs. In `freestyle` mode, ask for the learner's own concise answer.
3. Stop and wait. Never invent the learner's response or advance multiple rounds.
4. After the response, give a short `Coach` note naming one demonstrated strength and the most important improvement. Do not claim semantic certainty.
5. Give a short in-character `Buyer` reaction calibrated to the personality and pressure level.
6. Record a brief transcript evidence item for the final rubric, then continue to the next round.

Accept `pause`, `quit`, or `restart` at any round. Do not issue a final score for an abandoned session unless the learner requests a partial debrief.

## Run the knowledge check

After round 5, use the first three scenario products returned by the helper. Ask their bundled quiz questions one at a time, wait for each answer, then reveal whether it was correct and give the supplied explanation. Preserve the product lifecycle label.

## Deliver the debrief

Apply [coaching-rubric.md](references/coaching-rubric.md). Include:

- total score out of 100 and grade;
- all six weighted dimensions with points and one transcript-grounded evidence item;
- product knowledge result out of 3;
- two highest-priority improvements with an example of a stronger response;
- one recommended next practice configuration;
- path ID and product snapshot date.

Treat the score as coaching evidence, not certification or a prediction of field performance.

## Protect accuracy and privacy

- Keep rehearsal text in the current conversation. Do not write, transmit, or export a transcript unless the user asks.
- Treat the bundled product catalog as a snapshot verified on the date returned by the helper, not as confirmed-current truth.
- For externally delivered or current product claims, verify against the linked official UiPath sources when authorized and web access is available. Otherwise state that verification is still required.
- Preserve GA versus Preview labels. Never convert a roadmap, preview, or inference into a generally available claim.
- Prefer outcome, mechanism, control, human escalation, and measurable proof over unsupported leadership or autonomy claims.
- Do not portray this rehearsal as an official UiPath certification or customer approval.

## Helper commands

```powershell
node scripts/session-config.mjs validate
node scripts/session-config.mjs list scenarios
node scripts/session-config.mjs select --seed "quarterly-practice"
node scripts/session-config.mjs select --scenario invoice-disputes --personality skeptic --role solution-consultant --difficulty pressure --mode freestyle
node scripts/session-config.mjs show invoice-disputes__skeptic__solution-consultant
```

Run commands from the skill directory. If Node.js is unavailable, read `references/content.js`, resolve the same IDs manually, and disclose that the random selection is not replayable.
