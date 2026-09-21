// visual-fix-3 T1 截图：桌面默认紧凑行 / 展开完整卡 / 移动端静态回退。
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'project-workbench/visual-fix-3-screenshots');
mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain', '.woff2': 'font/woff2' };
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

const desk = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await desk.goto(BASE + '/', { waitUntil: 'networkidle' });
// 先全程滚动一遍触发懒加载，避免截图时布局仍在位移
await desk.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 400));
});
await desk.evaluate(() => document.getElementById('anchor-open-10').scrollIntoView({ block: 'center', behavior: 'instant' }));
await desk.waitForTimeout(600);
await desk.screenshot({ path: join(OUT, 't1-desk-circuit-collapsed.png') });
await desk.evaluate(() => document.getElementById('anchor-open-10').click());
await desk.waitForTimeout(600);
await desk.evaluate(() => document.getElementById('track-stop-10').scrollIntoView({ block: 'start', behavior: 'instant' }));
await desk.waitForTimeout(400);
await desk.screenshot({ path: join(OUT, 't1-desk-circuit-expanded.png') });
await desk.close();

const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await mob.goto(BASE + '/', { waitUntil: 'networkidle' });
await mob.evaluate(async () => {
  const step = window.innerHeight * 0.8;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 400));
});
await mob.evaluate(() => document.getElementById('track-stop-10').scrollIntoView({ block: 'start', behavior: 'instant' }));
await mob.waitForTimeout(600);
await mob.screenshot({ path: join(OUT, 't1-mob-circuit-static.png') });
await mob.close();

await browser.close();
server.close();
console.log('screenshots saved to', OUT);
