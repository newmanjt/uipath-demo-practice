# UiPath Demo Practice

Practice customer discovery, product positioning, objection handling, and next-step conversations with an interactive buyer and evidence-based coach.

This repository provides two private, local-first ways to rehearse:

- an installable agent skill, `uipath-demo-practice`;
- an optional dependency-free terminal application.

It is designed for UiPath employees, partners, customers, and automation practitioners. No UiPath account, API key, hosted-model integration, or telemetry is required. Rehearsal text stays in the active agent conversation; the terminal application stores progress only on the local machine.

> [!IMPORTANT]
> This is an independent community practice aid. It is not an official UiPath product, certification, readiness assessment, or statement of product availability. UiPath product content is source-dated and must be rechecked before external use.

## What you can practice

- Full five-round calls: opening, discovery, solution positioning, objection handling, and close.
- Focused practice across 20 enterprise scenarios and 6 buyer personalities.
- Account Executive, Solution Consultant, and Customer Success Manager perspectives.
- Warm-up, field-ready, and pressure-test difficulty.
- Guided choices or freestyle responses in your own words.
- Three scenario-relevant product questions and a 100-point evidence-based debrief.
- Repeatable challenges using a seed.
- Custom customer contexts while retaining the same coaching safeguards.

The authored catalog produces 360 stable scenario/personality/role paths before learner-response and difficulty variation.

## Install the agent skill

### Ask Codex to install from GitHub

```text
Install the uipath-demo-practice skill from https://github.com/newmanjt/uipath-demo-practice/tree/main/skills/uipath-demo-practice
```

The skill becomes available on the next turn after installation.

### Install from a clone

Requires Node.js 20 or newer:

```powershell
git clone https://github.com/newmanjt/uipath-demo-practice.git
cd uipath-demo-practice
node scripts\install-skill.mjs
```

The installer defaults to `$CODEX_HOME/skills/uipath-demo-practice`, or `~/.codex/skills/uipath-demo-practice` when `CODEX_HOME` is unset. It refuses to overwrite an existing installation. Preview the destination without writing:

```powershell
node scripts\install-skill.mjs --dry-run
```

Then start a rehearsal:

```text
Use $uipath-demo-practice to run a field-ready freestyle rehearsal.
```

Other examples:

```text
Use $uipath-demo-practice to run an Account Executive pressure test with a skeptical banking buyer.

Use $uipath-demo-practice to give me guided objection-handling practice for enterprise agents.

Use $uipath-demo-practice to run a repeatable challenge with seed quarterly-review.
```

## Run the local terminal application

Requires Node.js 20 or newer. No package installation is needed.

```powershell
git clone https://github.com/newmanjt/uipath-demo-practice.git
cd uipath-demo-practice
npm.cmd test
npm.cmd start
```

On macOS or Linux, use `npm` instead of `npm.cmd`. Terminal progress is stored in `.demo-arena/progress.json`, which is ignored by Git.

## Product coverage and freshness

The catalog covers UiPath Agents and Agent Builder, Maestro, Maestro Flow, Maestro Case, ScreenPlay, Studio and Studio Web, UiPath for Coding Agents, Autopilot, IXP, Document Understanding, Integration Service and API Workflows, Orchestrator, Robots and Automation Cloud Robots, Test Cloud, process intelligence, Action Center, Apps, Data Fabric, and Insights.

Facts retain official UiPath source links and explicit GA or Preview labels. The current snapshot date is displayed in every completed debrief. Cloud capabilities change continuously; verify the linked official sources before relying on the content for a customer-facing claim.

## Privacy and responsible use

- The skill does not write or export transcripts unless the user explicitly asks.
- The CLI does not transmit responses and stores only local progress.
- Do not enter customer-confidential data, credentials, personal data, or unreleased product information.
- Scores are coaching evidence, not certification or a prediction of sales performance.
- Product examples teach qualified positioning, human escalation, least privilege, and bounded validation rather than unsupported autonomy claims.

See [SECURITY.md](SECURITY.md) for private vulnerability reporting.

## Validate or contribute

```powershell
npm.cmd test
npm.cmd run skill:validate
npm.cmd run validate
npm.cmd run smoke
npm.cmd run check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and content-refresh requirements. The project is available under the [MIT License](LICENSE).
