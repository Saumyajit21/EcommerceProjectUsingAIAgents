import { expect, Page } from '@playwright/test';
import { StepReporter } from '../framework/step-reporter';
import { ShoppingLocators } from './shopping.locators';

export class CheckoutPage {
  constructor(private readonly page: Page, private readonly steps: StepReporter) {}

  async completePaymentDetails(): Promise<void> {
    await this.steps.step('Enter credit card number', () => this.page.locator(ShoppingLocators.cardNumberInput).fill('4542 9931 9292 2293'));
    await this.steps.step('Select card expiry month', () => this.page.locator(ShoppingLocators.expirySelects).nth(0).selectOption('12'));
    await this.steps.step('Select card expiry day', () => this.page.locator(ShoppingLocators.expirySelects).nth(1).selectOption('30'));
    await this.steps.step('Enter CVV code', () => this.page.locator(ShoppingLocators.cvvInput).fill('123'));
    await this.steps.step('Enter name on card', () => this.page.locator(ShoppingLocators.cardNameInput).fill('Saumyajit Das'));
    await this.steps.step('Enter shipping address', () => this.page.locator(ShoppingLocators.shippingAddressInput).fill('123 Main Street, Bangalore'));
    await this.steps.step('Enter shipping country', async () => {
      const country = this.page.locator(ShoppingLocators.countryInput);
      await country.fill('');
      await country.pressSequentially('ind');
      const indiaSuggestion = this.page.getByRole('button', { name: /India$/ });
      await expect(indiaSuggestion).toBeVisible();
      await indiaSuggestion.click();
    });
  }

  async placeOrder(): Promise<void> {
    await this.steps.step('Click Place Order', () => this.page.locator(ShoppingLocators.placeOrderLink).click());
  }

  async expectOrderConfirmation(): Promise<void> {
    await this.steps.step('Verify order confirmation', async () => {
      await expect(this.page).toHaveURL(/#\/dashboard\/thanks/);
      await expect(this.page.getByText(/Thankyou for the order/i)).toBeVisible();
      await expect(this.page.getByText('ADIDAS ORIGINAL', { exact: true })).toBeVisible();
      await expect(this.page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();
    });
  }
}
