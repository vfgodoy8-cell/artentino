import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();

await page.goto('http://localhost:3001/faq');
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/faseF_faq_top.png', fullPage: false });
console.log('top ok');

await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/faseF_faq_mid.png', fullPage: false });
console.log('mid ok');

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(300);
await page.screenshot({ path: '/tmp/faseF_faq_bottom.png', fullPage: false });
console.log('bottom ok');

await browser.close();
