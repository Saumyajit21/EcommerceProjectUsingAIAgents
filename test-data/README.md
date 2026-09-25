# Test Data

`ecommerce-login.json` contains local credentials and the login URL used by the Playwright tests. It is ignored by Git and must never be committed or shared.

The tests load it through `tests/framework/test-data.ts`. To use another local data file, set `TEST_DATA_FILE` to its path before running Playwright.

Use `ecommerce-login.example.json` as the safe template when setting up another machine or CI secret provider.
