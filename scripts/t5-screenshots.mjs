// T5 视觉回归截图：首页、圈速档案、弯道档案 × 1440×900 / 390×844
import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4173';
const OUT = 'project-workbench/visual-fix-1-screenshots';
const routes = [
  ['/', 'home'],
  ['/lap-times', 'lap-times'],
  ['/corners', 'corners'],
];
const browser = await chromium.launch();
for (const vp of [{ width: 1440, height: 900, name: 'desktop' }, { width: 390, height: 844, name: 'mobile' }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [route, name] of routes) {
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${name}-${vp.name}-top.png` });
    // full-page
    await page.evaluate(async () => {
      const step = innerHeight * 0.8;
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
      scrollTo(0, 0); await new Promise(r => setTimeout(r, 250));
    });
    await page.screenshot({ path: `${OUT}/${name}-${vp.name}-full.png`, fullPage: true });
    console.log('saved', name, vp.name);
  }
  await ctx.close();
}
await browser.close();
