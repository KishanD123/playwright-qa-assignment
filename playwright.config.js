// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on',
    baseURL: 'https://automationintesting.online'
  },

  projects: [
    // ── API project ──────────────────────────────────────────────
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.BASE_API_URL || 'https://restful-booker.herokuapp.com',
        extraHTTPHeaders: { 'Content-Type': 'application/json' },
      },
    },

    // ── UI project ───────────────────────────────────────────────
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.BASE_URL || 'https://automationintesting.online',
        headless: true,
      },
    },
  ],
});