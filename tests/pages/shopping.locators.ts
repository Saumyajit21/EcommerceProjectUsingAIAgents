export class ShoppingLocators {
  static readonly homeButton = 'button:has-text("HOME")';
  static readonly cartButton = 'button:has-text("Cart")';
  static readonly viewButtons = 'button:has-text("View")';
  static readonly addToCartButton = 'button:has-text("Add to Cart")';
  static readonly checkoutButton = 'button:has-text("Checkout")';
  static readonly productHeading = 'h5';
  static readonly cartProductHeading = 'h3';
  static readonly cardNumberInput = 'div.field:has-text("Credit Card Number") input';
  static readonly expirySelects = 'select.input.ddl';
  static readonly cvvInput = 'div.field:has-text("CVV Code") input';
  static readonly cardNameInput = 'div.field:has-text("Name on Card") input';
  static readonly shippingAddressInput = 'div.user__name > input';
  static readonly countryInput = 'input[placeholder="Select Country"]';
  static readonly countrySuggestions = 'section.ta-results button';
  static readonly placeOrderLink = 'a:has-text("Place Order")';
  static readonly orderConfirmation = 'h1:has-text("Thankyou for the order")';
}
