import { test } from './framework/reporting.fixture';
import { loadEcommerceLoginData } from './framework/test-data';
import { LoginPage } from './pages/login.page';

const testData = loadEcommerceLoginData();

class LoginTests {
  constructor(private readonly loginPage: LoginPage) {}

  async validLogin(email: string, password: string): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.login(email, password);
    await this.loginPage.expectDashboard();
  }

  async emptyCredentials(): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.submitEmptyForm();
    await this.loginPage.expectLoginValidationMessages();
  }
}

test.describe('Ecommerce login', () => {
  test('logs in with valid credentials', async ({ page, stepReporter }) => {
    await new LoginTests(new LoginPage(page, stepReporter, testData.url)).validLogin(testData.username, testData.password);
  });

  test('shows required validation for empty credentials', async ({ page, stepReporter }) => {
    await new LoginTests(new LoginPage(page, stepReporter, testData.url)).emptyCredentials();
  });
});
