// 启动封面验证：阻断 JS 看 boot 帧；放行后对比交接帧
import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4173';
const browser = await chromium.launch();

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  // 中止 JS bundle，观察纯 boot 帧
  await page.route('**/assets/index-*.js', route => route.abort());
  await page.goto(BASE + '/', { waitUntil: 'commit' }).catch(() => {});
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `output/visual-fix-1/t5-boot-frame-${vp.width}.png`, timeout: 8000 });
  await page.unroute('**/assets/index-*.js');
  await ctx.close();

  // 正常加载后的交接帧
  const ctx2 = await browser.newContext({ viewport: vp });
  const page2 = await ctx2.newPage();
  await page2.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page2.waitForTimeout(400);
  await page2.screenshot({ path: `output/visual-fix-1/t5-after-swap-${vp.width}.png` });
  // 确认 boot-home 已移除
  const cls = await page2.evaluate(() => document.documentElement.className);
  console.log(`${vp.width}: after swap, html class = "${cls}"`);
  await ctx2.close();
}

// 非首页不得出现 boot 覆盖层
const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p3 = await ctx3.newPage();
await p3.goto(BASE + '/lap-times', { waitUntil: 'commit' });
await p3.waitForTimeout(300);
const bootVisible = await p3.evaluate(() => getComputedStyle(document.querySelector('.boot-home-root')).display);
console.log('lap-times boot root display:', bootVisible);
await browser.close();
