const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log("Navigating to http://localhost:3000 ...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const ssPath = '/home/jules/verification/screenshots/directive_73164_homepage.png';
  await page.screenshot({ path: ssPath, fullPage: false });
  console.log(`Screenshot saved to ${ssPath}`);

  await browser.close();
})();
