import { TotpPage } from '../pages/TotpPage';
import { LoginPage } from '../pages/LoginPage';
import { ImportPage } from '../pages/ImportPage';
import { generateTOTP } from '../utils/totpHelper';
import { test } from './fixtures';
import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
import { DownloadPage } from '../pages/DownloadPage';
import { expect } from '@playwright/test';
import pdfParse from 'pdf-parse';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const secretKey = process.env.NEW_SECRET as string;

const downloadDir = path.resolve(__dirname, '../downloads');

// Clean downloads folder before each test
test.beforeEach(() => {
  if (fs.existsSync(downloadDir)) {
    fs.readdirSync(downloadDir).forEach(file => {
      const filePath = path.join(downloadDir, file);
      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  } else {
    fs.mkdirSync(downloadDir, { recursive: true });
  }
});

test('Verify uploading', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const importPage = new ImportPage(page);

    await loginPage.goto();
    await loginPage.login();

    const totpPage = new TotpPage(page);
  
    const totpSecret = secretKey;
    const totpCode = generateTOTP(totpSecret);
      
    await totpPage.enterTotp(totpCode);
  
    await loginPage.gotoHubspotDemoAccountGDashboard();
  
    await page.waitForLoadState('domcontentloaded');
    
    await importPage.goto();

    await importPage.uploadFile();

    //await loginPage.logout();
});

test('Verify downloading', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const importPage = new ImportPage(page);

    await loginPage.goto();
    await loginPage.login();

    const totpPage = new TotpPage(page);
  
    const totpSecret = secretKey;
    const totpCode = generateTOTP(totpSecret);
      
    await totpPage.enterTotp(totpCode);
  
    await loginPage.gotoHubspotDemoAccountGDashboard();
  
    await page.waitForLoadState('domcontentloaded');
    
    await importPage.goto();

    await importPage.downloadFile();

    //await loginPage.logout();
});

test.only('Auto Download and Verify PDF', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const importPage = new ImportPage(page);
    const downloadPage = new DownloadPage(page);   

    await loginPage.goto();
    await loginPage.login();

    const totpPage = new TotpPage(page);
  
    const totpSecret = secretKey;
    const totpCode = generateTOTP(totpSecret);
      
    await totpPage.enterTotp(totpCode);
  
    await loginPage.gotoHubspotDemoAccountGDashboard();
  
    await page.waitForLoadState('domcontentloaded');
    
    await importPage.goto();

    await importPage.verifyPDFFile();   

    const downloadPath = path.join(__dirname, '../downloads');
    const filePath = await downloadPage.clickDownloadButtonAndSave(downloadPath);    

    // Read the file into a buffer
    const pdfBuffer = fs.readFileSync(filePath); // Must be a valid string path

    // Parse the PDF
    const pdfData = await pdfParse(pdfBuffer);

    // Use assertions as needed
    expect(pdfData.text).toContain('Rohit');
});
