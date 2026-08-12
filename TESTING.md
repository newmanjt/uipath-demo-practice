# Testing & verification

## Prerequisites

- Node.js 20 or newer (verified with Node.js 24.17.0).
- No production packages or credentials are required.

## Common commands

```powershell
npm.cmd test
npm.cmd run skill:validate
npm.cmd run validate
npm.cmd run smoke
npm.cmd run check
npm.cmd start
```

- `test` runs skill metadata, deterministic mission selection, canonical-content compatibility, catalog, engine,
  scoring, content, and persistence tests with Node's built-in test runner.
- `skill:validate` checks the skill-owned content, public source hosts, GA-only status, quizzes, references, rubric weights,
  and 360-variant count.
- `validate` checks source hosts/dates, product status and quizzes, scenario references, stable IDs, catalog size, and
  representative complete session/debrief state.
- `smoke` runs a non-interactive five-round conversation, perfect knowledge check, and full debrief without saving.
- `check` syntax-checks every production module plus the skill content and session helper.
- `start` launches the interactive terminal UI.

Run the standard skill structure validator when the local skill-creator package is available:

```powershell
python "$env:USERPROFILE\.codex\skills\.system\skill-creator\scripts\quick_validate.py" skills\uipath-demo-practice
```

## Agent-skill smoke checklist

- [ ] Invoke `$uipath-demo-practice` with no configuration; confirm a field-ready freestyle mission starts without a long setup interview.
- [ ] Confirm the mission brief uses only GA products, includes a path and seed, and then waits after the first buyer turn.
- [ ] Run the same seed twice and confirm the scenario, personality, and role are identical.
- [ ] Complete five rounds and the three-question knowledge challenge one turn at a time.
- [ ] Confirm all six dimensions cite transcript evidence and total no more than 100 points.
- [ ] Confirm the debrief states the current catalog snapshot date and does not claim certification or current-product verification.
- [ ] Enter `quit` during a round and confirm the skill does not fabricate later responses or a final score.

## Manual smoke checklist

- [ ] Home screen shows 360 paths, mission count, personal best, and accepts both numeric actions and Q.
- [ ] Build a guided mission, select all five dimensions, and finish five conversation rounds.
- [ ] Complete the three-question knowledge check and inspect all six rubric dimensions.
- [ ] Configure freestyle mode; confirm feedback lists matched coaching signals rather than claiming semantic certainty.
- [ ] Open Arena Stats and confirm the completed mission, best score, streak, and recommended focus were stored locally.
- [ ] Open Catalog & Sources and verify GA-only/public-source freshness messaging.
- [ ] Enter invalid input and confirm the same menu recovers without exiting.
- [ ] Start a session and enter Q at a round; confirm it exits the session without saving a result.
- [ ] Select Reset, enter anything except uppercase `RESET`, and confirm cancellation.

## Runtime state

Progress defaults to `.demo-arena/progress.json`. Tests use an isolated temporary directory. Set
`DEMO_ARENA_PROGRESS_PATH` to point a manual test at a disposable file. Writes use an adjacent temporary file followed
by an atomic rename. Malformed JSON starts a fresh in-memory profile and shows a warning; it is not silently overwritten
until the user completes a session or explicitly resets.

## Product-content review

The public-release facts are verified as of 2026-08-12. Before refreshing content:

1. Check every retained product against a current official public UiPath product or documentation page.
2. Confirm each source is reachable without authentication and directly supports its bound catalog claims.
3. Check each referenced official product/doc page in
   `skills/uipath-demo-practice/references/content.js`.
4. Reject limited-availability or unreleased capabilities; update `VERIFIED_AS_OF` plus every source `checked` date.
5. Run `npm.cmd run validate` and `npm.cmd test`.

## Public-release check

Before publishing, inspect the exact Git index rather than the whole working directory. Confirm that local state,
internal planning artifacts, credentials, participant identifiers, and customer-confidential data are absent. Review
the staged diff and run every command above on the commit that will be pushed.
