import fs from 'node:fs';
import path from 'node:path';

export type EcommerceLoginData = {
  url: string;
  username: string;
  password: string;
};

const defaultDataFile = path.resolve('test-data/ecommerce-login.json');

export function loadEcommerceLoginData(): EcommerceLoginData {
  const dataFile = path.resolve(process.env.TEST_DATA_FILE ?? defaultDataFile);

  if (!fs.existsSync(dataFile)) {
    throw new Error(`Test data file was not found: ${dataFile}. Copy test-data/ecommerce-login.example.json and provide local values.`);
  }

  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8')) as Partial<EcommerceLoginData>;
  for (const field of ['url', 'username', 'password'] as const) {
    if (!data[field]) {
      throw new Error(`Test data field is missing: ${field}`);
    }
  }

  return data as EcommerceLoginData;
}
