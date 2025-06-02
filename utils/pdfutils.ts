// utils/pdfUtils.ts
import { Page } from '@playwright/test';

export async function waitForPdfResponseFromTab(newTab: Page): Promise<string> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('❌ Timed out waiting for PDF response')), 10000);

    newTab.on('response', async (response) => {
      const contentType = response.headers()['content-type'];
      if (contentType?.includes('application/pdf')) {
        clearTimeout(timeout);
        resolve(response.url());
      }
    });
  });
}