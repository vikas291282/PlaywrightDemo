// tests/setup.ts or your test runner file
import { chromium, Browser, Page, BrowserContext } from 'playwright';

let browser: Browser;
let context: BrowserContext;
let page: Page;

export async function launchBrowser(): Promise<Page> {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext({ acceptDownloads: true });
  page = await context.newPage();
  return page;
}

export async function closeBrowser() {
  await browser.close();
}
