# Page Objects

- `login.page.ts`: authentication actions and assertions
- `shopping.page.ts`: home, product view, add-to-cart, home, and cart navigation
- `cart.page.ts`: cart product assertions and checkout navigation
- `checkout.page.ts`: payment, shipping, order placement, and confirmation
- `*.locators.ts`: selectors kept separate from page methods

All page actions and assertions receive the shared `StepReporter`, which captures a screenshot and writes a log/event entry after each step.
