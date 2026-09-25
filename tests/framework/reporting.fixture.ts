import { test as base } from '@playwright/test';
import { StepReporter } from './step-reporter';

type ReportingFixtures = {
  stepReporter: StepReporter;
};

export const test = base.extend<ReportingFixtures>({
  stepReporter: async ({ page }, use, testInfo) => {
    await use(new StepReporter(page, testInfo));
  },
});

export { expect } from '@playwright/test';
