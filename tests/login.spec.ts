import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { TotpPage } from '../pages/TotpPage';
import { generateTOTP } from '../utils/totpHelper';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const secretKey = process.env.SECRET as string;

test('user can login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login();

  const totpPage = new TotpPage(page);

  const totpSecret = secretKey;
  const totpCode = generateTOTP(totpSecret);
    
  await totpPage.enterTotp(totpCode);

  await loginPage.HubspotAccounts();

  await expect(page.getByRole('heading', { name: 'HubSpot Accounts' })).toBeVisible(); 

  await loginPage.logout();
});
