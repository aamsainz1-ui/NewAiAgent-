const { chromium } = require('playwright');
const { spawn } = require('child_process');
(async () => {
  const vite = spawn('npx', ['vite', '--port', '8081'], { stdio: 'inherit' });
  await new Promise(r => setTimeout(r, 3000));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
    console.log(error.stack);
  });
  await page.goto('http://localhost:8081/');
  await page.waitForTimeout(3000);
  await browser.close();
  vite.kill();
  process.exit(0);
})();
