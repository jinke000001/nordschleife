// 降级行为 + 移动端全页空白检查
import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4173';
const browser = await chromium.launch();

// 1) prefers-reduced-motion：桌面 1440×900
let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
let page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const reduced = await page.evaluate(() => ({
  cls: document.querySelector('.story-home').className,
  sceneCls: document.querySelector('.journey-scene').className,
  sceneH: document.querySelector('.journey-scene').style.height || null,
  trailVisible: getComputedStyle(document.querySelector('.journey-static-trail')).display,
}));
console.log('reduced-motion:', JSON.stringify(reduced));
await ctx.close();

// 2) 移动端 390×844 全页截图空白扫描
ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  const step = innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 50)); }
  scrollTo(0, 0); await new Promise(r => setTimeout(r, 300));
});
await page.screenshot({ path: 'output/visual-fix-1/t1-mobile-full.png', fullPage: true });
await ctx.close();
await browser.close();
console.log('mobile screenshot done');
