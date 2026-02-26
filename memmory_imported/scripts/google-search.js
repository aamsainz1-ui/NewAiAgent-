const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=slot%20wallet', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);
  const results = await page.eval('div.g', nodes => nodes
    .map(node => {
      const titleEl = node.querySelector('h3');
      const linkEl = node.querySelector('a');
      const snippetEl = node.querySelector('.VwiC3b, .BNeawe.s3v9rd.AP7Wnd');
      const sitePathEl = node.querySelector('.MUxGbd.wuQ4Ob.WZ8Tjf, .NJjxre');
      return {
        title: titleEl ? titleEl.innerText : '',
        url: linkEl ? linkEl.href : '',
        snippet: snippetEl ? snippetEl.innerText : '',
        sitePath: sitePathEl ? sitePathEl.innerText : ''
      };
    })
    .filter(item => item.title && item.url)
    .slice(0, 5)
  );
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
