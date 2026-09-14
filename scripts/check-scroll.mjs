// 检查横向滚动区在真实滚动过程中用户可见内容
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

for (const y of [3000, 3750, 4500, 5500, 6500, 7300]) {
  await page.evaluate(v => window.scrollTo(0, v), y);
  await page.waitForTimeout(250);
  const info = await page.evaluate(() => {
    const scene = document.querySelector('.journey-scene');
    const vp = document.querySelector('.journey-viewport');
    const rail = document.querySelector('.journey-rail');
    const r = vp.getBoundingClientRect();
    return {
      scrollY,
      viewportRect: { top: Math.round(r.top), height: Math.round(r.height) },
      railTransform: rail.style.transform,
      sceneInlineHeight: scene.style.height,
    };
  });
  console.log(JSON.stringify(info));
  await page.screenshot({ path: `output/visual-fix-1/scroll-${y}.png` });
}
await browser.close();
