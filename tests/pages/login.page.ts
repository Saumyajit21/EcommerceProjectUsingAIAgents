import { expect, Page } from '@playwright/test';
import { LoginLocators } from './login.locators';
import { StepReporter } from '../framework/step-reporter';

export class LoginPage {
  constructor(private readonly page: Page, private readonly steps: StepReporter, private readonly loginUrl: string) {}

  async open(): Promise<void> {
    await this.steps.step('Open login page', () => this.page.goto(this.loginUrl).then(() => undefined));
  }

  async login(email: string, password: string): Promise<void> {
    await this.steps.step('Enter email address', () => this.page.locator(LoginLocators.emailInput).fill(email));
    await this.steps.step('Enter password', () => this.page.locator(LoginLocators.passwordInput).fill(password));
    await this.steps.step('Click Login', () => this.page.locator(LoginLocators.loginButton).click());
  }

  async submitEmptyForm(): Promise<void> {
    await this.steps.step('Submit empty login form', () => this.page.locator(LoginLocators.loginButton).click());
  }

  async expectLoginValidationMessages(): Promise<void> {
    await this.steps.step('Verify email required message', () => expect(this.page.locator(LoginLocators.emailRequiredMessage)).toBeVisible());
    await this.steps.step('Verify password required message', () => expect(this.page.locator(LoginLocators.passwordRequiredMessage)).toBeVisible());
  }

  async expectDashboard(): Promise<void> {
    await this.steps.step('Verify dashboard redirect', () => expect(this.page).toHaveURL(/#\/dashboard\/dash$/));
  }

  async openForgotPassword(): Promise<void> {
    await this.steps.step('Open password recovery', () => this.page.locator(LoginLocators.forgotPasswordLink).click());
  }

  async openRegistration(): Promise<void> {
    await this.steps.step('Open registration', () => this.page.locator(LoginLocators.registerLink).click());
  }
}
