import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto('http://localhost:4173/brands/porsche', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const state = await page.evaluate(() => {
  const chip = document.querySelector('.return-to-guide');
  const box = chip.getBoundingClientRect();
  const controls = document.querySelectorAll('main a, main button, main input, main select, main summary, main label, main [role="button"]');
  const hits = [];
  for (const control of controls) {
    if (control === chip || chip.contains(control)) continue;
    const r = control.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (r.left < box.right && r.right > box.left && r.top < box.bottom && r.bottom > box.top) {
      hits.push({ text: (control.textContent || '').trim().slice(0, 40), rect: { t: Math.round(r.top), b: Math.round(r.bottom), l: Math.round(r.left), r: Math.round(r.right) } });
    }
  }
  return { chipCls: chip.className, box: { t: Math.round(box.top), b: Math.round(box.bottom), l: Math.round(box.left), r: Math.round(box.right) }, hits };
});
console.log(JSON.stringify(state, null, 2));
await page.screenshot({ path: 'output/visual-fix-1/t2-debug-porsche-390.png' });
await browser.close();
