import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  expect: {
    timeout: 15000
  },
  reporter: [['list'], ['dot'], ['spec'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: 'https://login.salesforce.com',
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  }
});
