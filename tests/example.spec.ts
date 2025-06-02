// tests/example.spec.ts
import { expect } from '@playwright/test';
import { test } from './fixtures';

test('homepage title should contain "Example Domain"', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});
