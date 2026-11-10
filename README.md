# Playwright BDD Salesforce Automation

This project automates a Salesforce lead conversion flow using Playwright, Cucumber BDD, and TypeScript. It includes structured step definitions, page objects, environment-based configuration, and Allure reporting for richer test visibility.

## Tech stack

- Playwright for browser automation
- Cucumber for BDD scenarios
- TypeScript for test implementation
- Allure for reporting
- Faker for dynamic lead data
- dotenv for environment configuration

## What this project covers

The scenario in this repo validates the full Salesforce lead journey:

- Login to Salesforce
- Open the App Launcher and select Sales
- Open the Leads tab
- Create a new lead using Faker-generated required data
- Validate lead status progression
- Complete the conversion flow
- Verify the converted account, contact, and opportunity details
- Navigate back to the Leads list

## Project structure

- `src/features/` — BDD feature files
- `src/steps/` — Cucumber step definitions
- `src/pages/` — page object classes for Salesforce pages
- `src/config/` — environment configuration
- `cucumber.js` — Cucumber runner configuration
- `playwright.config.ts` — Playwright configuration
- `reports/` — Cucumber HTML report output
- `allure-results/` — raw Allure result files
- `allure-report/` — generated Allure dashboard

## Prerequisites

- Node.js and npm installed
- Salesforce credentials available in a local `.env` file

Example `.env`:

```bash
SALESFORCE_URL=https://login.salesforce.com
SALESFORCE_USERNAME=your_username@example.com
SALESFORCE_PASSWORD=your_password
```

## Installation

```bash
npm install
```

## Run the tests

Run the default BDD suite:

```bash
npm test
```

Run in headed mode:

```bash
npm run test:headed
```

Run a specific tag:

```bash
npx cucumber-js --config cucumber.js --tags @salesforceLeadConversion
```

## Reports

This project is configured to generate both HTML and Allure reports.

### Cucumber HTML report

The Cucumber HTML report is written to:

```bash
reports/cucumber-report.html
```

### Allure report

Generate the Allure report from the collected results:

```bash
npm run test:allure:generate
```

Open the report in the browser:

```bash
npm run test:allure:open
```

You can also run the test suite with Allure output enabled through the existing script:

```bash
npm run test:allure
```

## Notes

- The project uses `ts-node/register` so TypeScript step definitions run directly.
- `playwright.config.ts` is configured with common browser defaults and failure capture settings.
- The scenario is targeted to a Salesforce lead conversion flow and uses real login credentials from environment variables.
