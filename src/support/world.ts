import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import { LeadDetailPage } from "../pages/lead-detail.page";
import { LeadFormPage } from "../pages/lead-form.page";
import { LoginPage } from "../pages/login.page";
import { SalesPage } from "../pages/sales.page";

export class SalesforceWorld extends World {
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
      recordVideo: {
        dir: "videos",
        size: { width: 1600, height: 1200 },
      },
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
    } catch {
      // Ignore browser shutdown errors.
    }

    try {
      if (this.context) {
        await this.context.close();
      }
    } catch {
      // Ignore browser shutdown errors.
    }

    try {
      if (this.browser) {
        await this.browser.close();
      }
    } catch {
      // Ignore browser shutdown errors.
    }

    this.page = undefined as unknown as Page;
    this.context = undefined as unknown as BrowserContext;
    this.browser = undefined as unknown as Browser;
  }
}

setWorldConstructor(SalesforceWorld);
