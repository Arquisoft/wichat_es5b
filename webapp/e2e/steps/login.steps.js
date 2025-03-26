const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/login.feature');

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

    // Intentar iniciar sesión con existinguser
    await expect(page).toFill('input[name="username"]', "existinguser");
    await expect(page).toFill('input[name="password"]', "validpassword");
    await expect(page).toClick('button', { text: 'Login' });

    // Comprobar si el login fue exitoso
    const loggedIn = await page.evaluate(() => {
        return !!document.querySelector("div")?.textContent?.includes("Welcome, existinguser!");
    });
    

    if (!loggedIn) {
        // Si el usuario no existe, registrarlo
        await expect(page).toClick("button", { text: "Don't have an account? Register here." });
        await expect(page).toFill('input[name="username"]', "existinguser");
        await expect(page).toFill('input[name="password"]', "validpassword");
        await expect(page).toClick('button', { text: 'Add User' })

        // Confirmar que el registro fue exitoso
        await expect(page).toMatchElement("div", { text: "User added successfully" });
    }
  });

  beforeEach(async () => {
    await page.waitForTimeout(1500);
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    // await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  });

  test('The user logs in successfully with valid credentials', ({given,when,then}) => {
    
    let username;
    let password;

    given('A registered user with username "existinguser" and password "validpassword"', async () => {
        username = "existinguser";
        password = "validpassword";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "existinguser" and I fill the password field with "validpassword" and I press submit', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Login' });
    });

    then('I should be redirected to the dashboard and a welcome message "Welcome, existinguser!" should be displayed', async () => {
        await expect(page).toMatchElement('button', { text: 'Start Game' });
    });

  })

  test('The user logs in with an incorrect password', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "existinguser" and password "validpassword"', async () => {
        username = "existinguser";
        password = "invalidpassword";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "existinguser" and I fill the password field with "invalidpassword" and I press submit', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Login' });
    });

    then('A validation message "Error: Invalid credentials" should be displayed', async () => {
        await expect(page).toMatchElement('div', { text: "Error: Invalid credentials" });
    });

  })

  test('The user logs in with an incorrect username', ({given,when,then}) => {

    let username;
    let password;

    given('A user with username "existinguser" and password "validpassword" is registered', async () => {
        username = "nonexistinguser";
        password = "validpassword";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "nonexistentuser" and I fill the password field with "validpassword" and I press submit', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Login' });
    });

    then('A validation message "Error: Invalid credentials" should be displayed', async () => {
        await expect(page).toMatchElement('div', { text: "Error: Invalid credentials" });
    });

  })

  test('The user logs in with both incorrect username and password', ({given,when,then}) => {

    let username;
    let password;

    given('A user with username "existinguser" and password "validpassword" is registered', async () => {
        username = "nonexistinguser";
        password = "invalidpassword";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "nonexistentuser" and I fill the password field with "wrongpassword" and I press submit', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Login' });
    });

    then('A validation message "Error: Invalid credentials" should be displayed', async () => {
        await expect(page).toMatchElement('div', { text: "Error: Invalid credentials" });
    });

  })
  
  test('The user submits the form without filling the password field', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "existinguser" and password "validpassword"', async () => {
        username = "existinguser";
        password = "";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "existinguser" and I leave the password field empty and I press submit', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Login' });
    });

    then('A validation message "Error: Username and password are required" should be displayed', async () => {
        await expect(page).toMatchElement('div', { text: "Error: Username and password are required" });
    });

  })  

  test('The user submits the form without filling the username field', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "existinguser" and password "validpassword"', async () => {
        username = "";
        password = "validpassword";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I leave the username field empty and I fill the password field with "validpassword" and I press submit', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Login' });
    });

    then('A validation message "Error: Username and password are required" should be displayed', async () => {
        await expect(page).toMatchElement('div', { text: "Error: Username and password are required" });
    });

  })  

  test('The user submits the form without filling username and password', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "existinguser" and password "validpassword"', async () => {
        username = "";
        password = "";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I leave both the username and password fields empty and I press submit', async () => {
        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);
        await expect(page).toClick('button', { text: 'Login' });
    });

    then('A validation message "Error: Username and password are required" should be displayed', async () => {
        await expect(page).toMatchElement('div', { text: "Error: Username and password are required" });
    });

  }) 

  afterAll(async ()=>{
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  })
});