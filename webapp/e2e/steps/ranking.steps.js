const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/ranking.feature');
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
        setDefaultOptions({ timeout: 20000 })
    
        await page
          .goto("http://localhost:3000", {
            waitUntil: "networkidle0",
          })
          .catch(() => {});
    });

    beforeEach(async () => {
        await page.waitForTimeout(1500);
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    test('Unauthenticated user views the ranking', ({given,when,then}) => {

        given('An unauthenticated user', async () => {
        });

        when('I try to access the game ranking page', async () => {
            await expect(page).toClick('button', { text: 'RANKING' });
        });

        then('I should see the ranking of the game', async () => {
            await expect(page).toMatchElement("h2", { text: "Ranking" });
            await expect(page).toMatchElement("th", { text: "Fecha" });
            await expect(page).toMatchElement("th", { text: "Puntuación" });
            //Cerramos el historial
            await expect(page).toClick('button', { text: 'Cerrar' });
        });

    });

    test('Unauthenticated user views the ranking on the Add User page', ({given,when,then}) => {

        given('An unauthenticated user', async () => {
        });

        when('I go to the register page and I try to access the game ranking page', async () => {
            await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
            await expect(page).toClick('button', { text: 'RANKING' });
        });

        then('I should see the ranking of the game', async () => {
            await expect(page).toMatchElement("h2", { text: "Ranking" });
            await expect(page).toMatchElement("th", { text: "Fecha" });
            await expect(page).toMatchElement("th", { text: "Puntuación" });
            //Cerramos el historial
            await expect(page).toClick('button', { text: 'Cerrar' });
        });

    });

    test('Authenticated user views the ranking from welcome page', ({given,when,then}) => {

        let username;
        let password;

        given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
            username = "aswuserranking";
            password = "ValidPassword123";

            await expect(page).toClick("button", { text: "¿No tienes una cuenta? Regístrate aquí." });
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Crear Usuario' });
        });

        when('I log in and I click on Ranking', async () => {
            await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Iniciar Sesión' });

            await expect(page).toMatchElement('button[name="start-game-button"]');
            
            await expect(page).toClick('button', { text: 'RANKING' });
        });

        then('I should see the ranking of the game', async () => {
            await expect(page).toMatchElement("h2", { text: "Ranking" });
            await expect(page).toMatchElement("th", { text: "Fecha" });
            await expect(page).toMatchElement("th", { text: "Puntuación" });
            //Cerramos el historial
            await expect(page).toClick('button', { text: 'Cerrar' });
            // Cerramos la sesión
            //await expect(page).toClick('button', { text: 'Mi perfil' });
            //await expect(page).toClick('li', { text: 'Cerrar sesión' });
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