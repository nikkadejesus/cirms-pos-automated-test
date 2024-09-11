const { defineConfig } = require("cypress");

require('dotenv').config()

const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const preprocessor = require('@badeball/cypress-cucumber-preprocessor');
const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild');

async function setupNodeEvents(on, config) {
    await preprocessor.addCucumberPreprocessorPlugin(on, config);
    on(
        'file:preprocessor',
        createBundler({
            plugins: [createEsbuildPlugin.default(config)],
        })
    );
    return config;
}

module.exports = defineConfig({
    env: {
        username: process.env.POS_USERNAME,
        password: process.env.POS_PASSWORD,
    },
    e2e: {
        setupNodeEvents,
        baseUrl: process.env.BASE_URL,
        specPattern: ['**/*.{cy.js,feature,features}'],
    },
    retries: {
        runMode: Number(process.env.CYPRESS_RUNMODE),
        openMode: Number(process.env.CYPRESS_OPENMODE),
    },
    // viewportWidth: 1440,
    // viewportHeight: 900,
    // chromeWebSecurity: false,
    // numTestsKeptInMemory: Number(process.env.CYPRESS_NUMTESTKEPTINMEM),
    // experimentalMemoryManagement: true,

    // responseTimeout: 100000,
    // defaultCommandTimeout: 50000,
    // pageLoadTimeout: 100000,
});
