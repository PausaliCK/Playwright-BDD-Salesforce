# Playwright BDD Salesforce Lead Automation

This project contains a Playwright + Cucumber TypeScript setup for a Salesforce lead creation and conversion flow.

## Project structure

- `src/features/` — BDD feature files
- `src/steps/` — Cucumber step definitions
- `src/pages/` — page object classes
- `src/config/` — environment settings
- `playwright.config.ts` — Playwright defaults
- `.env` — local Salesforce credentials

## Commands

```bash
npm install
npm test
```

For a headed run:

```bash
npm run test:headed
```

## Flow implemented

- Login to Salesforce
- Open App Launcher and select Sales
- Create a new Lead using Faker-generated required fields
- Validate the lead status progression
- Convert the lead and validate the result
- Return to the Leads list
