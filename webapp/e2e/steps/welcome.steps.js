const puppeteer = require('puppeteer');
const { defineFeature, loadFeature }=require('jest-cucumber');
const setDefaultOptions = require('expect-puppeteer').setDefaultOptions
const feature = loadFeature('./features/welcome.feature');
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
            slowMo: 20
            });
        page = await browser.newPage();
        //Way of setting up the timeout
        setDefaultOptions({ timeout: 60000 })
    
        await page
            .goto("http://localhost:3000", {
            waitUntil: "networkidle0",
            })
            .catch(() => {});

        // Registro del usuario
        await expect(page).toClick("button", { text: "Don't have an account? Register here." });
        await expect(page).toFill('input[name="username"]', "aswuser");
        await expect(page).toFill('input[name="password"]', "ValidPassword123");
        // await page.waitForSelector('button', { visible: true });
        // await expect(page).toClick('button', { text: "Add User", force: true });
        await expect(page).toClick('#add-user-btn');


        // Confirmar que el registro fue exitoso
        await expect(page).toMatchElement("div", { text: "Usuario añadido correctamente" });
    });

    beforeEach(async () => {
        await page.waitForTimeout(1500);
        await page.goto("http://localhost:3000", { waitUntil: "networkidle0" });
    });

    test('Authenticated user logs into the game', ({given,when,then}) => {

        let username;
        let password;

        given('A registered user with username "aswuser" and password "ValidPassword123"', async () => {
            username = "aswuser";
            password = "ValidPassword123";
        });

        when('I log in', async () => {
            await expect(page).toFill('input[name="username"]', username);
            await expect(page).toFill('input[name="password"]', password);
            await expect(page).toClick('button', { text: 'Login' });
            await page.waitForTimeout(1000);
        });

        then('I should see the Welcome message of the game', async () => {
            await expect(page).toMatchElement("span");
            await expect(page).toMatchElement("p", { text: new RegExp(`Your account was created on`) });

        });

    });

});