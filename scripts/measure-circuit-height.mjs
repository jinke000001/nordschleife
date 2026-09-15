// visual-fix-2 验收测量：首页总高、#circuit 章节高、条目逐条高度。
// 用法：node scripts/measure-circuit-height.mjs [url] [width] [height]
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:5173';
const url = process.argv[2] || '/';
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(BASE + url, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 400));
});

const report = await page.evaluate(() => {
  const section = document.getElementById('circuit');
  const stops = [...document.querySelectorAll('#circuit [data-reading-step]')].map(node => ({
    id: node.id || null,
    cls: node.className.toString().slice(0, 60),
    height: Math.round(node.getBoundingClientRect().height),
    visible: node.getClientRects().length > 0
  }));
  const visibleTotal = stops.filter(s => s.visible).reduce((sum, s) => sum + s.height, 0);
  return {
    docHeight: document.documentElement.scrollHeight,
    circuitHeight: section?.offsetHeight ?? null,
    stepCount: stops.length,
    visibleStepCount: stops.filter(s => s.visible).length,
    visibleStepsTotal: visibleTotal,
    stops
  };
});
console.log(JSON.stringify(report, null, 2));
await browser.close();
