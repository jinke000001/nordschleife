// T2 证据截图：遮挡位置（chip 应隐藏）与常规位置（chip 应可见）
import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4173';
const browser = await chromium.launch();

async function findOverlapScroll(page, vp) {
  const docH = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = 120;
  for (let y = 0; y <= docH; y += step) {
    await page.evaluate(v => scrollTo(0, v), y);
    await page.waitForTimeout(60);
    const hit = await page.evaluate(() => {
      const chip = document.querySelector('.return-to-guide');
      if (!chip) return false;
      const box = chip.getBoundingClientRect();
      const controls = document.querySelectorAll('main a, main button, main input, main select, main summary, main label, main [role="button"]');
      for (const control of controls) {
        if (control === chip || chip.contains(control)) continue;
        const r = control.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        if (r.left < box.right && r.right > box.left && r.top < box.bottom && r.bottom > box.top) return true;
      }
      return false;
    });
    if (hit) return y;
  }
  return null;
}

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  await page.goto(BASE + '/lap-times', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: `output/visual-fix-1/t2-chip-visible-${vp.width}.png` });
  const y = await findOverlapScroll(page, vp);
  console.log(`${vp.width}×${vp.height}: overlap scroll pos =`, y);
  if (y !== null) {
    await page.waitForTimeout(300);
    const hidden = await page.evaluate(() => document.querySelector('.return-to-guide').classList.contains('is-overlapping'));
    console.log(`  chip hidden at overlap: ${hidden}`);
    await page.screenshot({ path: `output/visual-fix-1/t2-chip-avoids-${vp.width}.png` });
  }
  await ctx.close();
}
await browser.close();
