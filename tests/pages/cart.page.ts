import { expect, Page } from '@playwright/test';
import { StepReporter } from '../framework/step-reporter';
import { ShoppingLocators } from './shopping.locators';

export class CartPage {
  constructor(private readonly page: Page, private readonly steps: StepReporter) {}

  async expectProducts(productNames: string[]): Promise<void> {
    await this.steps.step('Verify products in cart', async () => {
      await expect(this.page.getByRole('heading', { name: 'My Cart', exact: true })).toBeVisible();
      for (const productName of productNames) {
        await expect(this.page.getByRole('heading', { name: productName, exact: true })).toBeVisible();
      }
    });
  }

  async checkout(): Promise<void> {
    await this.steps.step('Click Checkout', async () => {
      await this.page.locator(ShoppingLocators.checkoutButton).click();
      await expect(this.page).toHaveURL(/#\/dashboard\/order/);
    });
  }
}
