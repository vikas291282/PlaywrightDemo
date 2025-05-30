import {test, expect, Browser, Page, Locator, BrowserContext} from '@playwright/test'
import { webkit, chromium, firefox } from 'playwright'
import path from 'path';
const { authenticator } = require('otplib');

test.only('Auto Downloaded', async({})=>{ 
  const browser = await chromium.launch();
  const context = await browser.newContext({
    acceptDownloads: true,
  });
  const page = await context.newPage();

  // Listen for download triggered by navigation
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    // Navigate directly to the PDF URL, which triggers the download
    page.goto('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
  ]);

  // Save the downloaded PDF file locally
  await download.saveAs('downloads/dummy.pdf');
  console.log('PDF downloaded successfully');

  await browser.close();
})

// test('Frame Handling and Switch Tab test', async({})=>{    
//     const browser:Browser = await chromium.launch({headless: false, channel:'chrome'});
//     const page:Page = await browser.newPage();
//     await page.goto("https://app.hubspot.com/login/");

//     const acceptBtn:Locator = await page.locator('#hs-eu-confirmation-button'); 
//     await acceptBtn.click();

//     const classicButton:Locator = await page.locator('text=classic login');
//     await classicButton.click();

//     const username:Locator = await page.locator('#username');
//     const password:Locator = await page.locator('#password');
//     const loginButton:Locator = await page.locator('#loginBtn');

//     await username.fill("vikas.sharma@girikon.com");
//     await password.fill("Girikon!291282");
//     await loginButton.click();

//     const secret = 'CNLYQGDHUCCJVLICPWNGY3K4YVI2HEWV'; // Base32 format
//     const otp = authenticator.generate(secret); // e.g., '123456'

//     const enterOTP:Locator = await page.locator('id=code');
//     const tokenLoginBtn = await page.locator('xpath=//button[@type="submit"]');

//     // OTP Page
//     await enterOTP.fill(otp);
//     await tokenLoginBtn.click();

//     const rememberMeBtn:Locator = await page.locator('xpath=//*[text()="Remember me"]');
//     await rememberMeBtn.click();

//     const dataMigLink:Locator = await page.locator('xpath=//*[text()="data-mig"]');
//     await dataMigLink.click(); 

//     await page.waitForLoadState('domcontentloaded');    
//     //const createDealBtn = await page.locator('xpath=//*[text()="deal"]'); 
//     //await expect(createDealBtn).toBeVisible();
//     //await createDealBtn.click();

//     // Use frameLocator with iframe#id
//     //const frame = page.frameLocator('iframe#object-builder-ui');

//     // Interact with an element inside the iframe
//     //await expect(frame.locator('text=Deal name')).toBeVisible();        
    
//     //await frame.locator('#UIFormControl-1').fill('John Doe');

//     await page.goto("https://app.hubspot.com/contacts/21842038/objects/0-1/views/all/list");

//     await page.waitForLoadState('domcontentloaded');
//     await page.locator('[data-test-id="import-button"]').click();   

//     await expect(page.getByText('new import update')).toBeVisible();

//     const target = page.locator('text=Past imports'); 

//     // Scroll into view
//     await target.scrollIntoViewIfNeeded();

//     // Now interact with it
//     const firstDealName = await page.locator('xpath=//table//tbody//tr[1]//a'); 
//     await firstDealName.click();

//     await expect(page.getByText('Import records and activities')).toBeVisible();
   
//     const [newTab] = await Promise.all([
//     page.waitForEvent('popup'), // 👈 listen for new tab (popup)
//     page.locator('text=Import records and activities').click(), // 👈 the button that opens a new tab
//     ]);   

//     // Step 3: Wait for the new tab to load
//     await newTab.waitForLoadState('domcontentloaded');
//     console.log(await newTab.title()); // Log something to verify

//     // Now interact with new window    
//     await newTab.locator('text=Get a demo').click();

//     // Optionally, switch back to original page
//     await page.bringToFront(); // brings the original page back to focus
//     await expect(page.getByText('Setup your import files')).toBeVisible();

//     // const menuBtn:Locator = await page.locator('id=hs-global-toolbar-accounts');
//     // await menuBtn.click();

//     // const logoutBtn:Locator = await page.locator('id=signout');
//     // await logoutBtn.click();
   
//     // await browser.close();
// })

// test('Handle PDF test', async({})=>{    
//     const browser:Browser = await chromium.launch({headless: false, channel:'chrome'});
//     const page:Page = await browser.newPage();
//     await page.goto("https://app.hubspot.com/login/");

//     const acceptBtn:Locator = await page.locator('#hs-eu-confirmation-button'); 
//     await acceptBtn.click();

//     const classicButton:Locator = await page.locator('text=classic login');
//     await classicButton.click();

//     const username:Locator = await page.locator('#username');
//     const password:Locator = await page.locator('#password');
//     const loginButton:Locator = await page.locator('#loginBtn');

//     await username.fill("vikas.sharma@girikon.com");
//     await password.fill("Girikon!291282");
//     await loginButton.click();

//     const secret = 'CNLYQGDHUCCJVLICPWNGY3K4YVI2HEWV'; // Base32 format
//     const otp = authenticator.generate(secret); // e.g., '123456'

//     const enterOTP:Locator = await page.locator('id=code');
//     const tokenLoginBtn = await page.locator('xpath=//button[@type="submit"]');

//     // OTP Page
//     await enterOTP.fill(otp);
//     await tokenLoginBtn.click();

//     const rememberMeBtn:Locator = await page.locator('xpath=//*[text()="Remember me"]');
//     await rememberMeBtn.click();

//     const TPEALink:Locator = await page.locator('xpath=//*[text()="TPEA Sandbox"]');
//     await TPEALink.click(); 

//     await page.waitForLoadState('domcontentloaded');    

//      // Hover over the element
//     await page.locator('id=crm-toggle').hover();

//     //Assert something happens after hover 
//     await expect(page.locator('id=deals')).toBeVisible();  
//     await page.locator('id=deals').click();  //Click on it 

//     // Now interact with it
//     const firstDealName = await page.locator('xpath=(//table//tbody//tr)[1]//td[2]//a'); 
//     await firstDealName.click();

//     const target = page.locator('id=card-wrapper-SINGLETON/0-3/ATTACHMENTS'); 

//     //Scroll into view
//     await target.scrollIntoViewIfNeeded();

//     const addButton:Locator = await page.locator('xpath=//div[@id="card-wrapper-SINGLETON/0-3/ATTACHMENTS"]//button');
//     await addButton.click();

//     await page.locator('xpath=//div[@id="abstractdropdown-content-10"]//button//*[text()="Your computer"]').click();

//     const filePath = path.resolve('C:/Users/vikas.sharma/Downloads/Pooja Rai_CV.pdf');

//     // Upload directly using the file input
//     await page.setInputFiles('input[type="file"]', filePath);

//     await page.keyboard.press('Enter');

// })