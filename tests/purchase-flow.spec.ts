import { test } from './framework/reporting.fixture';
import { loadEcommerceLoginData } from './framework/test-data';
import { CartPage } from './pages/cart.page';
import { CheckoutPage } from './pages/checkout.page';
import { LoginPage } from './pages/login.page';
import { ShoppingPage } from './pages/shopping.page';

const testData = loadEcommerceLoginData();

class PurchaseFlowTests {
  constructor(
    private readonly loginPage: LoginPage,
    private readonly shoppingPage: ShoppingPage,
    private readonly cartPage: CartPage,
    private readonly checkoutPage: CheckoutPage,
  ) {}

  async purchaseTwoProducts(): Promise<void> {
    const adidas = 'ADIDAS ORIGINAL';
    const zara = 'ZARA COAT 3';

    await this.loginPage.open();
    await this.loginPage.login(testData.username, testData.password);
    await this.loginPage.expectDashboard();
    await this.shoppingPage.expectHomePage();

    await this.shoppingPage.viewProduct(adidas);
    await this.shoppingPage.addCurrentProductToCart(adidas);
    await this.shoppingPage.returnHome();

    await this.shoppingPage.viewProduct(zara);
    await this.shoppingPage.addCurrentProductToCart(zara);
    await this.shoppingPage.returnHome();

    await this.shoppingPage.openCart();
    await this.cartPage.expectProducts([adidas, zara]);
    await this.cartPage.checkout();

    await this.checkoutPage.completePaymentDetails();
    await this.checkoutPage.placeOrder();
    await this.checkoutPage.expectOrderConfirmation();
  }
}
//comment
test.describe('Ecommerce purchase flow', () => {
  test('purchases Adidas shoes and Zara Coat 3', async ({ page, stepReporter }) => {
    const loginPage = new LoginPage(page, stepReporter, testData.url);
    const shoppingPage = new ShoppingPage(page, stepReporter);
    const cartPage = new CartPage(page, stepReporter);
    const checkoutPage = new CheckoutPage(page, stepReporter);

    await new PurchaseFlowTests(loginPage, shoppingPage, cartPage, checkoutPage).purchaseTwoProducts();
  });
});
