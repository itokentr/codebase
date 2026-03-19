import type { Browser, Page } from '@playwright/test';
import { chromium, expect } from '@playwright/test';
import { after, afterEach, before, beforeEach, test } from '@repo/test';
import npx from 'libnpmexec';
import path from 'node:path';
import type { PreviewServer } from 'vite';
import { preview } from 'vite';

let browser: Browser;
let page: Page;
let server: PreviewServer;

before(async () => {
  const cwd = process.cwd();
  const appDir = path.join(import.meta.dirname, 'app');
  const libDir = path.join(import.meta.dirname, 'components');
  await npx({ args: ['vite', 'build', '-l', 'silent'], runPath: libDir });
  await npx({ args: ['vite', 'build', '-l', 'silent'], runPath: appDir });
  process.chdir(appDir);
  server = await preview({ logLevel: 'silent' });
  process.chdir(cwd);
  browser = await chromium.launch();
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto('http://localhost:4173/');
});

after(async () => {
  await server.close();
  await browser.close();
});

afterEach(async () => {
  await page.close();
});

test('can preview', async () => {
  await expect(page.locator('counter-button')).toContainText('1st Hello Jack!');
});

test('click button one time', async () => {
  await page.locator('counter-button').click();
  await expect(page.locator('counter-button')).toContainText('2nd Hello Jack!');
});
