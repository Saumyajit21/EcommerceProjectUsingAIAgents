# Ecommerce Purchase Flow Scenario

## TC-PURCHASE-001: Purchase ADIDAS ORIGINAL and ZARA COAT 3

**Priority:** P0

**Preconditions:** A valid ecommerce test account is available, the product catalog contains `ADIDAS ORIGINAL` and `ZARA COAT 3`, and the account can place orders.

**Test data:** Local `test-data/ecommerce-login.json`; practice card data documented below; shipping address `123 Main Street, Bangalore`; country `India`.

### Steps and expected results

1. Enter username and password, select `Login`, and verify the user reaches `#/dashboard/dash` and the home content is visible.
2. View `ADIDAS ORIGINAL`, select `Add to Cart`, return home, and verify the home route is displayed.
3. View `ZARA COAT 3`, select `Add to Cart`, return home, and verify the home route is displayed.
4. Open `Cart`, verify both product names are present, and select `Checkout`.
5. Complete payment using the practice card data, expiry, CVV, card name, shipping address, and selected country. Select `Place Order`.
6. Verify the `#/dashboard/thanks` route, `Thankyou for the order.` message, and both product names in the confirmation.

## Observed Checkout Data

- Credit card number is prefilled by the practice site with `4542 9931 9292 2293`.
- Expiry month and day are separate select controls.
- CVV and name on card are required.
- Shipping address is required.
- Country is a typeahead field with placeholder `Select Country`.
- The checkout page shows the authenticated account email as a label.
- The cart total for the two observed products was `$23000`.
- Successful order confirmation route: `#/dashboard/thanks`.

## Automation

Implemented as `TC-PURCHASE-001` in `tests/purchase-flow.spec.ts` with page objects in `tests/pages/shopping.page.ts`, `tests/pages/cart.page.ts`, and `tests/pages/checkout.page.ts`. Every action and assertion uses the shared reporting step wrapper, so each produces a screenshot and log event.

## Review Notes and Coverage Gaps

- This is a P0 end-to-end smoke scenario, but it creates a real order on every run. Use a dedicated test account and define order cleanup or a reset strategy before parallel or repeated execution.
- Invalid credentials, checkout validation failures, duplicate cart additions, inventory changes, payment-method alternatives, and order-history verification are not covered by this scenario.
- Product names, card values, and shipping data should eventually move to a dedicated non-secret ecommerce test-data section if more purchase scenarios are added.
