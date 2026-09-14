import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => {
  window.__heights = new Set();
  const record = () => window.__heights.add(innerHeight);
  addEventListener('resize', record);
  new ResizeObserver(record).observe(document.documentElement);
});
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'output/visual-fix-1/probe.png', fullPage: true });
const heights = await page.evaluate(() => [...window.__heights]);
console.log('innerHeight values seen during capture:', JSON.stringify(heights));
await browser.close();
