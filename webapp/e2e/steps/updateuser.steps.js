const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/updateuser.feature');

let page;
let browser;

defineFeature(feature, test => {
  
  beforeAll(async () => {
    browser = process.env.GITHUB_ACTIONS
      ? await puppeteer.launch({headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox']})
      // : await puppeteer.launch({ headless: false, slowMo: 100 });
      : await puppeteer.launch({ 
        //executablePath: '/Applications/Chromium.app/Contents/MacOS/Chromium', // Only for Mac users
        //executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // Only for Mac users
        headless: true, 
        slowMo: 20
      });
    page = await browser.newPage();
    //Way of setting up the timeout
    setDefaultOptions({ timeout: 120000 })

    await page
      .goto("http://localhost:3000", {
        waitUntil: "networkidle0",
      })
      .catch(() => {});

    // Intentar iniciar sesión con existinguser
    /*await expect(page).toFill('input[name="username"]', "aswuser2");
    await expect(page).toFill('input[name="password"]', "ValidPassword123");
    await expect(page).toClick('button', { text: 'Iniciar Sesión' });

    // Comprobar si el login fue exitoso
    const loggedIn = await page.evaluate(() => {

        return !!document.querySelector("h1")?.textContent?.includes("Bienvenido");

    });
    

    if (!loggedIn) {

        // Si el usuario no existe, registrarlo
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

        await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });

        await expect(page).toMatchElement("h1", { text: "Creación de Usuario" });

        await expect(page).toFill('input[name="username"]', "aswuser2");

        await expect(page).toFill('input[name="password"]', "ValidPassword123");

        await expect(page).toClick('button', { text: 'Crear Usuario' })

        // Confirmar que el registro fue exitoso
        //await expect(page).toMatchElement("div", { text: "Usuario añadido correctamente" });

    }*/
        await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
        await expect(page).toFill('input[name="username"]', "aswuser2");
        await expect(page).toFill('input[name="password"]', "ValidPassword123");
        await expect(page).toClick('button', { text: "Crear Usuario" });
  });

  beforeEach(async () => {

    await page.waitForTimeout(1500);
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    // await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  });

  test('Authenticated user updates their data', ({given,when,and,then}) => {
    
    let username;
    let password;

    given('A registered user with username "aswuser2" and password "ValidPassword123"', async () => {

        username = "aswuser2";
        password = "ValidPassword123";

        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    });

    when('I log in and I click on Update username', async () => {

        await expect(page).toMatchElement("h1", { text: "Inicio de Sesión" });

        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);

        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
        await expect(page).toClick('button', { text: 'Mi perfil' });
        await expect(page).toClick('li', { text: 'Editar nombre de usuario' });

    });

    and('I fill in the form with new username "newusername"', async () => {
        await page.waitForTimeout(1000);
        //Esperar a que la página cargue completamente
        await expect(page).toMatchElement("div", { text: "Edite su nombre de usuario" });
        //Rellenar el formulario
        await expect(page).toFill('input[name="username"]', username);

    });

    and('I click on Save Changes', async () => {

        await expect(page).toClick('button', { text: 'Actualizar nombre de usuario' });

    });

    then('I should see a success message', async () => {

        await expect(page).toMatchElement('div', { text: 'Nombre de usuario modificado correctamente' });

        await expect(page).toClick('button', { text: 'Cerrar' });

        await expect(page).toClick('li', { text: 'Cerrar sesión' });

    });

  })

  test('Authenticated user tries to update their data with empty username', ({given,when,and,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser2" and password "ValidPassword123"', async () => {

        username = "aswuser2";
        password = "ValidPassword123";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    });

    when('I log in and I click on Update username', async () => {

        await expect(page).toMatchElement("h1", { text: "Inicio de Sesión" });

        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);

        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
        await expect(page).toClick('button', { text: 'Mi perfil' });
        await expect(page).toClick('li', { text: 'Editar nombre de usuario' });

    });

    and('I fill in the form with empty username', async () => {
        await page.waitForTimeout(1000);
        //Esperar a que la página cargue completamente
        await expect(page).toMatchElement("div", { text: "Edite su nombre de usuario" });
        // Aquí se simula un error al llenar el formulario
        await expect(page).toFill('input[name="username"]', " ");

    });

    and('I click on Save Changes', async () => {

        await expect(page).toClick('button', { text: 'Actualizar nombre de usuario' });

    });
    
    then('I should see an error message', async () => {

        await expect(page).toMatchElement('div', { text: 'El campo newUsername es obligatorio y no puede estar vacío' });

        await expect(page).toClick('button', { text: 'Cerrar' });

        await expect(page).toClick('li', { text: 'Cerrar sesión' });

    });

  })

  test('Authenticated user tries to update their data with existing username', ({given,when,and,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser2" and password "ValidPassword123"', async () => {

        username = "aswuser2";
        password = "ValidPassword123";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    });

    and('Another user with username "existingusername" and password "ValidPassword123"', async () => {

        // Registrar un nuevo usuario
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

        await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });

        await expect(page).toFill('input[name="username"]', "existingusername");

        await expect(page).toFill('input[name="password"]', "ValidPassword123");

        await expect(page).toClick('button', { text: 'Crear Usuario' })

        // Confirmar que el registro fue exitoso
        await expect(page).toMatchElement("div", { text: "Usuario añadido correctamente" });

        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    });

    when('I log in and I click on Update username', async () => {

        await expect(page).toMatchElement("h1", { text: "Inicio de Sesión" });

        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);

        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
        await expect(page).toClick('button', { text: 'Mi perfil' });
        await expect(page).toClick('li', { text: 'Editar nombre de usuario' });

    });

    and('I fill in the form with existingusername', async () => {
        await page.waitForTimeout(1000);
        //Esperar a que la página cargue completamente
        await expect(page).toMatchElement("div", { text: "Edite su nombre de usuario" });
        // Aquí se simula un error al llenar el formulario
        await expect(page).toFill('input[name="username"]', "existingusername");

    });

    and('I click on Save Changes', async () => {

        await expect(page).toClick('button', { text: 'Actualizar nombre de usuario' });

    });
    
    then('I should see an error message', async () => {

        await expect(page).toMatchElement('div', { text: 'El nuevo nombre de usuario ya está en uso' });

        await expect(page).toClick('button', { text: 'Cerrar' });

        await expect(page).toClick('li', { text: 'Cerrar sesión' });

    });

  })

  test('Authenticated user tries to update their password with valid data', ({given,when,and,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser2" and password "ValidPassword123"', async () => {

        username = "aswuser2";
        password = "ValidPassword123";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    });

    when('I log in and I click on Update password', async () => {

        await expect(page).toMatchElement("h1", { text: "Inicio de Sesión" });

        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);

        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
        await expect(page).toClick('button', { text: 'Mi perfil' });
        await expect(page).toClick('li', { text: 'Editar contraseña' });

    });

    and('I fill in the form with new password "NewValidPassword123"', async () => {
        await page.waitForTimeout(1000);

        //Esperar a que la página cargue completamente
        await expect(page).toMatchElement("div", { text: "Edite su contraseña" });
        
        await expect(page).toFill('input[name="password"]', "ValidPassword123");
        await expect(page).toFill('input[name="newpassword"]', "NewValidPassword123");
        await expect(page).toFill('input[name="confirmpassword"]', "NewValidPassword123");

    });

    and('I click on Save Changes', async () => {

        await expect(page).toClick('button', { text: 'Actualizar contraseña' });

    });
    
    then('I should see a success message', async () => {

        await expect(page).toMatchElement('div', { text: 'Contraseña actualizada correctamente' });

        await expect(page).toClick('button', { text: 'Cerrar' });

        await expect(page).toClick('li', { text: 'Cerrar sesión' });

    });

  })

  test('Authenticated user tries to update their password with wrong actual password', ({given,when,and,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser2" and password "ValidPassword123"', async () => {

        username = "aswuser2";
        password = "NewValidPassword123";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    });

    when('I log in and I click on Update password', async () => {

        await expect(page).toMatchElement("h1", { text: "Inicio de Sesión" });

        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);

        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
        await expect(page).toClick('button', { text: 'Mi perfil' });
        await expect(page).toClick('li', { text: 'Editar contraseña' });

    });

    and('I fill in the form with wrong actual password', async () => {
        await page.waitForTimeout(1000);

        //Esperar a que la página cargue completamente
        await expect(page).toMatchElement("div", { text: "Edite su contraseña" });

        await expect(page).toFill('input[name="password"]', "InvalidPassword123");
        await expect(page).toFill('input[name="newpassword"]', "NewValidPassword123");
        await expect(page).toFill('input[name="confirmpassword"]', "NewValidPassword123");

    });

    and('I click on Save Changes', async () => {

        await expect(page).toClick('button', { text: 'Actualizar contraseña' });

    });
    
    then('I should see an error message', async () => {

        await expect(page).toMatchElement('div', { text: 'Contraseña actual incorrecta' });

        await expect(page).toClick('button', { text: 'Cerrar' });

        await expect(page).toClick('li', { text: 'Cerrar sesión' });

    });

  })

  test('Authenticated user tries to update their password with not valid new password', ({given,when,and,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser2" and password "ValidPassword123"', async () => {

        username = "aswuser2";
        password = "NewValidPassword123";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    });

    when('I log in and I click on Update password', async () => {

        await expect(page).toMatchElement("h1", { text: "Inicio de Sesión" });

        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);

        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
        await expect(page).toClick('button', { text: 'Mi perfil' });
        await expect(page).toClick('li', { text: 'Editar contraseña' });

    });

    and('I fill in the form with not valid new password', async () => {
        await page.waitForTimeout(1000);

        //Esperar a que la página cargue completamente
        await expect(page).toMatchElement("div", { text: "Edite su contraseña" });

        await expect(page).toFill('input[name="password"]', "NewValidPassword123");
        await expect(page).toFill('input[name="newpassword"]', "invalidnewpassword");
        await expect(page).toFill('input[name="confirmpassword"]', "invalidnewpassword");

    });

    and('I click on Save Changes', async () => {

        await expect(page).toClick('button', { text: 'Actualizar contraseña' });

    });
    
    then('I should see an error message', async () => {

        await expect(page).toMatchElement('div', { text: 'La contraseña debe tener al menos una letra mayúscula, un número y 6 caracteres.' });

        await expect(page).toClick('button', { text: 'Cerrar' });

        await expect(page).toClick('li', { text: 'Cerrar sesión' });

    });

  })

  test('Authenticated user tries to update their password with different new password and confirmation', ({given,when,and,then}) => {

    let username;
    let password;

    given('A registered user with username "aswuser2" and password "ValidPassword123"', async () => {

        username = "aswuser2";
        password = "NewValidPassword123";
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });

    });

    when('I log in and I click on Update password', async () => {

        await expect(page).toMatchElement("h1", { text: "Inicio de Sesión" });

        await expect(page).toFill('input[name="username"]', username);
        await expect(page).toFill('input[name="password"]', password);

        await expect(page).toClick('button', { text: 'Iniciar Sesión' });
        await expect(page).toClick('button', { text: 'Mi perfil' });
        await expect(page).toClick('li', { text: 'Editar contraseña' });

    });

    and('I fill in the form with different new password and confirmation', async () => {
        await page.waitForTimeout(1000);

        //Esperar a que la página cargue completamente
        await expect(page).toMatchElement("div", { text: "Edite su contraseña" });
        
        await expect(page).toFill('input[name="password"]', "NewValidPassword123");
        await expect(page).toFill('input[name="newpassword"]', "DifferentPassword123");
        await expect(page).toFill('input[name="confirmpassword"]', "AnotherDifferentPassword123");

    });

    and('I click on Save Changes', async () => {

        await expect(page).toClick('button', { text: 'Actualizar contraseña' });

    });
    
    then('I should see an error message', async () => {

        await expect(page).toMatchElement('div', { text: 'Las contraseñas no coinciden' });

        await expect(page).toClick('button', { text: 'Cerrar' });

        await expect(page).toClick('li', { text: 'Cerrar sesión' });

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