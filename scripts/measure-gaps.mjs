// 测量首页纵向空白区域：找出相邻可见内容元素之间超过 1 个视口高度的纯空白带。
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:4173';
const url = process.argv[2] || '/';
const width = Number(process.argv[3] || 1440);
const height = Number(process.argv[4] || 900);
const shot = process.argv[5] || '';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
await page.goto(BASE + url, { waitUntil: 'networkidle' });
// 滚动一遍触发懒加载与 motion measure，再回到顶部
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 300));
});

const report = await page.evaluate(() => {
  const docH = document.documentElement.scrollHeight;
  const scene = document.querySelector('.journey-scene');
  const sceneInfo = scene ? {
    className: scene.className,
    inlineHeight: scene.style.height || null,
    rect: scene.getBoundingClientRect().top + scrollY,
    height: scene.getBoundingClientRect().height,
  } : null;
  // 收集所有可见元素的纵向区间
  const rects = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    const r = node.getBoundingClientRect();
    if (r.height < 8 || r.width < 8) continue;
    const style = getComputedStyle(node);
    if (style.visibility === 'hidden' || style.display === 'none') continue;
    const top = r.top + scrollY;
    const hasOwnContent = node.children.length === 0 && (node.textContent.trim().length > 0 || node.tagName === 'IMG' || node.tagName === 'SVG' || style.backgroundImage !== 'none' || (style.backgroundColor !== 'rgba(0, 0, 0)' && style.backgroundColor !== 'transparent' && node.offsetHeight < 2000));
    if (hasOwnContent && r.height < 3000) rects.push({ top, bottom: top + r.height, tag: node.tagName, cls: (node.className.baseVal ?? node.className ?? '').toString().slice(0, 60), text: node.textContent.trim().slice(0, 24) });
  }
  rects.sort((a, b) => a.top - b.top);
  // 扫描整个文档高度，找出没有被任何内容区间覆盖的最长纵向空白
  const gaps = [];
  let cursor = 0;
  for (const r of rects) {
    if (r.top > cursor + 1) gaps.push({ from: Math.round(cursor), to: Math.round(r.top), size: Math.round(r.top - cursor) });
    cursor = Math.max(cursor, r.bottom);
  }
  if (docH > cursor + 1) gaps.push({ from: Math.round(cursor), to: Math.round(docH), size: Math.round(docH - cursor) });
  return { docH, sceneInfo, gaps: gaps.filter(g => g.size > 400).sort((a, b) => b.size - a.size).slice(0, 8) };
});
console.log(JSON.stringify(report, null, 2));

if (shot) {
  await page.screenshot({ path: shot, fullPage: true });
  console.log('screenshot saved:', shot);
}
await browser.close();
