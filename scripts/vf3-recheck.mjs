import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from '@playwright/test';
const DIST = resolve('/Users/jinke00001/Desktop/纽北赛道/.worktrees/visual-fix-3/dist');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    let f = join(DIST, p);
    if (!existsSync(f) || !p.includes('.')) f = join(DIST, 'index.html');
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' });
    res.end(await readFile(f));
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => server.listen(0, r));
const BASE = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await ctx.newPage();
await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
await mp.waitForTimeout(900);
const info = await mp.evaluate(() => {
  const h = document.querySelector('.mg-header') || document.querySelector('header');
  const r = h?.getBoundingClientRect();
  const homeNote = document.body.innerText.includes('17 篇完整弯道档案');
  return { rectH: r ? Math.round(r.height) : -1, offsetH: h?.offsetHeight, display: getComputedStyle(h).display, homeNote };
});
console.log(JSON.stringify(info));
await browser.close(); server.close();
