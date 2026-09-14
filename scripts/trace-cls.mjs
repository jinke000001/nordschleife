// 逐帧记录 main 的 top，定位 CLS 时机
import { chromium } from '@playwright/test';
const route = process.argv[2] || '/no-such-page-404';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 915 } });
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__tops = [];
  const poll = () => {
    const main = document.getElementById('ed-content');
    const header = document.querySelector('.ed-header');
    window.__tops.push({
      t: Math.round(performance.now()),
      mainTop: main ? Math.round(main.getBoundingClientRect().top) : null,
      mainH: main ? Math.round(main.getBoundingClientRect().height) : null,
      headerH: header ? Math.round(header.getBoundingClientRect().height) : null,
      docH: document.documentElement.scrollHeight,
    });
    if (performance.now() < 6000) requestAnimationFrame(poll);
  };
  requestAnimationFrame(poll);
});
await page.goto('http://localhost:4173' + route, { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
const tops = await page.evaluate(() => window.__tops.filter((v, i, a) => i === 0 || v.mainTop !== a[i - 1].mainTop || v.mainH !== a[i - 1].mainH || v.headerH !== a[i - 1].headerH));
console.log(JSON.stringify(tops, null, 1));
await browser.close();
