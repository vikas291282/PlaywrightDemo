import { Page, expect, request } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import { getTimestamp } from '../utils/dateUtils';



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
  readonly attachedFile;  

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
    this.attachedFile = page.locator('[data-test-id="attachments-card-file-attachment-link"]');     
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

    await this.searchTextBar.fill('Tenant Logistics');

    await this.page.waitForTimeout(2000);
    
    // ✅ Click on Contact Name
    await this.firstContactName.click();   
    
    // ✅ Correct usage of expect
    await expect(this.page.getByText('Quick actions')).toBeVisible();
    
    const target = this.page.locator('text=Attachments'); 

    // Scroll into view
    await target.scrollIntoViewIfNeeded();

    // Now interact with it       
    const [newTab] = await Promise.all([
    this.page.waitForEvent('popup'), // 👈 listen for new tab (popup)
    this.attachedFile.click(), // 👈 the button that opens a new tab
    ]);

    await newTab.waitForLoadState('domcontentloaded', {timeout:30000});
    
    await expect(newTab).toHaveTitle('File preview | sample.pdf');  

    const pdfDownloadButton = newTab.locator('[data-test-id="file-preview-download-button"]');

    await pdfDownloadButton.click();

    await newTab.waitForLoadState('domcontentloaded'); 

    // Get cookies
    const cookies = await newTab.context().cookies();
    console.log('Cookies:', cookies);

    // Get headers for the file request
    const fileRequest = await newTab.waitForRequest(req => req.url().includes('filemanager/api/v3/files'));
    console.log('Request Headers:', await fileRequest.allHeaders());

    //const pdfUrl = 'https://pdfobject.com/pdf/sample.pdf';

    // Step 2: Open PDF URL in a new tab (it requires authentication)
    //const childTab = await browser.newPage({ storageState: await newTab.context().storageState() });
    //await childTab.goto('https://api-na1.hubspot.com/filemanager/api/v3/files/190779975576/proxy?portalId=8603118');

    //await newTab.goto('https://api-na1.hubspot.com/filemanager/api/v3/files/190779975576/proxy?portalId=8603118');

    //await newTab.waitForLoadState('domcontentloaded');

    // const currentUrl = newTab.url();
    // console.log('📍 Current URL is:', currentUrl);

    // const fileName = `dummy_${getTimestamp()}.pdf`;
    // const downloadPath = path.join(__dirname, '..', 'downloads', fileName);

    // fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
    
    // // Step 4: Extract cookies and headers from original context
    // const cookies = await childTab.context().cookies();
    // const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join(';');
    // const userAgent = await childTab.evaluate(() => navigator.userAgent);

    // // Step 5: Create a new authenticated API context
    // const context = await request.newContext({
    //   extraHTTPHeaders: {
    //     cookie: cookieHeader,
    //     'user-agent': userAgent,
    //     accept: 'application/pdf',
    //   },
    // });
    // const response = await context.get(currentUrl);
    
    // if (response.ok()) {
    //   const buffer = await response.body();
    //   fs.writeFileSync(downloadPath, buffer);
    //   console.log(`✅ PDF saved as: ${downloadPath}`);
    // } else {
    //   throw new Error(`❌ Failed to download PDF: ${response.status()}`);
    // }
    
    // await context.dispose();

    //Set the path to your local PDF file (relative or absolute)
    //const filePath = path.join(__dirname, '..', 'files', 'PolicyScehdule - 2025-05-22T170943.777.pdf');

    // Read the file into a buffer
    //const dataBuffer = fs.readFileSync(filePath);

    // Parse the PDF
    //const pdfData = await pdfParse(dataBuffer);

    // Use assertions as needed
    //expect(pdfData.text).toContain('BROKER');
  }
}
