import { Page } from '@playwright/test';

export class TotpPage {
  readonly page: Page;
  readonly totpInput;
  readonly verifyButton;

  constructor(page: Page) {
    this.page = page;
    this.totpInput = page.locator('id=code'); 
    this.verifyButton = page.locator('xpath=//button[@type="submit"]');
  }

  async enterTotp(code: string) {
    await this.totpInput.fill(code);
    await this.verifyButton.click();
  }
}
