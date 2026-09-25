export class LoginLocators {
  static readonly emailInput = '#userEmail';
  static readonly passwordInput = '#userPassword';
  static readonly loginButton = '#login';
  static readonly registerLink = 'a[href="#/auth/register"]';
  static readonly forgotPasswordLink = 'a[href="#/auth/password-new"]';
  static readonly emailRequiredMessage = 'text=*Email is required';
  static readonly passwordRequiredMessage = 'text=*Password is required';
}
