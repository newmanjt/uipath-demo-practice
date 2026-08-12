# UiPath Demo Arena

**Choose your role. Draw a buyer. Play five rounds. Level up your next customer conversation.**

UiPath Demo Arena turns customer-call rehearsal into a replayable, game-based challenge. Enter a realistic scenario,
respond to an interactive buyer, test your product knowledge, and finish with an evidence-based scorecard you can use
to plan your next run.

The arena is designed for UiPath employees, partners, customers, and automation practitioners. Play through an
installable agent skill or an optional dependency-free terminal application. No UiPath account, API key,
hosted-model integration, or telemetry is required.

> [!IMPORTANT]
> This is an independent community practice aid. It is not an official UiPath product, certification, readiness
> assessment, or statement of product availability. UiPath product content is source-dated and must be rechecked
> before external use.

## The game loop

| Stage | Your objective |
| --- | --- |
| **Choose your loadout** | Select a practitioner role, customer scenario, buyer personality, pressure level, and play mode. |
| **Play five rounds** | Navigate the opening, discovery, solution, objection, and close—one learner turn at a time. |
| **Take the knowledge challenge** | Answer three questions about the UiPath capabilities used in your mission. |
| **Read the scorecard** | Review a 100-point, transcript-grounded debrief with strengths and priority improvements. |
| **Replay and level up** | Try another path, raise the pressure, or reuse a seed to beat the same challenge with a sharper response. |

Twenty enterprise scenarios, six buyer personalities, and five practitioner roles create **600 stable paths** before
difficulty, play-mode, and learner-response variation.

## Playable UiPath roles

- **Account Executive** — drive business value, stakeholder alignment, and a concrete next step.
- **Sales Engineer** — translate requirements into an accurate solution and credible demo architecture.
- **Sales Specialist for `<tech>`** — establish differentiated value, fit, and proof for a selected UiPath technology.
- **Technical Account Manager** — protect technical health, reduce adoption risk, and scale realized value.
- **Customer Success Manager** — drive adoption, outcomes, and a sustainable operating model.

For a Sales Specialist mission, name a technology already included in the scenario or let the arena use that
scenario's primary product.

## Ways to play

- **Quick challenge:** jump into a random field-ready freestyle mission.
- **Custom mission:** choose the industry, buyer, role, difficulty, and guided or freestyle mode.
- **Guided run:** select from three plausible responses and learn from the tradeoffs.
- **Freestyle run:** answer in your own words and receive transparent, evidence-based coaching.
- **Pressure test:** face a less patient buyer who challenges vague claims and weak controls.
- **Seeded replay:** share or replay the same challenge using a stable seed and path ID.

The arena tracks personal best, average score, distinct paths, practice streak, and recommended focus locally when you
use the terminal application. It does not publish team leaderboards or claim that a score predicts sales performance.

## Enter the arena with the agent skill

### Ask Codex to install from GitHub

```text
Install the uipath-demo-practice skill from https://github.com/newmanjt/uipath-demo-practice/tree/main/skills/uipath-demo-practice
```

The skill becomes available on the next turn after installation. Start a quick challenge:

```text
Use $uipath-demo-practice to enter the arena with a field-ready freestyle mission.
```

Other challenges:

```text
Use $uipath-demo-practice to run an Account Executive pressure test with a skeptical banking buyer.

Use $uipath-demo-practice to run a Sales Specialist for Maestro pressure test with a technical banking buyer.

Use $uipath-demo-practice to give me a guided objection-handling challenge for enterprise agents.

Use $uipath-demo-practice to replay the challenge with seed quarterly-review.
```

### Install from a clone

Requires Node.js 20 or newer:

```powershell
git clone https://github.com/newmanjt/uipath-demo-practice.git
cd uipath-demo-practice
node scripts\install-skill.mjs
```

The installer defaults to `$CODEX_HOME/skills/uipath-demo-practice`, or `~/.codex/skills/uipath-demo-practice` when
`CODEX_HOME` is unset. It refuses to overwrite an existing installation. Inspect the destination without writing:

```powershell
node scripts\install-skill.mjs --dry-run
```

## Play in the local terminal

Requires Node.js 20 or newer. No package installation is needed.

```powershell
git clone https://github.com/newmanjt/uipath-demo-practice.git
cd uipath-demo-practice
npm.cmd test
npm.cmd start
```

On macOS or Linux, use `npm` instead of `npm.cmd`. Terminal stats are stored in `.demo-arena/progress.json`, which is
ignored by Git.

## What the score measures

The 100-point debrief uses six evidence-based dimensions:

- discovery;
- value articulation;
- product accuracy;
- objection handling;
- buyer adaptability;
- next-step quality.

The score is a coaching device—not a certification, readiness verdict, or prediction of field performance. Every
dimension cites something the learner actually said, and the debrief recommends the next mission based on the most
important improvement areas.

## Product coverage and freshness

The catalog covers UiPath Agents and Agent Builder, Maestro, Maestro Case, ScreenPlay, Studio and Studio Web,
Autopilot, IXP, Document Understanding, Integration Service and API Workflows,
Orchestrator, Robots and Automation Cloud Robots, Test Cloud, process intelligence, Action Center, Apps, Data Fabric,
and Insights.

The catalog includes only generally available capabilities and claims supported by publicly accessible official UiPath
sources. Pre-release, roadmap, internal-only, and confidential material is excluded. The source-check date is displayed
in every completed debrief. Cloud capabilities change continuously, so verify the linked sources before relying on a
claim in an external conversation.

## Privacy and responsible play

- The skill does not write or export transcripts unless the user explicitly asks.
- The CLI does not transmit responses and stores only local stats.
- Do not enter customer-confidential data, credentials, personal data, or unreleased product information.
- Scores are coaching evidence, not certification or a prediction of sales performance.
- Product challenges teach qualified positioning, human escalation, least privilege, and bounded validation rather
  than unsupported autonomy claims.

See [SECURITY.md](SECURITY.md) for private vulnerability reporting.

## Build new missions

Scenario ideas, buyer challenges, product corrections, and code contributions are welcome from UiPath employees,
partners, customers, and community practitioners. See [CONTRIBUTING.md](CONTRIBUTING.md).

```powershell
npm.cmd test
npm.cmd run skill:validate
npm.cmd run validate
npm.cmd run smoke
npm.cmd run check
```

The project is available under the [MIT License](LICENSE).
