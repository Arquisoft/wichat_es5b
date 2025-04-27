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
      : await puppeteer.launch({ 
        // executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium', // Only for Mac users
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

  test('The user is not registered in the site', ({given,when,then}) => {
    
    let username;
    let password;

    given('An unregistered user', async () => {
      username = "userasw";
      password = "ValidPassword123";
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
    });

    when('I fill the data in the form and press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear Usuario' })
    });

    then('A confirmation message should be shown in the screen', async () => {
        await expect(page).toMatchElement("div", { text: "Usuario añadido correctamente" });
    });

  })

  test('The user submits the form without filling username and password', ({given,when,then}) =>  {

    given('An unregistered user', async () => {
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
    });

    when('I leave the username and password fields empty and i press submit', async () => {
      await expect(page).toFill('input[name="username"]', '');
      await expect(page).toFill('input[name="password"]', '');
      await expect(page).toClick('button', { text: 'Crear Usuario' });
    });

    then('A validation message "El campo nombre de usuario es obligatorio y no puede estar vacío" should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: `El campo nombre de usuario es obligatorio y no puede estar vacío` });
    });

  })

  test('The user submits the form with username empty', ({given,when,then}) =>  {

    let password;

    given('An unregistered user', async () => {
      password = "ValidPassword123"
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
    });

    when('I leave the username field empty and I fill the password field and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', '');
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear Usuario' });
    });

    then('A validation message "El campo nombre de usuario es obligatorio y no puede estar vacío" should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: `El campo nombre de usuario es obligatorio y no puede estar vacío` });
    });

  })

  test('The user submits the form with password empty', ({given,when,then}) =>  {

    let username;

    given('An unregistered user', async () => {
      username = "userasw"
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
    });

    when('I leave the password field empty and I fill the username field and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', '');
      await expect(page).toClick('button', { text: 'Crear Usuario' });
    });

    then('A validation message "El campo contraseña es obligatorio y no puede estar vacío" should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: `El campo contraseña es obligatorio y no puede estar vacío` });
    });

  })

  test('The user submits the form with a username already registered', ({ given, when, then }) => {

    let username;
    let password
  
    given('A user with username "repeateduser" is already registered', async () => {
      username = "repeateduser";
      password = "ValidPassword123";
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear Usuario' });
      await expect(page).toMatchElement("div", { text: "Usuario añadido correctamente" });
    });
  
    when('I fill the username field with "repeateduser" and I fill the password field and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear Usuario' });
    });
  
    then('A validation message "El nombre de usuario ya está en uso" should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: "El nombre de usuario ya está en uso" });
    });
  
  });

  test('The user submits the form with a password without an uppercase letter', ({ given, when, then }) => {

    let username;
    let password
  
    given('An unregistered user', async () => {
      username = "userasw";
      password = "password1";
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
    });

    when('I fill the username field with "userasw" and I fill the password field with "password1" and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear Usuario' });
    });

    then('A validation message "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." });
    });

  });

  test('The user submits the form with a password without a number', ({ given, when, then }) => {

    let username;
    let password
  
    given('An unregistered user', async () => {
      username = "userasw";
      password = "Password";
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
    });

    when('I fill the username field with "userasw" and I fill the password field with "Password" and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear Usuario' });
    });

    then('A validation message "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." });
    });

  });

  test('The user submits the form with a password shorter than 6 characters', ({ given, when, then }) => {

    let username;
    let password
  
    given('An unregistered user', async () => {
      username = "userasw";
      password = "Pass1";
      await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
    });

    when('I fill the username field with "userasw" and I fill the password field with "Pass1" and I press submit', async () => {
      await expect(page).toFill('input[name="username"]', username);
      await expect(page).toFill('input[name="password"]', password);
      await expect(page).toClick('button', { text: 'Crear Usuario' });
    });

    then('A validation message "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." should be displayed', async () => {
      await expect(page).toMatchElement("div", { text: "La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres." });
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