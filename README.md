# Ecommerce Testing Agents

This workspace contains focused GitHub Copilot custom agents for building a testing practice around an ecommerce website. The `.agent.md` files are definitions hosted and executed by Copilot; they are not standalone npm processes.

## Agents

- `Test Coordinator`: routes end-to-end testing work to the appropriate specialists and validates requested implementation
- `create-Scenarios`: manual functional scenarios
- `manual-to-playwright`: automation designs derived from approved manual scenarios
- `review-Scenarios`: coverage, correctness, and maintainability review
- `playwright-best-practices`: repository-specific Playwright guidance
- `test-strategy`: risk-based test planning across layers

Select `Test Coordinator` from the Copilot agent picker and describe the feature, workflow, scenario IDs, or testing outcome. It invokes only the specialists needed for the task and asks for confirmation before running purchase tests that create real orders.

## Shared Knowledge

`.github/skills/ecommerce-domain/SKILL.md` is the evolving domain knowledge source. Add supporting files there as rules, flows, APIs, selectors, and test data are confirmed.

Keep domain facts evidence-based. Record unknowns as questions so the agents help discover the application instead of filling gaps with assumptions.

## GitHub Actions

`.github/workflows/playwright.yml` runs the complete Playwright suite whenever code is pushed to `main`. The workflow installs Chromium, creates the ignored login-data file from GitHub environment configuration, runs `npm test`, and uploads the standard Playwright HTML report as an artifact.

Create a GitHub environment named `playwright-e2e` and configure:

- Variable `ECOMMERCE_URL`: the login-page URL
- Secret `ECOMMERCE_USERNAME`: the dedicated test-account username
- Secret `ECOMMERCE_PASSWORD`: the dedicated test-account password

Use a dedicated disposable test account and add environment protection rules where available. The purchase test places a real order on every push to `main`, so the account and target environment must be safe for repeated automated orders.

## Execution Artifacts

The Playwright framework creates a unique folder under `reports/` for every run:

```text
reports/<execution-id>/
├── html/execution-report.html
├── logs/execution.log
├── data/events.jsonl
└── screenshots/<test-id>/
```

Every instrumented page-object step captures a screenshot and writes its result to the execution log. The HTML report links each step to its screenshot and includes duration, URL, status, and failure details when available.

At the start of each test run, the framework deletes only `html/` folders inside execution directories whose modification time is more than two days old. Logs, screenshots, and step data are preserved.

Run the login suite with `npm run test:login`. The authenticated scenarios load the URL, username, and password from the local `test-data/ecommerce-login.json` file through `tests/framework/test-data.ts`.

Run the authenticated purchase flow in headed mode with PowerShell:

```powershell
npm run test:purchase -- --headed
```

The purchase flow logs in, adds `ADIDAS ORIGINAL` and `ZARA COAT 3`, verifies the cart, completes credit-card checkout, places the order, and verifies the order confirmation page. The latest verified run passed end to end. The real credential file is Git-ignored; do not commit or share it.
