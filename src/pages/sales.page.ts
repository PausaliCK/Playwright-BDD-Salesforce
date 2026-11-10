import { Page } from '@playwright/test';

export class SalesPage {
  constructor(private readonly page: Page) {}

  async openAppLauncher() {
    const launcher = this.page
      .locator('button[aria-label="App Launcher"], div[title="App Launcher"], button[title="App Launcher"]')
      .first();

    await launcher.waitFor({ state: 'visible', timeout: 20000 });
    await launcher.click();
  }

  async selectApp(appName: string) {
    const appCandidates = [
      this.page.getByRole('button', { name: new RegExp(appName, 'i') }),
      this.page.getByRole('link', { name: new RegExp(appName, 'i') }),
      this.page.locator(`[title="${appName}"]`),
      this.page.locator(`[aria-label="${appName}"]`),
      this.page.getByText(new RegExp(`^${appName}$`, 'i'), { exact: true })
    ];

    for (const candidate of appCandidates) {
      if (await candidate.count()) {
        const first = candidate.first();
        if (await first.isVisible().catch(() => false)) {
          await first.click();
          return;
        }
      }
    }

    const origin = new URL(this.page.url()).origin;
    await this.page.goto(`${origin}/lightning/o/Lead/list?filterName=Recent`);
  }

  async goToLeadHome() {
    const leadCandidates = [
      this.page.getByRole('link', { name: /leads?/i }),
      this.page.getByRole('button', { name: /leads?/i }),
      this.page.locator('[title="Leads"]'),
      this.page.locator('[aria-label="Leads"]')
    ];

    for (const candidate of leadCandidates) {
      if (await candidate.count()) {
        const first = candidate.first();
        if (await first.isVisible().catch(() => false)) {
          await first.click();
          return;
        }
      }
    }

    const origin = new URL(this.page.url()).origin;
    await this.page.goto(`${origin}/lightning/o/Lead/list?filterName=Recent`);
  }

  async clickNewLead() {
    const newButton = this.page.getByRole('button', { name: /^new$/i }).first();
    await newButton.waitFor({ state: 'visible', timeout: 20000 });
    await newButton.click({ force: true });
  }
}
