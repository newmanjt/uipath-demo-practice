# Evidence-based coaching rubric

Use transcript evidence and the anchors below. Do not infer credit from intent that the learner did not express.

## Scoring method

Rate each dimension from 0 to 4, then convert the rating to its weighted points:

`points = round(weight * rating / 4)`

For Product accuracy only, combine conversation performance and the three-question knowledge check:

`normalized = (conversation_rating / 4 * 0.70) + (quiz_correct / 3 * 0.30)`

`product_points = round(20 * normalized)`

Keep the total between 0 and 100. Use these grades:

- 90–100: Demo virtuoso
- 75–89: Field ready
- 60–74: Building confidence
- 0–59: Practice recommended

## Common rating anchors

- **4 — strong and repeatable:** specific, customer-linked, accurate, controlled, and decision-oriented.
- **3 — credible:** mostly specific and correct, with one meaningful gap or missed connection.
- **2 — partial:** relevant but generic, incomplete, or weakly connected to the customer outcome.
- **1 — weak:** product-first, unsupported, evasive, or missing most of the requested mechanism.
- **0 — absent or harmful:** no usable evidence, a fabricated claim, or advice that removes necessary controls.

## Dimensions

### Discovery — 20 points

Look for the current baseline, variation or exceptions, risk or controls, decision ownership, and a measurable target. Full credit requires layered discovery that creates a demo contract rather than a list of generic questions.

### Value articulation — 20 points

Look for an explicit link from capability to the customer's stated outcome and agreed metric. Full credit distinguishes observed pain, target value, and how success will be measured without inventing ROI.

### Product accuracy — 20 points

Look for accurate capability names, a reason each selected capability fits, deliberate API/UI/deterministic/agent/human boundaries, and claims grounded in the bundled GA-only public-source catalog. Penalize unsupported market, roadmap, autonomy, availability, or production-readiness claims.

### Objection handling — 15 points

Look for acknowledgment of the legitimate concern, a precise guardrail or operating control, and a bounded validation plan with measures and human escalation. Reassurance without mechanism earns at most 2.

### Buyer adaptability — 10 points

Look for language and evidence matched to the selected personality: proof for the skeptic, economics for the executive, architecture and security for the technical evaluator, exceptions for operations, bounded autonomy for the innovator, and adoption for the change leader.

### Next-step quality — 15 points

Look for specific stakeholders, owner, date or time box, representative evidence or data, success measures, and a defined decision. “Send information and reconnect” earns at most 1.

## Evidence and feedback rules

- Cite or closely paraphrase one learner statement per dimension; write `No evidence observed` when none exists.
- Separate product correctness from presentation polish.
- Do not award points merely because a guided option was selected; evaluate the content of that option.
- Give two priority improvements based on the lowest normalized dimensions. Break ties by choosing the issue with the greatest customer or accuracy risk.
- Provide one concise stronger-response example that fits the same scenario. Label it as an example, not the only correct wording.
