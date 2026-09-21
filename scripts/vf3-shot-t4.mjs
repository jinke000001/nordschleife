// T4 截图：移动端首页 Hero（header 高度前后对比）。
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
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.woff2': 'font/woff2' };
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
const tag = process.argv[2] || 'after';
const mp = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
await mp.waitForTimeout(600);
await mp.screenshot({ path: join(OUT, `t4-mob-hero-${tag}.png`) });
await mp.goto(BASE + '/corners', { waitUntil: 'networkidle' });
await mp.waitForTimeout(600);
await mp.screenshot({ path: join(OUT, `t4-mob-corners-${tag}.png`) });
await browser.close();
server.close();
console.log('saved', tag);
