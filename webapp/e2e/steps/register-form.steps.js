const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/register-form.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
      // : await puppeteer.launch({ headless: false, slowMo: 100 });
      : await puppeteer.launch({ headless: true, slowMo: 1 });
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

  test('The user is not registered in the site', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "pablo"
      password = "pabloasw"
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Add User' })
    });

    then('A confirmation message should be shown in the screen', async () => {
        await expect(page).toMatchElement("div", { text: "User added successfully" });
    });

  })

  test('The user submits the form without filling username and password', ({given,when,then}) =>  {

    given('An unregistered user', async () => {
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
    });

    when('I leave the username and password fields empty and i press submit', async () => {
      await expect(page).toFill('input[name="username"]', '');
      await expect(page).toFill('input[name="password"]', '');
      await expect(page).toClick('button', { text: 'Add User' });
    });

    then('A validation message "Error: Username and password are required" should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Username and password are required" });
    });

  })

  test('The user submits the form with username empty', ({given,when,then}) =>  {

    let password;

    given('An unregistered user', async () => {
      password = "passwordasw"
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
    });

    when('I leave the username field empty and I fill the password field and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', '');
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Add User' });
    });

    then('A validation message "Error: Username and password are required" should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Username and password are required" });
    });

  })

  test('The user submits the form with password empty', ({given,when,then}) =>  {

    let username;

    given('An unregistered user', async () => {
      username = "userasw"
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
    });

    when('I leave the password field empty and I fill the username field and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', '');
      await expect(page).toClick('button', { text: 'Add User' });
    });

    then('A validation message "Error: Username and password are required" should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Username and password are required" });
    });

  })

  test('The user submits the form with a username already registered', ({ given, when, then }) => {

    let username;
    let password
  
    given('A user with username "existinguser" is already registered', async () => {
      username = "existinguser";
      password = "correctpassword";
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Add User' });
      await expect(page).toMatchElement("div", { text: "User created successfully" });
    });
  
    when('I fill the username field with "existinguser" and I fill the password field and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Add User' });
    });
  
    then('A validation message "Username is already taken" should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: "Error: Username is already taken" });
    });
  
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