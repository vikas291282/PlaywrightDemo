// pages/DownloadPage.ts
import { Page, expect } from '@playwright/test';
import path from 'path';

export class DownloadPage {
  readonly page: Page;
  readonly openNotesLink;
  readonly attachedFile;  

  constructor(page: Page) {
    this.page = page;
    this.openNotesLink = page.locator('xpath=//div[@data-test-id="timeline-card"]//div[@role="button"]//*[@data-icon-name="Right"]');
    this.attachedFile = page.locator('xpath=//a[contains(@href, "/file-preview")]');    
  }

  async clickDownloadButtonAndSave(downloadDir: string): Promise<string> {
    this.openNotesLink.click();
    
    // Now interact with it       
    const [newTab] = await Promise.all([
    this.page.waitForEvent('popup'), // 👈 listen for new tab (popup)
    this.attachedFile.click({ timeout: 5000 }), // 👈 the button that opens a new tab
    ]);

    await newTab.waitForLoadState('domcontentloaded',{timeout:10000});
    
    await expect(newTab).toHaveTitle('File preview | 068dL000002msY6QAI-2.pdf');

    const [download] = await Promise.all([
      newTab.waitForEvent('download'),
      newTab.click('[data-test-id="file-preview-download-button"]', {timeout:10000}), // Adjust selector
    ]);

    const filename = download.suggestedFilename();
    const filePath = path.join(downloadDir, filename);
    await download.saveAs(filePath);

    return filePath;        
  }
}
