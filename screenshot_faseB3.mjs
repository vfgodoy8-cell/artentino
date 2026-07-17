import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();

await page.goto('http://localhost:3001/login');
await page.waitForSelector('input[type="email"]');
await page.fill('input[type="email"]', 'admin@test.com');
await page.fill('input[type="password"]', 'admin1234');
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);

await page.goto('http://localhost:3001/admin/productos/cmq74uozh000004jqzy3ke94m/editar');
await page.waitForTimeout(4000);
await page.screenshot({ path: '/tmp/faseB_editar.png', fullPage: true });
console.log('screenshot taken');

// Log all buttons
const buttons = await page.locator('button').all();
for (const btn of buttons) {
  const text = await btn.textContent();
  console.log('button:', text?.trim());
}

await browser.close();
