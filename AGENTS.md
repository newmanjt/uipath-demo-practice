# Repository guidance for coding agents

This is a public, privacy-conscious practice project for UiPath customer conversations.

## Read first

1. `README.md` — audience, installation, behavior, and public disclaimers.
2. `SPEC.md` — supported behavior and acceptance criteria.
3. `TESTING.md` — required verification.
4. `CONTRIBUTING.md` — public-content and product-source rules.

## Core rules

- Keep `skills/uipath-demo-practice/` self-contained and portable.
- Treat `skills/uipath-demo-practice/references/content.js` as the canonical catalog. `src/content.js` is only a compatibility re-export for the CLI.
- Never add customer data, credentials, personal data, internal-only prompts, or unreleased product information.
- Use official `uipath.com` or `docs.uipath.com` sources for product claims. Preserve GA/Preview labels and update the verification date only after checking every referenced source.
- Do not portray scores as certification, objective readiness measurement, or a guarantee of sales performance.
- Keep repository scripts dependency-free and compatible with Node.js 20 or newer.
- Refuse to overwrite existing skill installations unless a future explicit upgrade workflow includes backup and confirmation.
- Prefer focused changes; update tests and public docs when behavior changes.

## Required verification

Run before claiming completion:

```powershell
npm.cmd test
npm.cmd run skill:validate
npm.cmd run validate
npm.cmd run smoke
npm.cmd run check
```

Use `npm` instead of `npm.cmd` on macOS or Linux. For a public release, inspect the exact Git index for sensitive or participant-specific content before pushing.
