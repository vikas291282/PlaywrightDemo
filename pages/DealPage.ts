import { Page, expect } from '@playwright/test';

export class DealPage {
  readonly page: Page;
  readonly createDealBtn;
  readonly frame;
  readonly dealName;
  readonly enterName;

  constructor(page: Page) {
    this.page = page;
    this.createDealBtn = page.locator('[data-test-id="new-object-button"]');
    this.frame = page.frameLocator('iframe#object-builder-ui'); 
    this.dealName = this.frame.locator('text=Deal name');
    this.enterName = this.frame.locator('#UIFormControl-1');
  }

  async switchFrame() {
    await expect(this.createDealBtn).toBeVisible();
    await this.createDealBtn.click();
    // ✅ Correct usage of expect
    await expect(this.dealName).toBeVisible(); 
    await this.enterName.fill('John Doe');
  }
}
