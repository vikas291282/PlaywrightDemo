import { Page, BrowserContext } from '@playwright/test';

export async function getAuthHeaders(context: BrowserContext, page: Page): Promise<{ cookie: string; userAgent: string }> {
  const cookies = await context.cookies();
  const cookie = cookies.map(c => `${c.name}=${c.value}`).join(';');
  const userAgent = await page.evaluate(() => navigator.userAgent);
  return { cookie, userAgent };
}