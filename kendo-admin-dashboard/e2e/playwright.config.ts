import { PlaywrightTestConfig } from '@playwright/test';
import * as path from 'path';

const reportsFolder = path.resolve(__dirname, 'reports');

const config: PlaywrightTestConfig = {
  testDir: './tests',
  name: 'Kendo Admin Dashboard E2E Tests',
  timeout: 60000,
  expect: {
     timeout: 12000
  },
  retries: 1,
  outputDir: path.resolve(reportsFolder, 'output-tests'),
  preserveOutput: 'failures-only',
  reporter: [
     ['html', {outputFolder: path.resolve(reportsFolder, 'html-report'), open: 'never'}],
     ['json', {outputFile: path.resolve(reportsFolder, 'json-report', 'results.json')}]
  ],
  use: {
    baseURL: 'https://danieltakev.github.io',
    actionTimeout: 12000,
    headless: false,
    trace: 'retain-on-failure',
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    video: {
       mode: 'retain-on-failure',
       size: {
          width: 1200,
          height: 720
       }
    },
    launchOptions: {
      downloadsPath: path.resolve(reportsFolder, 'downloads')
   }
  },
  projects: [
    {
        name: 'Kendo Admin Dashboard E2E Tests',
        testDir: './tests/'
    }
  ]
};

export default config;
