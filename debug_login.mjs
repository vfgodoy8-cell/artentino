import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
const page = await context.newPage();

page.on('response', resp => {
  if (resp.status() >= 300) console.log(`  ${resp.status()} ${resp.url().slice(0, 80)}`);
});

await page.goto('http://localhost:3001/login');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: '/tmp/step1_loginpage.png' });
console.log('Login page loaded');

await page.fill('input[type="email"]', 'admin@test.com');
await page.fill('input[type="password"]', 'admin1234');
await page.screenshot({ path: '/tmp/step2_filled.png' });
console.log('Filled form');

await page.click('button[type="submit"]');
await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/step3_aftersubmit.png', fullPage: true });
console.log('After submit:', page.url());

await browser.close();
