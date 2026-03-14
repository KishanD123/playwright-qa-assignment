import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../../pages/AdminLoginPage.js';
import { AdminRoomsPage } from '../../pages/AdminRoomsPage.js';

test.describe('Admin Panel', () => {
  let loginPage, roomsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdminLoginPage(page);
    roomsPage = new AdminRoomsPage(page);
    await loginPage.goto();
  });

  // ── Authentication ────────────────────────────────────────────────────────
  test('login with valid credentials → redirect to admin dashboard', async () => {
    await test.step('perform valid login', async () => {
      await loginPage.loginAsAdmin();
    });
    await test.step('verify dashboard is visible', async () => {
      await roomsPage.waitForDashboard();
      await expect(roomsPage.roomNameInput).toBeVisible();
    });
  });

  test('login with invalid credentials → error message shown, no redirect', async () => {
    await test.step('attempt login with wrong password', async () => {
      await loginPage.login('admin', 'wrongpassword');
    });
    await test.step('verify error shown and still on login page', async () => {
      const errText = await loginPage.waitForErrorMessage();
      expect(errText).toBeTruthy();
      await expect(loginPage.usernameInput).toBeVisible();
    });
  });

  test('login with empty fields → validation triggered before submission', async () => {
    await test.step('click login without filling fields', async () => {
      await loginPage.loginBtn.click();
    });
    await test.step('verify validation error or no redirect', async () => {
      // Either HTML5 validation fires OR server returns error
      const stillOnLogin = await loginPage.usernameInput.isVisible();
      expect(stillOnLogin).toBeTruthy();
    });
  });

  // ── Room Management ────────────────────────────────────────────────────
  test('create new room → room appears in room list', async ({ page }) => {
    await loginPage.loginAsAdmin();
    await roomsPage.waitForDashboard();

    const roomName = `Auto${Date.now()}`;

    await test.step('fill and submit room creation form', async () => {
      await roomsPage.createRoom({ name: roomName, type: 'Double', accessible: 'true', price: '200' });
    });

    await test.step('verify room appears in list', async () => {
      await expect(page.locator('[data-testid="roomlisting"]', { hasText: roomName })).toBeVisible();
    });

    await test.step('cleanup — delete created room', async () => {
      await roomsPage.deleteRoomByName(roomName);
    });
  });

  test('edit existing room price → changes reflected in list', async ({ page }) => {
    await loginPage.loginAsAdmin();
    await roomsPage.waitForDashboard();

    await test.step('edit first room price', async () => {
      await roomsPage.editFirstRoom({ newPrice: 333 });
    });

    await test.step('verify updated price visible', async () => {
    await expect(page.locator('[data-testid="roomlisting"]', { hasText: '333' })).toBeVisible();
    });
  });

  test('delete room → room removed from list', async ({ page }) => {
    await loginPage.loginAsAdmin();
    await roomsPage.waitForDashboard();

    // Create a room to delete
    const roomName = `DelTest${Date.now()}`;
    await roomsPage.createRoom({ name: roomName, type: 'Single', price: '50' });
    await expect(page.locator('[data-testid="roomlisting"]', { hasText: roomName })).toBeVisible();

    await test.step('delete the room', async () => {
      await roomsPage.deleteRoomByName(roomName);
    });

    await test.step('verify room no longer in list', async () => {
      await expect(page.locator('[data-testid="roomlisting"]', { hasText: roomName })).toHaveCount(0);
    });
  });

  test('navigate to booking report → calendar / summary loads', async ({ page }) => {
    await loginPage.loginAsAdmin();
    await roomsPage.waitForDashboard();

    await test.step('click report link', async () => {
      await roomsPage.goToReport();
    });

    await test.step('verify report view is visible', async () => {
      await expect(page.locator('.rbc-calendar, [class*="report"]').first()).toBeVisible({ timeout: 10_000 });
    });
  });

  test('logout → navigating to /admin redirects back to login', async ({ page }) => {
    await loginPage.loginAsAdmin();
    await roomsPage.waitForDashboard();

    await test.step('click logout', async () => {
      await roomsPage.logout();
    });

    await test.step('navigate to /admin and verify login page', async () => {
      await page.goto('/admin');
      await expect(loginPage.usernameInput).toBeVisible();
    });
  });
});