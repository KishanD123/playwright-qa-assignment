import { test, expect } from '@playwright/test';

const MAX_RESPONSE_MS = 3000;

test.describe('Auth API — POST /auth/login', () => {
  test('valid credentials → 200 with non-empty token', async ({ request }) => {
    const start = Date.now();
    const url = process.env.BASE_API_URL;
    const res = await request.post(`${url}/auth`, {
      data: {
        username: process.env.ADMIN_USER || 'admin',
        password: 'password123',
      },
    });
    const elapsed = Date.now() - start;

    expect(res.status()).toBe(200);
    expect(elapsed).toBeLessThan(MAX_RESPONSE_MS);

    const body = await res.json();
    expect(body).toHaveProperty('token');
    const token = body.token;
    console.log(token);
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('invalid password → 200 with "Bad credentials" body', async ({ request }) => {
    const start = Date.now();
    const url = process.env.BASE_API_URL;
    const res = await request.post(`${url}/auth`, {
      headers: {
      'Content-Type': 'application/json', 
    },
      data: { username: 'admin', password: 'wrongpassword' },
    });
    const elapsed = Date.now() - start;

    expect(res.status()).toBe(200);
    expect(elapsed).toBeLessThan(MAX_RESPONSE_MS);

    const body = await res.json();
    expect(body).toHaveProperty('reason');
    expect(body.reason).toMatch(/bad credentials/i);
  });

  test('invalid username → 200 with "Bad credentials" body', async ({ request }) => {
        const url = process.env.BASE_API_URL;

    const res = await request.post(`${url}/auth`, {
      data: { username: 'unknownuser', password: 'password' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.reason).toMatch(/bad credentials/i);
  });

  test('empty credentials body → error response', async ({ request }) => {
        const url = process.env.BASE_API_URL;

    const res = await request.post(`${url}/auth`, { data: {} });
    // Platform may return 200 with Bad credentials or 400; either is acceptable
    const body = await res.json();
    const isError =
      res.status() === 400 ||
      (res.status() === 200 && body.reason !== undefined);
    expect(isError).toBeTruthy();
  });
});