import { Page, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const contactPageURL = process.env.NEWPAGE_URL as string;

export class ImportPage {
  readonly page: Page;
  readonly importButton;
  readonly importFileBtn;
  readonly startImport;
  readonly contactsCheckBoxFileIcon;
  readonly nextButton;
  readonly fileChooser;
  readonly ariaEnabledBtn;
  readonly areiaDisabledBtn;
  readonly downloadBtn;
  readonly searchTextBar;
  readonly firstContactName;
  readonly quickActions;
  readonly attachementLink; 
  readonly activitiesTab;
  readonly notesSubTab;

  constructor(page: Page) { 
    this.page = page;
    this.importButton = page.locator('[data-test-id="import-button"]');
    this.importFileBtn = page.locator('text=Import a file'); 
    this.startImport = page.locator('text=Start import');
    this.contactsCheckBoxFileIcon = page.locator('xpath=(//*[text()="Contacts"]//..//..//..//..//span//input/..//span)[1]');
    this.nextButton = page.locator('text=Next');
    this.fileChooser = page.locator('input[type="file"]');
    this.downloadBtn = page.locator('text=Download example file');
    this.ariaEnabledBtn = page.locator('//*[text()="press Enter/Return ⏎ to continue"]//..//..//button[@aria-disabled="false"]');
    this.areiaDisabledBtn = page.locator('xpath=//*[text()="press Enter/Return ⏎ to continue"]//..//..//button[@aria-disabled="true"]');
    this.searchTextBar = page.locator('[data-test-id="crm-object-table-search-bar"]');
    this.firstContactName = page.locator('xpath=(//table//tbody//tr[1]//a)[1]');
    this.quickActions = page.locator('text=Quick actions');
    this.attachementLink = page.locator('id=card-wrapper-SINGLETON/0-3/ATTACHMENTS');
    this.activitiesTab = page.locator('xpath=(//div[@data-crm-location="CRM_RECORD_MIDDLE"]//div[@role="navigation"]//a//div[contains(text(), "Activities")])[1]');
    this.notesSubTab = page.locator('xpath=(//a[@data-tab-id="ENGAGEMENTS_NOTES"])[1]');         
  }

  async goto() {
    await this.page.goto(contactPageURL);
  }

  async uploadFile() {
    await this.importButton.click();
    // ✅ Correct usage of expect
    await expect(this.page.getByText('new import update')).toBeVisible();
   
    await this.importFileBtn.click();
    // ✅ Correct usage of expect
    await expect(this.page.getByText('Import to HubSpot')).toBeVisible();

    await this.startImport.click();

    await this.contactsCheckBoxFileIcon.click();
    await this.nextButton.click();

    // Check aria-disabled="true"
    await expect(this.areiaDisabledBtn).toHaveAttribute('aria-disabled', 'true');

    // Optionally, prevent clicks manually if needed
    const isDisabled = await this.areiaDisabledBtn.getAttribute('aria-disabled');
    if (isDisabled === 'true') {
      console.log('Button is considered disabled by aria-disabled');
    }

    // Set the file input directly    
    await this.fileChooser.setInputFiles('C:/Users/vikas.sharma/Downloads/f48bd11c-1d0b-4cd6-8d41-6b6b197544d6.csv');
 
    // Check aria-disabled="false"
    await expect(this.ariaEnabledBtn).toHaveAttribute('aria-disabled', 'false');
   }

  async downloadFile() {
    await this.importButton.click();
    // ✅ Correct usage of expect
    await expect(this.page.getByText('new import update')).toBeVisible();
   
    await this.importFileBtn.click();
    // ✅ Correct usage of expect
    await expect(this.page.getByText('Import to HubSpot')).toBeVisible();

    await this.startImport.click();

    await this.contactsCheckBoxFileIcon.click();
    await this.nextButton.click();

    const [ download ] = await Promise.all([
    this.page.waitForEvent('download'), // Waits for the download to start
    this.downloadBtn.click(),  // Triggers download
    ]);

    const filePath = await download.path();
    console.log('Downloaded file path:', filePath);
    }

    async verifyPDFFile() {
    await this.searchTextBar.click(); 

    await this.searchTextBar.fill('Prateek Mittal');

    await this.page.waitForTimeout(2000);
    
    // ✅ Click on Contact Name
    await this.firstContactName.click();   

    await this.page.waitForLoadState('domcontentloaded');
    
    // ✅ Correct usage of expect
    await expect(this.page.getByText('Quick actions')).toBeVisible();   
    
    await this.activitiesTab.click();

    await this.notesSubTab.click();   
  }
}
