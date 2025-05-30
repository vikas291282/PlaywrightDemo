import { DealPage } from '../pages/DealPage';
import { TotpPage } from '../pages/TotpPage';
import { ContactPage } from '../pages/ContactPage';
import { generateTOTP } from '../utils/totpHelper';
import { test, expect } from './fixtures';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const secretKey = process.env.SECRET as string;

test.only('Enter the data with handle switch frame', async ({ page, loginPage}) => {
    const dealPage = new DealPage(page);

    await loginPage.goto();
    await loginPage.login();

    const totpPage = new TotpPage(page);
  
    const totpSecret = secretKey;
    const totpCode = generateTOTP(totpSecret);
      
    await totpPage.enterTotp(totpCode);
  
    await loginPage.HubspotAccounts();

    await loginPage.gotoDataMIGDashboard();
  
    await page.waitForLoadState('domcontentloaded');
    
    await dealPage.switchFrame();

    await page.reload();

    await loginPage.logout();
});

test('Verify the data with handle switch window', async ({ page, loginPage}) => {
    const dealPage = new DealPage(page);
    const contactPage = new ContactPage(page);

    await loginPage.goto();
    await loginPage.login();

    const totpPage = new TotpPage(page);
  
    const totpSecret = secretKey;
    const totpCode = generateTOTP(totpSecret);
      
    await totpPage.enterTotp(totpCode);
  
    await loginPage.HubspotAccounts();

    await loginPage.gotoDataMIGDashboard();
  
    await page.waitForLoadState('domcontentloaded');

    await expect(dealPage.createDealBtn).toBeVisible();
    await contactPage.goto();

    await page.waitForLoadState('domcontentloaded');
    await contactPage.swtichWindow();

    await loginPage.logout();
});
