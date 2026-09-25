# Login Functional Scenarios

## Scope

Login page only: `https://rahulshettyacademy.com/client/#/auth/login`.

## Confirmed Exploration

- Page title: `Let's Shop`
- Successful login redirects to `#/dashboard/dash`.
- The supplied test account reached the dashboard successfully.
- Submitting an empty form displays `Email is required` and `Password is required`.
- Login page links to registration and password recovery.

## Scenarios

### TC-LOGIN-001: Login with valid credentials

**Priority:** P0

**Preconditions:** A valid test account is available.

**Steps:**

1. Open the login page.
2. Enter a valid email address.
3. Enter the valid password.
4. Select `Login`.

**Expected results:**

- Authentication succeeds.
- The user is redirected to `#/dashboard/dash`.
- The dashboard is displayed.

**Automation:** `tests/login.spec.ts`, authenticated scenario.

### TC-LOGIN-002: Submit empty login form

**Priority:** P1

**Preconditions:** The login page is open and both fields are empty.

**Steps:**

1. Select `Login` without entering credentials.

**Expected results:**

- `Email is required` is displayed.
- `Password is required` is displayed.
- The user remains on the login page.

**Automation:** `tests/login.spec.ts`, empty credentials scenario.

### TC-LOGIN-003: Open password recovery from login

**Priority:** P2

**Preconditions:** The login page is open.

**Steps:**

1. Select `Forgot password?`.

**Expected results:**

- The password recovery route opens: `#/auth/password-new`.

**Automation candidate:** Add after the recovery page behavior is explored.

### TC-LOGIN-004: Open registration from login

**Priority:** P2

**Preconditions:** The login page is open.

**Steps:**

1. Select `Register`.

**Expected results:**

- The registration route opens: `#/auth/register`.

**Automation candidate:** Add after the registration page behavior is explored.

## Open Questions

- What exact error message is shown for an invalid email/password combination?
- Are account lockout, rate limiting, or CAPTCHA behaviors enabled?
- Should authenticated state persist after refresh or browser restart?
