module.exports = {
    testMatch: ["**/steps/login.steps.js"],
    testTimeout: 30000,
    setupFilesAfterEnv: ["expect-puppeteer"]
}