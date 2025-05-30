import { Page, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const contactPageURL = process.env.CONTACTPAGE_URL as string;

export class ContactPage {
  readonly page: Page;
  readonly importButton;
  readonly scrollToElement;
  readonly firstDealName;
  readonly newTabButton;

  constructor(page: Page) { 
    this.page = page;
    this.importButton = page.locator('[data-test-id="import-button"]');
    this.scrollToElement = page.locator('text=Past imports'); 
    this.firstDealName = page.locator('xpath=//table//tbody//tr[1]//a');
    this.newTabButton = page.locator('text=Import records and activities');
  }

  async goto() {
    await this.page.goto(contactPageURL);
  }

  async swtichWindow() {
    await this.importButton.click();
    // ✅ Correct usage of expect
    await expect(this.page.getByText('new import update')).toBeVisible();

    // Scroll into view
    await this.scrollToElement.scrollIntoViewIfNeeded();
    await this.firstDealName.click();
    // ✅ Correct usage of expect
    await expect(this.page.getByText('Import records and activities')).toBeVisible();

    const [newTab] = await Promise.all([
    this.page.waitForEvent('popup'), // 👈 listen for new tab (popup)
    this.newTabButton.click(), // 👈 the button that opens a new tab
    ]);

    await newTab.waitForLoadState('domcontentloaded');
    console.log(await newTab.title()); // Log something to verify

    // Optionally, switch back to original page
    await this.page.bringToFront(); // brings the original page back to focus
    await expect(this.page.getByText('Setup your import files')).toBeVisible();
  }
}
