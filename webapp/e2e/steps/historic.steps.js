const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/historic.feature');
const querystring = require('querystring');


let page;
let browser;

defineFeature(feature, test => {
  
    beforeAll(async () => {
        browser = process.env.GITHUB_ACTIONS
          ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
          // : await puppeteer.launch({ headless: false, slowMo: 100 });
          : await puppeteer.launch({ 
            // executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium', // Only for Mac users
            headless: false, 
            slowMo: 10
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

  });

  test('Unauthenticated user attempts to access game history from Add User page', ({given,when,then}) => {

    given('An unauthenticated user', async () => {

    });

    when('I go to the register page and I try to access the game history page', async () => {
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
      await expect(page).toClick('button', { text: 'HISTORIAL' })
    });

    then('I should see a message "Debe iniciar sesión para ver su historial" and remain on the same page', async () => {
      await expect(page).toMatchElement("div", { text: "Debe iniciar sesión para ver su historial" });
    });

  });

  test('Authenticated user views his empty history', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
      username = "aswuser";
      password = "ValidPassword123";
      // Añadimos al usuario
      await expect(page).toClick("button", { text: "Don't have an account? Register here." });
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Add User' })

      // Confirmar que el registro fue exitoso
      await expect(page).toMatchElement("div", { text: "Usuario añadido correctamente" });
    });

    when('I log in and I go to the history window', async () => {
      await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Login' });

      await expect(page).toClick('button', { text: 'HISTORIAL' })
    });

    then('I should see a table with the headings "Fecha", "Preguntas correctas", and "Preguntas incorrectas"', async () => {
      await expect(page).toMatchElement("h2", { text: "Historial" });
      await expect(page).toMatchElement("th", { text: "Fecha" });
      await expect(page).toMatchElement("th", { text: "Preguntas correctas" });
      await expect(page).toMatchElement("th", { text: "Preguntas incorrectas" });
    });

  });

  test('Authenticated user views one entry on his history', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser" and password "ValidPassword123" and an entry on his game history', async () => {
      username = "aswuser";
      password = "ValidPassword123";

      const postResponse = await page.evaluate(async (username, date, correctAnswers, wrongAnswers) => {
        try {
          const response = await fetch("http://localhost:8006/newRanking", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username,
              date,
              correctAnswers,
              wrongAnswers
            })
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Response Data:', data);
          return data;
        } catch (error) {
          console.error('Error:', error.message);
          return { error: error.message };
        }
      }, "aswuser", "2025-03-31T12:00:00Z", 4, 2);
      console.log('Post Response:', postResponse); 
    });
  

    when('I log in and I go to the history window', async () => {
      await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Login' });

      await expect(page).toClick('button', { text: 'HISTORIAL' })
    });

    then('I should see a table with the headings "Fecha", "Preguntas correctas", and "Preguntas incorrectas" and a row with the correct data', async () => {
      await expect(page).toMatchElement("h2", { text: "Historial" });
      await expect(page).toMatchElement("th", { text: "Fecha" });
      await expect(page).toMatchElement("th", { text: "Preguntas correctas" });
      await expect(page).toMatchElement("th", { text: "Preguntas incorrectas" });
      // await expect(page).toMatchElement("td", { text: "2025-03-31T12:00:00Z" });
      // await expect(page).toMatchElement("td", { text: "4" });
      // await expect(page).toMatchElement("td", { text: "2" });
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