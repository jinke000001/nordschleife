// 真实浏览器里读 LCP entries + boot 覆盖层生命周期
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 412, height: 915 } });
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver(list => {
    for (const e of list.getEntries()) window.__lcp.push({ t: Math.round(e.startTime), size: e.size, id: e.id, cls: e.element?.className || '', url: e.url?.split('/').pop()?.slice(0, 40) });
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  window.__bootLog = [];
  const mo = new MutationObserver(() => {
    window.__bootLog.push({ t: Math.round(performance.now()), boot: document.documentElement.classList.contains('boot-home'), bootImgPainted: !!document.querySelector('.boot-cover img') && document.querySelector('.boot-cover img').complete });
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});
// CPU 节流 4x 模拟移动设备
const client = await ctx.newCDPSession(page);
await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const result = await page.evaluate(() => ({ lcp: window.__lcp, bootLog: window.__bootLog }));
console.log(JSON.stringify(result, null, 1));
await browser.close();
