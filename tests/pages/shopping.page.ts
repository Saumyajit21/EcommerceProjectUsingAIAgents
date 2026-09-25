import { expect, Page } from '@playwright/test';
import { StepReporter } from '../framework/step-reporter';
import { ShoppingLocators } from './shopping.locators';

export class ShoppingPage {
  constructor(private readonly page: Page, private readonly steps: StepReporter) {}

  async expectHomePage(): Promise<void> {
    await this.steps.step('Verify ecommerce home page', async () => {
      await expect(this.page).toHaveURL(/#\/dashboard\/dash$/);
      await expect(this.page.locator('#sidebar').getByText('Home | Search')).toBeVisible();
    });
  }

  async viewProduct(productName: string): Promise<void> {
    await this.steps.step(`View product: ${productName}`, async () => {
      const productCard = this.page.locator('div').filter({
        has: this.page.getByRole('heading', { name: productName, exact: true }),
      }).filter({
        has: this.page.getByRole('button', { name: 'View', exact: true }),
      }).last();
      await productCard.getByRole('button', { name: 'View', exact: true }).click();
      await expect(this.page.getByRole('heading', { name: productName, exact: true })).toBeVisible();
    });
  }

  async addCurrentProductToCart(productName: string): Promise<void> {
    await this.steps.step(`Add ${productName} to cart`, async () => {
      await this.page.getByRole('button', { name: 'Add to Cart', exact: true }).click();
      await expect(this.page.getByRole('heading', { name: productName, exact: true })).toBeVisible();
    });
  }

  async returnHome(): Promise<void> {
    await this.steps.step('Return to home page', async () => {
      await this.page.locator(ShoppingLocators.homeButton).first().click();
      await expect(this.page).toHaveURL(/#\/dashboard\/dash$/);
    });
  }

  async openCart(): Promise<void> {
    await this.steps.step('Open cart', async () => {
      await this.page.locator(ShoppingLocators.cartButton).first().click();
      await expect(this.page).toHaveURL(/#\/dashboard\/cart$/);
    });
  }
}
