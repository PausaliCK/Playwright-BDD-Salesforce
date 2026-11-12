import { Page } from '@playwright/test';

export type AccountFormData = {
  accountName: string;
  accountNumber: string;
  phone: string;
  email: string;
  description: string;
};

export class AccountFormPage {
  constructor(private readonly page: Page) {}

  private async fillFieldByLabel(label: string, value: string) {
    const apiNames = new Set<string>([label]);

    const normalizedLabel = label.trim();
    if (normalizedLabel === 'Account Name') {
      apiNames.add('Name');
      apiNames.add('AccountName');
    } else if (normalizedLabel === 'Account Number') {
      apiNames.add('AccountNumber');
    } else if (normalizedLabel === 'Phone') {
      apiNames.add('Phone');
    } else if (normalizedLabel === 'Email') {
      apiNames.add('Email');
    } else if (normalizedLabel === 'Description') {
      apiNames.add('Description');
    }

    const selectors = [
      this.page.getByLabel(new RegExp(label, 'i'), { exact: false }),
      this.page.getByRole('textbox', { name: new RegExp(label, 'i') }),
      this.page.getByPlaceholder(new RegExp(label, 'i')),
      ...Array.from(apiNames).map((apiName) => this.page.locator(`input[name="${apiName}"]`)),
      ...Array.from(apiNames).map((apiName) => this.page.locator(`textarea[name="${apiName}"]`)),
      ...Array.from(apiNames).map((apiName) => this.page.locator(`input[aria-label="${apiName}"]`)),
      ...Array.from(apiNames).map((apiName) => this.page.locator(`textarea[aria-label="${apiName}"]`)),
      ...Array.from(apiNames).map((apiName) => this.page.locator(`input[placeholder="${apiName}"]`)),
      ...Array.from(apiNames).map((apiName) => this.page.locator(`textarea[placeholder="${apiName}"]`)),
    ];

    for (const candidate of selectors) {
      if (await candidate.count()) {
        const field = candidate.first();
        await field.waitFor({ state: 'visible', timeout: 20000 }).catch(() => undefined);
        if (await field.isVisible().catch(() => false)) {
          await field.fill(value);
          return;
        }
      }
    }
    throw new Error(`Could not find visible field for ${label}`);
  }

  async fillData(data: AccountFormData) {
    await this.fillFieldByLabel('Account Name', data.accountName);
    await this.fillFieldByLabel('Account Number', data.accountNumber);
    await this.fillFieldByLabel('Phone', data.phone);

    const emailField = this.page.getByLabel(/email/i, { exact: false }).first();
    if (await emailField.count().catch(() => 0)) {
      await emailField.waitFor({ state: 'visible', timeout: 5000 }).catch(() => undefined);
      if (await emailField.isVisible().catch(() => false)) {
        await emailField.fill(data.email);
      }
    }

    await this.fillFieldByLabel('Description', data.description);
  }

  async save() {
    const saveButton = this.page.getByRole('button', { name: /^save$/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 20000 });
    await saveButton.click();
  }
}
