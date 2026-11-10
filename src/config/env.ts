import * as dotenv from 'dotenv';

dotenv.config();

export const salesforceConfig = {
  url: process.env.SALESFORCE_URL || 'https://login.salesforce.com',
  username: process.env.SALESFORCE_USERNAME || '',
  password: process.env.SALESFORCE_PASSWORD || '',
  headless: false
};
