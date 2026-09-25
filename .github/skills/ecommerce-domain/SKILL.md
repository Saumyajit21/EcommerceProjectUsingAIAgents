---
name: ecommerce-domain
description: "Ecommerce domain knowledge for manual scenarios, Playwright automation, scenario reviews, and test strategy. Update this skill as the application is learned."
user-invocable: false
---

# Ecommerce Domain Knowledge

This is the shared, evolving source of truth for the ecommerce testing agents. The application-specific facts are intentionally incomplete until they are confirmed from code, API documentation, approved requirements, or observed behavior.

## How To Maintain This Knowledge

- Record confirmed facts with their source and date.
- Separate confirmed behavior, observed behavior, and open questions.
- Never guess product rules, prices, roles, URLs, selectors, or data requirements.
- Read the application implementation when behavior matters.
- Add focused supporting files as knowledge grows.

## Domain Areas To Discover

Capture the behavior that applies to this application, including:

- Catalog, search, filtering, sorting, and product details
- Product variants, inventory, pricing, promotions, and tax
- Cart creation, updates, persistence, and empty states
- Guest and authenticated checkout
- Addresses, shipping methods, payment, order confirmation, and failures
- Accounts, order history, returns, cancellations, and notifications
- Administrative or customer-support workflows
- Permissions, fraud controls, rate limits, and data privacy

## Application Facts

### Confirmed Facts

- The explored application is the Rahul Shetty Academy practice ecommerce site.
- Login URL: `https://rahulshettyacademy.com/client/#/auth/login`.
- Page title: `Let's Shop`.
- A valid supplied test account authenticated successfully and redirected to `#/dashboard/dash`.
- Empty login submission displays `Email is required` and `Password is required`.
- The login page provides registration and password recovery links.

### Observed Behavior

Observed during browser exploration on 2026-09-25:

- The login email field is an email input with `id="userEmail"` and placeholder `email@example.com`.
- The login password field is a password input with `id="userPassword"` and placeholder `enter your passsword`.
- The login submit control is an input with `id="login"`, `name="login"`, and `type="submit"`.
- The registration link targets `#/auth/register`.
- The password recovery link targets `#/auth/password-new`.
- After successful login, the authenticated navigation includes Home, Orders, Cart, and Sign Out.
- The dashboard route is `#/dashboard/dash`.
- The dashboard initially shows `ADIDAS ORIGINAL`, `ZARA COAT 3`, and `iphone 13 pro`.
- Product detail routes follow `#/dashboard/product-details/<product-id>`.
- The cart route is `#/dashboard/cart`; the observed cart contained Adidas and Zara after adding them.
- The checkout route follows `#/dashboard/order?prop=<product-ids>`.
- Cart checkout displays product headings, quantity, subtotal, total, and a `Checkout` button.
- The checkout page supports Credit Card, Paypal, SEPA, and Invoice payment methods.
- Credit Card checkout uses card number, month, day, CVV, name on card, shipping address, and country.
- The observed two-product subtotal and total were `$23000`.
- A successful order redirects to `#/dashboard/thanks` and displays `Thankyou for the order.` with the ordered product names.
- The country typeahead responds reliably to character-by-character input such as `ind`; the `India` suggestion must be selected before placing the order.
- In headed Chromium, the desktop `Home | Search` breadcrumb is under `#sidebar`; a second mobile copy is hidden.
- The authenticated purchase flow was verified end to end with Playwright in headed Chromium, including screenshots and reporting for each action and assertion.

### Open Questions

- Which ecommerce workflows beyond login are in scope?
- What are the supported user roles: guest, customer, admin, or support?
- What are the authoritative sources for product, inventory, pricing, and order rules?
- Which environments, payment providers, shipping providers, and test accounts are available?
- Which stable accessibility names or test IDs are approved for automation?
- What exact error message is shown for invalid credentials?
- Are account lockout, rate limiting, or CAPTCHA behaviors enabled?
- Which order-detail controls and order-history assertions are required after confirmation?

## Suggested Supporting Files

Add focused files beside this one as the application becomes better understood:

- `business-rules.md` for validated catalog, cart, checkout, order, and account rules
- `user-flows.md` for actor journeys and state transitions
- `api-reference.md` for endpoints, payloads, status codes, and authentication
- `ui-selectors.md` for approved stable test hooks and accessibility names
- `test-data.md` for safe, repeatable products, users, orders, and reset rules
