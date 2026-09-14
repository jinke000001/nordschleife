// 模拟 fullPage 截图环境（超高视口）观察 DOM 状态
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4173';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const before = await page.evaluate(() => ({
  docH: document.documentElement.scrollHeight,
  scene: document.querySelector('.journey-scene').style.height,
  cls: document.querySelector('.journey-scene').className,
}));
console.log('normal:', JSON.stringify(before));

// 模拟 fullPage 截图时的超高视口
await page.setViewportSize({ width: 1440, height: 33615 });
await page.waitForTimeout(800);
const during = await page.evaluate(() => ({
  innerHeight,
  docH: document.documentElement.scrollHeight,
  scene: document.querySelector('.journey-scene').style.height,
  cls: document.querySelector('.journey-scene').className,
  viewportH: document.querySelector('.journey-viewport').getBoundingClientRect().height,
}));
console.log('giant viewport:', JSON.stringify(during));
await browser.close();
