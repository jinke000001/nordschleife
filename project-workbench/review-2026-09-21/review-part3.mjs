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

// 弯角搜索：正常命中
await page.goto(BASE + '/corners', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const input = page.locator('input[type="search"]').first();
await input.fill('旋转木马');
await page.waitForTimeout(500);
const hitCount = await page.evaluate(() => document.body.innerText.match(/\d+\s*\/\s*\d+/)?.[0]);
const cardsShown = await page.evaluate(() => [...document.querySelectorAll('a[href^="/corners/"]')].length);
console.log('search 旋转木马 -> counter:', hitCount, 'corner links:', cardsShown);
await page.screenshot({ path: join(OUT, 'desk-corners-search-hit.png') });
// 空状态
await input.fill('zzzz不存在');
await page.waitForTimeout(500);
const emptyText = await page.evaluate(() => {
  const el = [...document.querySelectorAll('main *, [class*="empty"] *, body *')].find(e => e.children.length === 0 && /没有|未找到|无结果|找不到/.test(e.textContent));
  return el ? el.textContent.trim().slice(0, 60) : null;
});
console.log('search empty state text:', emptyText);
await page.screenshot({ path: join(OUT, 'desk-corners-search-empty.png') });

// Karussell 观察点点击
await page.goto(BASE + '/experience/karussell', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
const btns = await page.evaluate(() => [...document.querySelectorAll('button')].map(b => b.textContent.trim().slice(0, 20)));
console.log('karussell buttons:', JSON.stringify(btns.slice(0, 10)));
const ob = page.locator('button', { hasText: '外侧沥青' }).first();
if (await ob.count()) {
  await ob.click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(OUT, 'desk-karussell-click.png') });
  console.log('karussell observation click ok');
}
// 圈速筛选联动
await page.goto(BASE + '/lap-times', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
const before = await page.evaluate(() => document.body.innerText.length);
const pill = page.locator('button', { hasText: '纯电' }).first();
if (await pill.count()) {
  await pill.click();
  await page.waitForTimeout(500);
  const rows = await page.evaluate(() => document.body.innerText.match(/成绩说明/g)?.length);
  console.log('lap filter 纯电 rows:', rows);
  await page.screenshot({ path: join(OUT, 'desk-laptimes-filter-ev.png') });
}
await browser.close();
server.close();
console.log('DONE');
