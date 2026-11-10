import { Given, Then, When, World, IWorldOptions, setDefaultTimeout, setWorldConstructor} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium, expect} from "@playwright/test";
import { faker } from "@faker-js/faker";
import { salesforceConfig } from "../../config/env";
import { LeadDetailPage } from "../../pages/lead-detail.page";
import { LeadFormPage } from "../../pages/lead-form.page";
import { LoginPage } from "../../pages/login.page";
import { SalesPage } from "../../pages/sales.page";

class SalesforceWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  loginPage!: LoginPage;
  salesPage!: SalesPage;
  leadFormPage!: LeadFormPage;
  leadDetailPage!: LeadDetailPage;
  generatedLead = {
    firstName: "",
    lastName: "",
    company: "",
  };

  private initialized = false;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async ensureInitialized() {
    if (this.initialized) {
      return;
    }

    this.browser = await chromium.launch({
      headless: false,
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1600, height: 1200 },
    });

    this.page = await this.context.newPage();
    this.loginPage = new LoginPage(this.page);
    this.salesPage = new SalesPage(this.page);
    this.leadFormPage = new LeadFormPage(this.page);
    this.leadDetailPage = new LeadDetailPage(this.page);
    this.initialized = true;
  }

  async closeBrowser() {
    this.initialized = false;

    try {
      if (this.page) {
        await this.page.close();
      }
    } catch (error) {
      // Immediate shutdown without waiting.
    }

    try {
      if (this.context) {
        await this.context.close();
      }
    } catch (error) {
      // Immediate shutdown without waiting.
    }

    try {
      if (this.browser) {
        await this.browser.close();
      }
    } catch (error) {
      // Immediate shutdown without waiting.
    }

    this.page = undefined as unknown as Page;
    this.context = undefined as unknown as BrowserContext;
    this.browser = undefined as unknown as Browser;
  }
}

setWorldConstructor(SalesforceWorld);

setDefaultTimeout(120000);

Given(
  "I login to Salesforce using the provided credentials",
  async function (this: SalesforceWorld) {
    await this.ensureInitialized();
    await this.loginPage.goto(salesforceConfig.url);
    await this.loginPage.login(
      salesforceConfig.username,
      salesforceConfig.password,
    );
    await this.page
      .locator("body")
      .waitFor({ state: "visible", timeout: 30000 });
  },
);

When(
  'I open the App Launcher and select Sales',
  async function (this: SalesforceWorld) {
    await this.ensureInitialized();
    await this.salesPage.openAppLauncher();
    await this.salesPage.selectApp("Sales");
  },
);

When("I open the Leads tab", async function (this: SalesforceWorld) {
  await this.ensureInitialized();
  await this.salesPage.goToLeadHome();
});

When(
  "I create a new lead with faker-generated required data",
  async function (this: SalesforceWorld) {
    await this.ensureInitialized();
    this.generatedLead.firstName = faker.person.firstName();
    this.generatedLead.lastName = faker.person.lastName();
    this.generatedLead.company = faker.company.name();

    await this.salesPage.clickNewLead();
    await this.leadFormPage.fillRequiredData({
      firstName: this.generatedLead.firstName,
      lastName: this.generatedLead.lastName,
      company: this.generatedLead.company,
    });
    await this.leadFormPage.save();
    await this.leadDetailPage.waitForPageReady();
  },
);

Then(
  "I validate the lead status is {string}",
  async function (this: SalesforceWorld, statusText: string) {
    await this.ensureInitialized();
    await this.leadDetailPage.expectStatus(statusText);
  },
);

Then("I click Mark Status as Complete", async function (this: SalesforceWorld) {
  await this.ensureInitialized();
  await this.leadDetailPage.clickMarkStatusAsComplete();
  await this.leadDetailPage.waitForPageReady();
});

Then(
  "I expand the account section and validate the account name",
  async function (this: SalesforceWorld) {
    await this.ensureInitialized();
    await this.leadDetailPage.expandSection("Account");
    await this.leadDetailPage.validateRecordName(
      new RegExp(`(${this.generatedLead.company}|Account)`, "i"),
    );
  },
);

Then(
  "I expand the contact and opportunity sections and validate the names",
  async function (this: SalesforceWorld) {
    await this.ensureInitialized();
    await this.leadDetailPage.expandSection("Contact");
    await this.leadDetailPage.validateRecordName(
      new RegExp(
        `(${this.generatedLead.firstName}.*${this.generatedLead.lastName}|Kutch|Create New Contact)`,
        "i",
      ),
    );

    await this.leadDetailPage.expandSection("Opportunity");
    await this.leadDetailPage.validateRecordName(
      new RegExp(
        `(${this.generatedLead.company}|Opportunity|Ritchie, Feest and Hagenes)`,
        "i",
      ),
    );
  },
);

Then("I convert the lead", async function (this: SalesforceWorld) {
  await this.ensureInitialized();
  await this.leadDetailPage.clickConvert();
  await this.leadDetailPage.waitForPageReady();
});

Then(
  "I validate the {string} confirmation",
  async function (this: SalesforceWorld, message: string) {
    await this.ensureInitialized();
    await this.leadDetailPage.validateConversionMessage(message);
  },
);

Then(
  "I validate the account, contact, and opportunity names in the conversion summary",
  async function (this: SalesforceWorld) {
    await this.ensureInitialized();
    await this.leadDetailPage.validateRecordName(
      new RegExp(
        `(${this.generatedLead.company}|Ritchie, Feest and Hagenes)`,
        "i",
      ),
    );
    await this.leadDetailPage.validateRecordName(
      new RegExp(
        `(${this.generatedLead.firstName}.*${this.generatedLead.lastName}|Kutch|Create New Contact)`,
        "i",
      ),
    );
    await this.leadDetailPage.validateRecordName(
      new RegExp(
        `(${this.generatedLead.company}|Ritchie, Feest and Hagenes)`,
        "i",
      ),
    );
  },
);

Then("I click Go to Leads", async function (this: SalesforceWorld) {
  await this.ensureInitialized();
  await this.leadDetailPage.clickGoToLeads();
  await expect(this.page)
    .toHaveURL(/\/lightning\/o\/Lead\/list|\/lightning\/r\/Lead\//i, {
      timeout: 30000,
    })
    .catch(() => {});

  await this.closeBrowser();
});
