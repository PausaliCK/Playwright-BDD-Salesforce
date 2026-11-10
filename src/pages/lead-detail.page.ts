import { expect, Page } from '@playwright/test';

export class LeadDetailPage {
  constructor(private readonly page: Page) {}

  async waitForPageReady() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  async expectStatus(statusText: string) {
    await expect(this.page.locator('body')).toContainText(statusText, { timeout: 30000 });
  }

  async clickMarkStatusAsComplete() {
    const button = this.page.getByRole('button', { name: /mark status as complete/i }).first();
    await button.waitFor({ state: 'visible', timeout: 20000 });
    await button.click();
  }

  async expandSection(sectionName: string) {
    const exactName = new RegExp(`^${sectionName}$`, 'i');
    const candidates = [
      this.page.locator(`button[aria-label*="${sectionName}"]`),
      this.page.locator(`button[title*="${sectionName}"]`),
      this.page.locator(`[data-name="${sectionName}"]`),
      this.page.locator('button').filter({ hasText: exactName }),
      this.page.locator('summary').filter({ hasText: exactName }),
      this.page.getByText(exactName, { exact: true })
    ];

    for (const candidate of candidates) {
      if (await candidate.count()) {
        const first = candidate.first();
        await first.waitFor({ state: 'visible', timeout: 20000 }).catch(() => undefined);
        if (await first.isVisible().catch(() => false)) {
          await first.click({ force: true });
          return;
        }
      }
    }

    await this.page.getByText(exactName).first().waitFor({ state: 'visible', timeout: 20000 });
    await this.page.getByText(exactName).first().click({ force: true });
  }

  async validateRecordName(recordName: string | RegExp) {
    await expect(this.page.locator('body')).toContainText(recordName, { timeout: 30000 });
  }

  async clickConvert() {
    const convertButton = this.page.getByRole('button', { name: /^convert$/i }).first();
    await convertButton.waitFor({ state: 'visible', timeout: 20000 });
    await convertButton.click();

    const modalConvertButton = this.page.getByRole('button', { name: /^convert$/i }).nth(1);
    if (await modalConvertButton.count()) {
      await modalConvertButton.waitFor({ state: 'visible', timeout: 20000 });
      await modalConvertButton.click();
    }
  }

  async validateConversionMessage(message: string) {
    await expect(this.page.getByText(new RegExp(message, 'i'))).toBeVisible({ timeout: 30000 });
  }

  async clickGoToLeads() {
    const candidates = [
      this.page.getByRole('link', { name: /go to leads/i }).first(),
      this.page.getByRole('button', { name: /go to leads/i }).first(),
      this.page.getByText(/go to leads/i).first()
    ];

    for (const candidate of candidates) {
      if (await candidate.count().catch(() => 0)) {
        await candidate.waitFor({ state: 'visible', timeout: 10000 }).catch(() => undefined);
        if (await candidate.isVisible().catch(() => false)) {
          await candidate.click();
          return;
        }
      }
    }

    const origin = new URL(this.page.url()).origin;
    await this.page.goto(`${origin}/lightning/o/Lead/list?filterName=Recent`, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('networkidle');
  }
}
