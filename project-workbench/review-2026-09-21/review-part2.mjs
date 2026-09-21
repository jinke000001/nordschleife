import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const DIST = resolve(ROOT, '../../dist');
const OUT = join(ROOT, 'shots');
mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    let file = join(DIST, p);
    if (!existsSync(file) || !p.includes('.')) file = join(DIST, 'index.html');
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => server.listen(0, r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const H = await page.evaluate(() => document.body.scrollHeight);
console.log('height', H);
// 均匀取 10 个采样点覆盖 7000~23337
for (let i = 0; i < 10; i++) {
  const y = 7000 + i * ((H - 7500) / 9);
  await page.evaluate(v => window.scrollTo({ top: v }), y);
  await page.waitForTimeout(900);
  await page.screenshot({ path: join(OUT, `desk-home-deep${i}.png`) });
  console.log('shot deep', i, Math.round(y));
}
// 模拟地图交互：点击地图上的一个弯名
await page.evaluate(() => document.querySelector('#circuit')?.scrollIntoView());
await page.waitForTimeout(800);
const mapClick = await page.evaluate(() => {
  const labels = [...document.querySelectorAll('#circuit text, #circuit [class*="label"] button, #circuit button')];
  return labels.slice(0, 5).map(l => l.tagName + ' ' + (l.textContent || '').trim().slice(0, 20));
});
console.log('map labels sample:', JSON.stringify(mapClick));
// 打开折角面板:点第一个地名按钮
const clicked = await page.evaluate(() => {
  const b = [...document.querySelectorAll('#circuit button')].find(b => b.textContent.trim().length > 0 && b.textContent.trim().length < 12);
  if (b) { b.click(); return b.textContent.trim(); }
  return null;
});
console.log('clicked map name:', clicked);
await page.waitForTimeout(800);
await page.screenshot({ path: join(OUT, 'desk-home-map-click.png') });
// 圈速区交互:搜索框
await page.evaluate(() => document.querySelector('#lap')?.scrollIntoView() || document.querySelector('[id*="lap"]')?.scrollIntoView());
await page.waitForTimeout(800);
await page.screenshot({ path: join(OUT, 'desk-home-lap-section.png') });
await browser.close();
server.close();
