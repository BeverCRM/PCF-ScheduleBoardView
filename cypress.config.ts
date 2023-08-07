import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://bevertest.crm4.dynamics.com',
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 10000,
    retries: { 'runMode': 1, 'openMode': 1 },
  },
});
