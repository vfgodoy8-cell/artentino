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

// Nuevo producto
await page.goto('http://localhost:3001/admin/productos/nuevo');
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/faseA_nuevo.png', fullPage: true });
console.log('nuevo ok');

// Editar - tab info
await page.goto('http://localhost:3001/admin/productos');
await page.waitForTimeout(1500);
const editLink = await page.locator('a[href*="/editar"]').first().getAttribute('href');
if (editLink) {
  await page.goto('http://localhost:3001' + editLink);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/faseA_editar_info.png', fullPage: true });
  console.log('editar info ok');

  // Tab stock
  await page.locator('button').filter({ hasText: 'Stock' }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/faseA_editar_stock.png', fullPage: true });
  console.log('editar stock ok');
}

await browser.close();
