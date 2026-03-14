export class AdminRoomsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Room creation form
    this.roomNameInput   = page.locator('#roomName');
    this.typeSelect      = page.locator('#type');
    this.accessibleCheck = page.locator('#accessible');
    this.priceInput      = page.locator('#roomPrice');
    this.createBtn       = page.getByRole('button', { name: /create/i });

    // Room list
    this.roomRows        = page.locator('.room-details');

    // Navigation
    this.logoutBtn       = page.getByRole('button', { name: /logout/i });
    this.reportLink      = page.getByRole('link', { name: /report/i });
  }

  async waitForDashboard() {
    await this.page.waitForURL(/.*\/admin\/rooms/, { timeout: 10_000 });
    await this.roomNameInput.waitFor({ state: 'visible' });
  }

  async createRoom({ name = '101', type = 'Single', accessible = 'false', price = '100' } = {}) {
    
    await this.roomNameInput.fill(name);
    await this.typeSelect.selectOption(type);
    if (accessible === 'true') {
      const checked = await this.accessibleCheck.selectOption(accessible);
      // if (!checked) await this.accessibleCheck.click();
    }
    await this.priceInput.fill(price);
    this.createBtn.click();
    // await Promise.all([
    // this.page.waitForResponse(res =>
    //     res.url().includes('/room') && res.status() === 201
    // ),
    // this.createBtn.click()
    // ]);
    const roomLocator = this.page.locator(`//p[text()="roomName${name}"]`);

    // await expect(roomLocator).toHaveText(name);

  }

  async getRoomNames() {
    return this.page.locator('[data-testid="roomlisting"]').allTextContents();
  }

  async deleteRoomByName(name) {
    const row = this.page.locator('[data-testid="roomlisting"]').filter({ hasText: name });
    await row.locator('.roomDelete').click();
  }

  async editFirstRoom({ newPrice }) {
    await this.page.locator('[data-testid="roomlisting"]').first().click();
    await this.page.getByRole('button',{ name: 'Edit' }).click();
    const priceField = this.page.locator('input[id="roomPrice"]');
    await priceField.clear();
    await priceField.fill(String(newPrice));
    // await this.page.pause();
    await this.page.getByRole('button', { name:"Update"}).click();
    
    await this.page.locator('a',{ hasText: 'Rooms' }).click();
  }

  async logout() {
    await this.logoutBtn.click();
    await this.page.waitForLoadState('networkidle',{ timeout: 5_000 });
  }

  async goToReport() {
    await this.reportLink.click();
  }
}