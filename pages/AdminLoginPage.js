export class AdminLoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginBtn      = page.getByRole('button', { name: /login/i });
    this.errorMsg      = page.locator('.alert, .alert-danger');
  }

  async goto() {
    await this.page.goto('/admin');
    await this.page.waitForLoadState('networkidle');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }

  async loginAsAdmin() {
    await this.login(
      process.env.ADMIN_USER || 'admin',
      process.env.ADMIN_PASS || 'password',
    );
  }

  async waitForErrorMessage() {
    await this.errorMsg.waitFor({ state: 'visible', timeout: 5_000 });
    return this.errorMsg.textContent();
  }
}