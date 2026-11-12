import { expect, Page } from '@playwright/test';

export type AccountData = {
    accountName: string;
    accountNumber: string;
    phone: string;
    email: string;
    description: string;
};

export class AccountDetailPage {
    constructor(private readonly page: Page) { }

    async waitForPageReady() {
        await this.page.waitForLoadState('domcontentloaded').catch(() => undefined);
        await this.page.waitForTimeout(1000);
    }

    async clickDetailsTab() {
        const detailsTab = this.page.locator('li').filter({ hasText: /^Details$/ });
        await detailsTab.waitFor({ state: 'visible', timeout: 20000 }).catch(() => undefined);
        if (await detailsTab.isVisible().catch(() => false)) {
            await detailsTab.click();
        }
    }


    async validateSavedData(data: AccountData) {
        await this.verifyFieldValue('Account Name', data.accountName);
        await this.verifyFieldValue('Account Number', data.accountNumber);
        await this.verifyFieldValue('Phone', data.phone);
    }

    async verifyFieldValue(labelName: string, expectedValue: string) {
        const field = this.page.locator(
            `records-record-layout-item[field-label="${labelName}"]`
        );

        await expect(field.locator('.test-id__field-value'))
            .toContainText(expectedValue, { timeout: 30000 });
    }


    async scrollToDescription() {
        const descriptionHeader = this.page.getByText(/description/i, { exact: false }).first();
        await descriptionHeader.waitFor({ state: 'visible', timeout: 20000 }).catch(() => undefined);
        if (await descriptionHeader.isVisible().catch(() => false)) {
            await descriptionHeader.scrollIntoViewIfNeeded();
        }

        await this.page.mouse.wheel(0, 800);
    }

    async validateDescription(description: string) {
        await expect(this.page.locator('body')).toContainText(description, { timeout: 30000 });
    }

    async clickAccountsTabAgain() {
        const candidates = [
            this.page.getByRole('link', { name: /accounts?/i }).first(),
            this.page.getByRole('button', { name: /accounts?/i }).first(),
            this.page.locator('[title="Accounts"]'),
            this.page.locator('[aria-label="Accounts"]'),
            this.page.getByText(/^Accounts$/i).first(),
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
    }
}
