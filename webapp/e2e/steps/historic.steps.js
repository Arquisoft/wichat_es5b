const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/historic.feature');

let page;
let browser;

defineFeature(feature, test => {
  
    beforeAll(async () => {
        browser = process.env.GITHUB_ACTIONS
          ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
          // : await puppeteer.launch({ headless: false, slowMo: 100 });
          : await puppeteer.launch({ 
            executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium', // Only for Mac users
            headless: false, 
            slowMo: 20
          });
        page = await browser.newPage();
        //Way of setting up the timeout
        setDefaultOptions({ timeout: 10000 })
    
        await page
          .goto("http://localhost:3000", {
            waitUntil: "networkidle0",
          })
          .catch(() => {});
    });

  beforeEach(async () => {
    await page.waitForTimeout(1500);
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    // await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  });

  test('Unauthenticated user attempts to access game history', ({given,when,then}) => {

    given('An unauthenticated user', async () => {

    });

    when('I try to access the game history page', async () => {
        await expect(page).toClick('button', { text: 'HISTORIAL' })
    });

    then('I should see a message "Debe iniciar sesión para ver su historial" and remain on the same page', async () => {
        await expect(page).toMatchElement("div", { text: "Debe iniciar sesión para ver su historial" });
    });

    afterAll(async ()=>{
        if (page) {
          await page.close();
        }
        if (browser) {
          await browser.close();
        }
      })
    });

});