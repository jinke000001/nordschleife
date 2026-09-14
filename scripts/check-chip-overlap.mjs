// T2 验证：逐屏扫描浮动 chip 与交互控件的重叠
import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4173';
const routes = ['/lap-times', '/corners', '/corners/karussell', '/brands', '/brands/porsche', '/experience/karussell', '/no-such-page'];
const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
const browser = await chromium.launch();

const checkOverlap = () => {
  const chip = document.querySelector('.return-to-guide');
  if (!chip) return { chip: false };
  const box = chip.getBoundingClientRect();
  const hidden = chip.classList.contains('is-overlapping');
  const controls = document.querySelectorAll('main a, main button, main input, main select, main textarea, main summary, main label, main [role="button"]');
  const hits = [];
  for (const control of controls) {
    if (control === chip || chip.contains(control)) continue;
    const r = control.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.left < box.right && r.right > box.left && r.top < box.bottom && r.bottom > box.top) {
      hits.push((control.textContent || control.getAttribute('aria-label') || control.tagName).trim().slice(0, 30));
    }
  }
  return { chip: true, hidden, hits };
};

let failures = 0;
for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const docH = await page.evaluate(() => document.documentElement.scrollHeight);
    const step = Math.floor(vp.height * 0.5);
    let routeBad = [];
    for (let y = 0; y <= docH; y += step) {
      await page.evaluate(v => scrollTo(0, v), y);
      await page.waitForTimeout(260);
      const res = await page.evaluate(checkOverlap);
      if (!res.chip) break;
      if (!res.hidden && res.hits.length) routeBad.push({ y, hits: res.hits });
    }
    const status = routeBad.length ? `FAIL ${JSON.stringify(routeBad.slice(0, 3))}` : 'ok';
    if (routeBad.length) failures++;
    console.log(`${vp.width}×${vp.height} ${route}: ${status}`);
  }
  await ctx.close();
}
await browser.close();
process.exit(failures ? 1 : 0);
