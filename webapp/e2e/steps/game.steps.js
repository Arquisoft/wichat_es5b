const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/game.feature');
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
        setDefaultOptions({ timeout: 120000 })
    
        await page
          .goto("http://localhost:3000", {
            waitUntil: "networkidle0",
          })
          .catch(() => {});

        // Registro del usuario
        await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
        await expect(page).toFill('input[name="username"]', "aswusergametesting");
        await expect(page).toFill('input[name="password"]', "ValidPassword123");
        await expect(page).toClick('button', { text: "Crear Usuario" });

    });

    beforeEach(async () => {
        await page.waitForTimeout(1500);
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    test('Authenticated user starts a game', ({given,when,then}) => {

        let username;
        let password;

        given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
            username = "aswusergametesting";
            password = "ValidPassword123";
        });

        when('I log in and I click on Start Game', async () => {
            //Iniciar sesión
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Iniciar Sesión' });

            await page.waitForTimeout(1000);
            //Empezar el juego
            await expect(page).toClick('button', { text: '¡Acción!' });

            //await expect(page).toMatchElement("h2", { text: "Preparando las palomitas..." });
        });

        then('I should see the first question of the game', async () => {
            await expect(page).toMatchElement("img"); 
            await expect(page).toMatchElement("p", { text: "Pregunta 1 de 6" });
            // Cerramos la sesión
            await expect(page).toClick('button', { text: 'Mi perfil' });
            await expect(page).toClick('li', { text: 'Cerrar sesión' });
        });

    });

    test('Authenticated user starts and finish a game', ({given,when,then}) => {

        let username;
        let password;

        given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
            username = "aswusergametesting";
            password = "ValidPassword123";
        });

        when('I log in and I click on Start Game and I answer all questions', async () => {
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Iniciar Sesión' });

            await page.waitForTimeout(1000);
            await expect(page).toClick('button', { text: '¡Acción!' });

            //await expect(page).toMatchElement("h2", { text: "Preparando las palomitas..." });

            await expect(page).toMatchElement("img"); 

            // Primera pregunta
            await expect(page).toMatchElement("p", { text: "Pregunta 1 de 6" });
            await expect(page).toClick('#option-0');
            // Segunda pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 2 de 6" });
            await expect(page).toClick('#option-0');
            // Tercera pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 3 de 6" });
            await expect(page).toClick('#option-0');
            // Cuarta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 4 de 6" });
            await expect(page).toClick('#option-0');
            // Quinta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 5 de 6" });
            await expect(page).toClick('#option-0');
            // Sexta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 6 de 6" });
            await expect(page).toClick('#option-0');
        });

        then('I should see the finish page', async () => {
            await expect(page).toMatchElement("h1", { text: "The End" });
            // Cerramos la sesión
            await expect(page).toClick('button', { text: 'Mi perfil' });
            await expect(page).toClick('li', { text: 'Cerrar sesión' });
        });

    });

    test('Authenticated user starts and finish a game and restarts the game', ({given,when,then}) => {

        let username;
        let password;

        given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
            username = "aswusergametesting";
            password = "ValidPassword123";
        });

        when('I log in and I click on Start Game and I answer all questions and I clic "Volver"', async () => {
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);

            await expect(page).toClick('button', { text: 'Iniciar Sesión' });

            await page.waitForTimeout(1000);
            await expect(page).toClick('button', { text: '¡Acción!' });

            //await expect(page).toMatchElement("h2", { text: "Preparando las palomitas..." });

            await expect(page).toMatchElement("img"); 

            // Primera pregunta
            await expect(page).toMatchElement("p", { text: "Pregunta 1 de 6" });
            await expect(page).toClick('#option-0');
            // Segunda pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 2 de 6" });
            await expect(page).toClick('#option-1');
            // Tercera pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 3 de 6" });
            await expect(page).toClick('#option-2');
            // Cuarta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 4 de 6" });
            await expect(page).toClick('#option-3');
            // Quinta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 5 de 6" });
            await expect(page).toClick('#option-0');
            // Sexta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 6 de 6" });
            await expect(page).toClick('#option-1');

            // Final del juego
            await expect(page).toMatchElement("h1", { text: "The End" });
            await page.waitForTimeout(1000);
            await expect(page).toClick("button", { text: "Volver" });
        });

        then('I should see the welcome page', async () => {
            await expect(page).toClick("button", { text: "¡Acción!" });

            //await expect(page).toMatchElement("h2", { text: "Preparando las palomitas..." });
            // Cerramos la sesión
            await expect(page).toClick('button', { text: 'Mi perfil' });
            await expect(page).toClick('li', { text: 'Cerrar sesión' });
        });

    });

    test('Authenticated user starts and finish a game and restarts the game and finish the game again', ({given,when,then}) => {

        let username;
        let password;

        given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
            username = "aswusergametesting";
            password = "ValidPassword123";
        });

        when('I log in and I click on Start Game and I answer all questions and I clic "Volver" and I answer all questions again', async () => {
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Iniciar Sesión' });
            await page.waitForTimeout(1000);
            await expect(page).toClick('button', { text: '¡Acción!' });

            //await expect(page).toMatchElement("h2", { text: "Preparando las palomitas..." });

            await expect(page).toMatchElement("img"); 

            // Primera pregunta
            await expect(page).toMatchElement("p", { text: "Pregunta 1 de 6" });
            await expect(page).toClick('#option-0');
            // Segunda pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 2 de 6" });
            await expect(page).toClick('#option-1');
            // Tercera pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 3 de 6" });
            await expect(page).toClick('#option-2');
            // Cuarta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 4 de 6" });
            await expect(page).toClick('#option-3');
            // Quinta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 5 de 6" });
            await expect(page).toClick('#option-0');
            // Sexta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 6 de 6" });
            await expect(page).toClick('#option-1');

            // Final del juego
            await expect(page).toMatchElement("h1", { text: "The End" });
            await page.waitForTimeout(1000);
            await expect(page).toClick("button", { text: "Volver" });

            // Empezamos el juego de nuevo
            await page.waitForTimeout(1000);
            await expect(page).toClick('button', { text: '¡Acción!' });

            //await expect(page).toMatchElement("h2", { text: "Preparando las palomitas..." });

            await expect(page).toMatchElement("img"); 

            // Primera pregunta
            await expect(page).toMatchElement("p", { text: "Pregunta 1 de 6" });
            await expect(page).toClick('#option-0');
            // Segunda pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 2 de 6" });
            await expect(page).toClick('#option-1');
            // Tercera pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 3 de 6" });
            await expect(page).toClick('#option-2');
            // Cuarta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 4 de 6" });
            await expect(page).toClick('#option-3');
            // Quinta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 5 de 6" });
            await expect(page).toClick('#option-0');
            // Sexta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 6 de 6" });
            await expect(page).toClick('#option-1');
        });

        then('I should see the finish page', async () => {
            await expect(page).toMatchElement("h1", { text: "The End" });
            // Cerramos la sesión
            await expect(page).toClick('button', { text: 'Mi perfil' });
            await expect(page).toClick('li', { text: 'Cerrar sesión' });
        });

    });

    test('Authenticated user starts and finish a large game', ({given,when,then}) => {

        let username;
        let password;

        given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
            username = "aswusergametesting";
            password = "ValidPassword123";
        });

        when('I log in and I click on Start Game and I answer all questions', async () => {
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Iniciar Sesión' });
            await expect(page).toMatchElement("h5", { text: "LONGITUD DEL JUEGO" });
            await expect(page).toClick('button', { text: 'LARGA' });
            await page.waitForTimeout(1000);
            await expect(page).toClick('button', { text: '¡Acción!' });

            await expect(page).toMatchElement("img"); 

            // Primera pregunta
            await expect(page).toMatchElement("p", { text: "Pregunta 1 de 18" });
            await expect(page).toClick('#option-0');
            // Segunda pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 2 de 18" });
            await expect(page).toClick('#option-1');
            // Tercera pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 3 de 18" });
            await expect(page).toClick('#option-2');
            // Cuarta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 4 de 18" });
            await expect(page).toClick('#option-3');
            // Quinta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 5 de 18" });
            await expect(page).toClick('#option-0');
            // Sexta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 6 de 18" });
            await expect(page).toClick('#option-1');
            // Septima pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 7 de 18" });
            await expect(page).toClick('#option-2');
            // Octava pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 8 de 18" });
            await expect(page).toClick('#option-3');
            // Novena pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 9 de 18" });
            await expect(page).toClick('#option-0');
            // Decima pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 10 de 18" });
            await expect(page).toClick('#option-1');
            // Undecima pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 11 de 18" });
            await expect(page).toClick('#option-2');
            // Duodecima pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 12 de 18" });
            await expect(page).toClick('#option-3');
            // Decimotercera pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 13 de 18" });
            await expect(page).toClick('#option-0');
            // Decimocuarta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 14 de 18" });
            await expect(page).toClick('#option-1');
            // Decimoquinta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 15 de 18" });
            await expect(page).toClick('#option-2');
            // Decimosexta pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 16 de 18" });
            await expect(page).toClick('#option-3');
            // Decimoséptima pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 17 de 18" });
            await expect(page).toClick('#option-0');
            // Decimoctava pregunta
            await page.waitForTimeout(1000);
            await expect(page).toMatchElement("p", { text: "Pregunta 18 de 18" });
            await expect(page).toClick('#option-1');
        });

        then('I should see the finish page', async () => {
            await expect(page).toMatchElement("h1", { text: "The End" });
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