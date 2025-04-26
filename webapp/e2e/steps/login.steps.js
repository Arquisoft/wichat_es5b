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
      : await puppeteer.launch({ 
        // executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium', // Only for Mac users
        //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Only for Mac users
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

    // Intentar iniciar sesión con aswuser
    await expect(page).toFill('input[name="username"]', "aswuser");
    await expect(page).toFill('input[name="password"]', "ValidPassword123");
    await expect(page).toClick('button', { text: 'Iniciar Sesión' });

    // Comprobar si el login fue exitoso
    const loggedIn = await page.evaluate(() => {
        return !!document.querySelector("div")?.textContent?.includes("Bienvenido");
    });
    

    if (!loggedIn) {
        // Si el usuario no existe, registrarlo
        await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });

        await expect(page).toFill('input[name="username"]', "aswuser");

        await expect(page).toFill('input[name="password"]', "ValidPassword123");

        await expect(page).toClick('button', { text: 'Crear Usuario' })

        // Confirmar que el registro fue exitoso
        await expect(page).toMatchElement("div", { text: "Usuario añadido correctamente" });
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

    given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
        // Creamos un usuario de prueba 
        username = "aswuser";
        password = "ValidPassword123";
        // Navegamos a la página de inicio de sesión
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "aswuser" and I fill the password field with "ValidPassword123" and I press submit', async () => {
        // Llenamos el campo de nombre de usuario
        await expect(page).toFill('input[name="username"]', username);
        // Llenamos el campo de contraseña
        await expect(page).toFill('input[name="password"]', password);
        // Hacemos clic en el botón de inicio de sesión
        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
    });

    then('I should be redirected to the dashboard and a welcome message "Welcome, aswuser!" should be displayed', async () => {
        // Verificamos que el usuario haya iniciado sesión correctamente
        await expect(page).toMatchElement('button', { text: '¡Acción!' });
        // Cerramos la sesión
        await expect(page).toClick('button', { text: 'Mi perfil' });
        await expect(page).toClick('li', { text: 'Cerrar sesión' });
    });

  })

  test('The user logs in with an incorrect password', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
        // Creamos un usuario de prueba
        username = "aswuser";
        // Creamos una contraseña incorrecta
        password = "invalidpassword";
        // Navegamos a la página de inicio de sesión
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "aswuser" and I fill the password field with "invalidpassword" and I press submit', async () => {
        // Llenamos el campo de nombre de usuario
        await expect(page).toFill('input[name="username"]', username);
        // Llenamos el campo de contraseña
        await expect(page).toFill('input[name="password"]', password);
        // Hacemos clic en el botón de inicio de sesión
        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
    });

    then('A validation message "Invalid credentials" should be displayed', async () => {
        // Verificamos que se muestre un mensaje de error
        await expect(page).toMatchElement('div', { text: `Invalid credentials` });
    });

  })

  test('The user logs in with an incorrect username', ({given,when,then}) => {

    let username;
    let password;

    given('A user with username "aswuser" and password "ValidPassword123" is registered', async () => {
        // Creamos un usuario de prueba que no existe
        username = "nonexistinguser";
        // Creamos una contraseña válida
        password = "ValidPassword123";
        // Navegamos a la página de inicio de sesión
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "nonexistentuser" and I fill the password field with "ValidPassword123" and I press submit', async () => {
        // Llenamos el campo de nombre de usuario que no existe
        await expect(page).toFill('input[name="username"]', username);
        // Llenamos el campo de contraseña
        await expect(page).toFill('input[name="password"]', password);
        // Hacemos clic en el botón de inicio de sesión
        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
    });

    then('A validation message "Invalid credentials" should be displayed', async () => {
        // Verificamos que se muestre un mensaje de error
        await expect(page).toMatchElement('div', { text: `Invalid credentials` });
    });

  })

  test('The user logs in with both incorrect username and password', ({given,when,then}) => {

    let username;
    let password;

    given('A user with username "aswuser" and password "ValidPassword123" is registered', async () => {
        // Creamos un usuario de prueba que no existe
        username = "nonexistinguser";
        // Creamos una contraseña incorrecta
        password = "invalidpassword";
        // Navegamos a la página de inicio de sesión
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "nonexistentuser" and I fill the password field with "wrongpassword" and I press submit', async () => {
        // Llenamos el campo de nombre de usuario que no existe
        await expect(page).toFill('input[name="username"]', username);
        // Llenamos el campo de contraseña incorrecta
        await expect(page).toFill('input[name="password"]', password);
        // Hacemos clic en el botón de inicio de sesión
        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
    });

    then('A validation message "Invalid credentials" should be displayed', async () => {
        // Verificamos que se muestre un mensaje de error
        await expect(page).toMatchElement('div', { text: `Invalid credentials` });
    });

  })
  
  test('The user submits the form without filling the password field', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
        // Creamos un usuario de prueba
        username = "aswuser";
        // Creamos una contraseña vacía
        password = "";
        // Navegamos a la página de inicio de sesión
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I fill the username field with "aswuser" and I leave the password field empty and I press submit', async () => {
        // Llenamos el campo de nombre de usuario
        await expect(page).toFill('input[name="username"]', username);
        // Llenamos el campo de contraseña vacío
        await expect(page).toFill('input[name="password"]', password);
        // Hacemos clic en el botón de inicio de sesión
        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
    });

    then('A validation message "Invalid credentials" should be displayed', async () => {
        // Verificamos que se muestre un mensaje de error
        await expect(page).toMatchElement('div', { text: `Invalid credentials` });
    });

  })  

  test('The user submits the form without filling the username field', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
        // Creamos un usuario de prueba
        username = "";
        // Creamos una contraseña válida
        password = "ValidPassword123";
        // Navegamos a la página de inicio de sesión
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I leave the username field empty and I fill the password field with "ValidPassword123" and I press submit', async () => {
        // Llenamos el campo de nombre de usuario vacío
        await expect(page).toFill('input[name="username"]', username);
        // Llenamos el campo de contraseña
        await expect(page).toFill('input[name="password"]', password);
        // Hacemos clic en el botón de inicio de sesión
        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
    });

    then('A validation message "Invalid credentials" should be displayed', async () => {
        // Verificamos que se muestre un mensaje de error
        await expect(page).toMatchElement('div', { text: `Invalid credentials` });
    });

  })  

  test('The user submits the form without filling username and password', ({given,when,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
        // Creamos un usuario de prueba
        username = "";
        // Creamos una contraseña vacía
        password = "";
        // Navegamos a la página de inicio de sesión
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    when('I leave both the username and password fields empty and I press submit', async () => {
        // Llenamos el campo de nombre de usuario vacío
        await expect(page).toFill('input[name="username"]', username);
        // Llenamos el campo de contraseña vacío
        await expect(page).toFill('input[name="password"]', password);
        // Hacemos clic en el botón de inicio de sesión
        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
    });

    then('A validation message "Invalid credentials" should be displayed', async () => {
        // Verificamos que se muestre un mensaje de error
        await expect(page).toMatchElement('div', { text: `Invalid credentials` });
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