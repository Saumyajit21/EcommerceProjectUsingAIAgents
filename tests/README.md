# Login Test Structure

- `pages/login.locators.ts`: all login selectors in one place
- `pages/login.page.ts`: page-object actions and assertions
- `login.spec.ts`: test scenarios and the `LoginTests` scenario class
- `purchase-flow.spec.ts`: authenticated Adidas and Zara purchase scenario
- `pages/shopping.page.ts`, `pages/cart.page.ts`, `pages/checkout.page.ts`: purchase-flow page objects

Login and purchase tests load `test-data/ecommerce-login.json` through `framework/test-data.ts`. Keep that file local and never commit or share its credentials.

`framework/report-cleanup.ts` removes HTML report folders older than two days at the start of each Playwright run while preserving logs, screenshots, and event data.

Run the purchase flow with `npm run test:purchase` or `npx playwright test tests/purchase-flow.spec.ts --headed`.
