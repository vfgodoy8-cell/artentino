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

// Get first product slug
await page.goto('http://localhost:3001/catalogo');
await page.waitForTimeout(2000);
const firstProduct = await page.locator('a[href^="/catalogo/"]').first().getAttribute('href');
console.log('product url:', firstProduct);

if (firstProduct) {
  await page.goto('http://localhost:3001' + firstProduct);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/faseD_producto.png', fullPage: true });
  console.log('screenshot ok');
}

await browser.close();
