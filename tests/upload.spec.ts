import { DealPage } from '../pages/DealPage';
import { TotpPage } from '../pages/TotpPage';
import { ImportPage } from '../pages/ImportPage';
import { generateTOTP } from '../utils/totpHelper';
import { test, expect } from './fixtures';
import dotenv from 'dotenv';
import path from 'path';
import { webkit, chromium, firefox } from 'playwright'
import { request, Locator, } from '@playwright/test';
import * as fs from 'fs';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const secretKey = process.env.NEW_SECRET as string;

test('Verify uploading', async ({ page, loginPage}) => {
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

test('Verify downloading', async ({ page, loginPage}) => {
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

test.only('Verify PDF', async ({ page, loginPage}) => {
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

    await importPage.verifyPDFFile();

    //await loginPage.logout();
});

test('Auto Download', async ({ page}) => {
  const pdfUrl = 'https://informage--geuat--c.sandbox.vf.force.com/apex/CongaPreviewPage?quoteId=a0jWC0000056G5d%7EManualContract';

  await page.goto("https://informage--geuat--c.sandbox.vf.force.com/apex/CongaPreviewPage?quoteId=a0jWC0000056G5d%7EManualContract");
  const username:Locator = await page.locator('#username');
  const password:Locator = await page.locator('#password');
  const loginButton:Locator = await page.locator('#Login');

  await username.fill("rajesh.c.gupta@informa.com.ge.geuat");
  await password.fill("Admin$123456");
  await loginButton.click();

  const currentUrl = page.url();
  console.log('📍 Current URL is:', currentUrl, {timeout:90000});

  await page.waitForLoadState('domcontentloaded', {timeout:30000});

  const context = await request.newContext();
  const response = await context.get(currentUrl, {timeout:1200000});

  await page.waitForLoadState('domcontentloaded', {timeout:30000});

  if (response.ok()) {
    const buffer = await response.body();
    fs.writeFileSync('C:/Users/vikas.sharma/Downloads/dummy3338.pdf', buffer);
    console.log('PDF downloaded successfully');
  } else {
    console.error(`Failed to download: ${response.status()}`);
  }

  await context.dispose();
});
