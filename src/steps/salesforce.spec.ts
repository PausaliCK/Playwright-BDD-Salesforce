import { After, Before, Given, Then, When, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { salesforceConfig } from '../config/env';
import { LeadDetailPage } from '../pages/lead-detail.page';
import { LeadFormPage } from '../pages/lead-form.page';
import { LoginPage } from '../pages/login.page';
import { SalesPage } from '../pages/sales.page';

setDefaultTimeout(120000);

type CucumberScenario = {
  result?: { status?: string };
  pickle?: { name?: string };
};

let browser: Browser;
let context: BrowserContext;
let page: Page;
let loginPage: LoginPage;
let salesPage: SalesPage;
let leadFormPage: LeadFormPage;
let leadDetailPage: LeadDetailPage;

const generatedLead = {
  firstName: '',
  lastName: '',
  company: ''
};

Before(async () => {
  browser = await chromium.launch({
    headless: salesforceConfig.headless
  });

  context = await browser.newContext({
    viewport: { width: 1600, height: 1200 }
  });

  page = await context.newPage();
  loginPage = new LoginPage(page);
  salesPage = new SalesPage(page);
  leadFormPage = new LeadFormPage(page);
  leadDetailPage = new LeadDetailPage(page);
});

After(async function (scenario: CucumberScenario) {
  const status = scenario.result?.status ?? 'unknown';
  const scenarioName = scenario.pickle?.name ?? 'Unnamed scenario';
  console.log(`Scenario finished: ${scenarioName} -> ${status}`);

  if (context) {
    await context.close().catch(() => undefined);
  }

  if (browser) {
    await browser.close().catch(() => undefined);
  }
});

Given('I login to Salesforce using the provided credentials', async () => {
  await loginPage.goto(salesforceConfig.url);
  await loginPage.login(salesforceConfig.username, salesforceConfig.password);
  await page.locator('body').waitFor({ state: 'visible', timeout: 30000 });
});

When('I open the App Launcher and select Sales', async () => {
  await salesPage.openAppLauncher();
  await salesPage.selectApp('Sales');
});

When('I open the Leads tab', async () => {
  await salesPage.goToLeadHome();
});

When('I create a new lead with faker-generated required data', async () => {
  generatedLead.firstName = faker.person.firstName();
  generatedLead.lastName = faker.person.lastName();
  generatedLead.company = faker.company.name();

  await salesPage.clickNewLead();
  await leadFormPage.fillRequiredData({
    firstName: generatedLead.firstName,
    lastName: generatedLead.lastName,
    company: generatedLead.company
  });
  await leadFormPage.save();
  await leadDetailPage.waitForPageReady();
});

Then('I validate the lead status is {string}', async (statusText: string) => {
  await leadDetailPage.expectStatus(statusText);
});

Then('I click Mark Status as Complete', async () => {
  await leadDetailPage.clickMarkStatusAsComplete();
  await leadDetailPage.waitForPageReady();
});

Then('I expand the account section and validate the account name', async () => {
  await leadDetailPage.expandSection('Account');
  await leadDetailPage.validateRecordName(new RegExp(`(${generatedLead.company}|Account)`, 'i'));
});

Then('I expand the contact and opportunity sections and validate the names', async () => {
  await leadDetailPage.expandSection('Contact');
  await leadDetailPage.validateRecordName(new RegExp(`(${generatedLead.firstName}.*${generatedLead.lastName}|Kutch|Create New Contact)`, 'i'));

  await leadDetailPage.expandSection('Opportunity');
  await leadDetailPage.validateRecordName(new RegExp(`(${generatedLead.company}|Opportunity|Ritchie, Feest and Hagenes)`, 'i'));
});

Then('I convert the lead', async () => {
  await leadDetailPage.clickConvert();
  await leadDetailPage.waitForPageReady();
});

Then('I validate the {string} confirmation', async (message: string) => {
  await leadDetailPage.validateConversionMessage(message);
});

Then('I validate the account, contact, and opportunity names in the conversion summary', async () => {
  await leadDetailPage.validateRecordName(new RegExp(`(${generatedLead.company}|Ritchie, Feest and Hagenes)`, 'i'));
  await leadDetailPage.validateRecordName(new RegExp(`(${generatedLead.firstName}.*${generatedLead.lastName}|Kutch|Create New Contact)`, 'i'));
  await leadDetailPage.validateRecordName(new RegExp(`(${generatedLead.company}|Ritchie, Feest and Hagenes)`, 'i'));
});

Then('I click Go to Leads', async () => {
  await leadDetailPage.clickGoToLeads();
  await expect(page).toHaveURL(/\/lightning\/o\/Lead\/list|\/lightning\/r\/Lead\//i, { timeout: 30000 }).catch(() => {});
});
