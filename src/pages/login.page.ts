import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  async login(username: string, password: string) {
    const usernameField = this.page.locator('#username');
    const loginButton = this.page.locator('#Login').first();
    const passwordField = this.page.locator('#password');
    const passwordFallbackLink = this.page.locator('a').filter({ hasText: /log in with a password/i }).first();

    await usernameField.waitFor({ state: 'visible', timeout: 60000 });
    await usernameField.fill(username);
    await loginButton.click();

    await Promise.race([
      passwordField.waitFor({ state: 'visible', timeout: 30000 }).catch(() => undefined),
      passwordFallbackLink.waitFor({ state: 'visible', timeout: 30000 }).catch(() => undefined)
    ]);

    if (await passwordField.count()) {
      await passwordField.waitFor({ state: 'visible', timeout: 30000 });
    } else {
      const passwordUrl = await passwordFallbackLink.getAttribute('href');
      if (passwordUrl) {
        await this.page.goto(passwordUrl, { waitUntil: 'domcontentloaded' });
      }
      await passwordField.waitFor({ state: 'visible', timeout: 30000 });
    }

    await passwordField.fill(password);

    const submitButton = this.page.locator('#Login').first();
    await submitButton.click();
  }
}
