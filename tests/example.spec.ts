// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('homepage title should contain "Example Domain"', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});
