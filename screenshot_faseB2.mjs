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

// Editar producto - tab stock
await page.goto('http://localhost:3001/admin/productos');
await page.waitForTimeout(2000);
const editLink = await page.locator('a[href*="/editar"]').first().getAttribute('href');
console.log('editLink:', editLink);
if (editLink) {
  await page.goto('http://localhost:3001' + editLink);
  await page.waitForTimeout(3000);
  // Click on Stock tab by text
  const stockBtn = page.getByRole('button', { name: 'Stock' });
  await stockBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/tmp/faseB_stock.png', fullPage: true });
  console.log('stock tab ok');
}

await browser.close();
