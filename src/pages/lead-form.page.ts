import { Page } from '@playwright/test';

export type LeadFormData = {
  firstName: string;
  lastName: string;
  company: string;
};

export class LeadFormPage {
  constructor(private readonly page: Page) {}

  async fillRequiredData(data: LeadFormData) {
    const firstNameField = this.page.locator('input[name="firstName"]').first();
    if (await firstNameField.count()) {
      await firstNameField.waitFor({ state: 'visible', timeout: 20000 });
      await firstNameField.fill(data.firstName);
    }

    const lastNameField = this.page.locator('input[name="lastName"]').first();
    await lastNameField.waitFor({ state: 'visible', timeout: 20000 });
    await lastNameField.fill(data.lastName);

    const companyField = this.page.locator('input[name="Company"]').first();
    await companyField.waitFor({ state: 'visible', timeout: 20000 });
    await companyField.fill(data.company);
  }

  async save() {
    const saveButton = this.page.getByRole('button', { name: /^save$/i }).first();
    await saveButton.waitFor({ state: 'visible', timeout: 20000 });
    await saveButton.click();
  }
}
