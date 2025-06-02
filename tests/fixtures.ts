// tests/fixtures.ts
import { test as base, chromium, BrowserContext, Page } from '@playwright/test';

type MyFixtures = {
  context: BrowserContext;
  page: Page;
};

export const test = base.extend<MyFixtures>({
  context: async ({}, use) => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ acceptDownloads: true });
    await use(context);
    await context.close();
    await browser.close();
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    await use(page);
    await page.close();
  },
});

export const expect = test.expect;
