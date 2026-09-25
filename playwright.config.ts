import { defineConfig, devices } from '@playwright/test';
import { createExecutionId } from './tests/framework/execution-context';
import { loadEcommerceLoginData } from './tests/framework/test-data';

process.env.PLAYWRIGHT_EXECUTION_ID ??= createExecutionId();
const testData = loadEcommerceLoginData();

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [
    ['list'],
    ['./tests/framework/execution-report-reporter.ts'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    baseURL: new URL(testData.url).origin,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
