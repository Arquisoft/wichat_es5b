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
            //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Only for Mac users
            headless: true, 
            slowMo: 20
          });
        page = await browser.newPage();
        //Way of setting up the timeout
        setDefaultOptions({ timeout: 240000 })
    
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
      //Pulsamos el botón de "HISTORIAL" en la página principal
      await expect(page).toClick('button', { text: 'HISTORIAL' })
    });

    then('I should see a message "Debe iniciar sesión para ver su historial" and remain on the same page', async () => {
      // Comprobamos que el mensaje de error aparece
      await expect(page).toMatchElement("div", { text: "Debe iniciar sesión para ver su historial" });
      //Cerramos el historial
      await expect(page).toClick('button', { text: 'Cerrar' });
    });

  });

  test('Unauthenticated user attempts to access game history from Add User page', ({given,when,then}) => {

    given('An unauthenticated user', async () => {

    });

    when('I go to the register page and I try to access the game history page', async () => {
      //Vamos a la página de registro
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
      // Pulsamos el botón de "HISTORIAL" en la página de registro
      await expect(page).toClick('button', { text: 'HISTORIAL' })
    });

    then('I should see a message "Debe iniciar sesión para ver su historial" and remain on the same page', async () => {
      // Comprobamos que el mensaje de error aparece
      await expect(page).toMatchElement("div", { text: "Debe iniciar sesión para ver su historial" });
      //Cerramos el historial
      await expect(page).toClick('button', { text: 'Cerrar' });
    });

  });

  test('Authenticated user views his empty history', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuserhistory" and password "ValidPassword123"', async () => {
      //Creamos un usuario para la prueba
      username = "aswuserhistory";
      password = "ValidPassword123";
      // Añadimos al usuario
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear Usuario' })

    });

    when('I log in and I go to the history window', async () => {
      await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
      // Iniciar sesión
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Iniciar Sesión' });

      await expect(page).toClick('button', { text: 'HISTORIAL' })
    });

    then('I should see a table with the headings "Fecha", "Preguntas correctas", and "Preguntas incorrectas"', async () => {
      await expect(page).toMatchElement("h2", { text: "HISTORIAL" });
      await expect(page).toMatchElement("th", { text: "Fecha" });
      await expect(page).toMatchElement("th", { text: "Preguntas correctas" });
      await expect(page).toMatchElement("th", { text: "Preguntas incorrectas" });
      //Cerramos el historial
      await expect(page).toClick('button', { text: 'Cerrar' });
      // Cerramos la sesión
      await expect(page).toClick('button', { text: 'Mi perfil' });
      await expect(page).toClick('li', { text: 'Cerrar sesión' });
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