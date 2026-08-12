# Contributing

Contributions from UiPath employees, partners, customers, and community practitioners are welcome.

## Before opening a change

- Use an issue for substantial new scenarios, scoring changes, public interfaces, or product-coverage changes.
- Never include customer data, credentials, private prompts, internal-only material, or unreleased product information.
- Keep scenarios process-focused and broadly reusable rather than tied to a named customer.
- Use qualified language. Do not add unsupported leadership, ROI, roadmap, availability, or autonomy claims.

## Development

Prerequisite: Node.js 20 or newer. The project has no production dependencies.

```powershell
npm.cmd test
npm.cmd run skill:validate
npm.cmd run validate
npm.cmd run smoke
npm.cmd run check
```

Use `npm` instead of `npm.cmd` on macOS or Linux.

## Product-content changes

When adding or changing a product fact:

1. Use an official `uipath.com` or `docs.uipath.com` source.
2. Confirm whether the capability is GA or Preview.
3. Update the source check date and the catalog snapshot date.
4. Keep detailed facts in `skills/uipath-demo-practice/references/content.js` rather than duplicating them in the interaction instructions.
5. Run all validation commands and describe the exact sources reviewed in the pull request.

## Pull requests

- Keep changes focused and explain why they improve practice quality.
- Add or update tests for behavior changes.
- Update README, SPEC, or TESTING when public behavior changes.
- Confirm the full suite passes and include the commands you ran.
- Confirm your contribution can be distributed under the MIT License.
