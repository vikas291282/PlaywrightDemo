import { Page, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const baseURL = process.env.BASE_URL as string;
const u2 = process.env.U3 as string;
const password = process.env.NEW_PASSWORD as string;

export class LoginPage {
  readonly page: Page;  
  readonly acceptBtn;
  readonly classicButton;
  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;
  readonly rememberMeBtn;
  readonly TPEALink;
  readonly dataMIGLink;
  readonly menuButton;
  readonly logoutButton;
  readonly hubsportDemoAccountLink;
  
  constructor(page: Page) {
    this.page = page;
    this.acceptBtn = page.locator('#hs-eu-confirmation-button');
    this.classicButton = page.locator('text=classic login');
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#loginBtn');    
    this.rememberMeBtn = page.locator('xpath=//*[text()="Remember me"]');
    this.TPEALink = page.locator('xpath=//*[text()="TPEA Sandbox"]');
    this.dataMIGLink = page.locator('xpath=//*[text()="data-mig"]');
    this.menuButton = page.locator('id=hs-global-toolbar-accounts');
    this.logoutButton = page.locator('id=signout');
    this.hubsportDemoAccountLink = page.locator('xpath=(//*[text()="HubSpot Demo Account"])[1]')
  }

  async goto() {
    await this.page.goto(baseURL);
  }

  async login() {
    await this.acceptBtn.click();
    await this.classicButton.click();
    await this.usernameInput.fill(u2);
    await this.passwordInput.fill(password);
    await this.loginButton.click();   
  }

  async HubspotAccounts() {
    await this.rememberMeBtn.click();    
    await expect(this.dataMIGLink).toBeVisible();
    await expect(this.TPEALink).toBeVisible();        
  }

  async gotoDataMIGDashboard() {    
    await this.dataMIGLink.click();    
  }

  async gotoTPEADashboard() {    
    await this.TPEALink.click();    
  }

  async gotoHubspotDemoAccountGDashboard() {    
    await this.rememberMeBtn.click();
    await this.hubsportDemoAccountLink.click();    
  }

  async logout() {    
    await this.menuButton.click();
    await this.logoutButton.click(); 
  }
}
