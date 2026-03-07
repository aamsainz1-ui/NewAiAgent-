const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.coingecko.com/en', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  const data = await page.eval('table tbody tr', rows => rows.slice(0,5).map(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    return {
      name: (cells[2]?.innerText || '').trim(),
      price: (cells[3]?.innerText || '').trim(),
      change24h: (cells[4]?.innerText || '').trim(),
      marketCap: (cells[6]?.innerText || '').trim()
    };
  }));
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})();
