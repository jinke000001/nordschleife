// visual-fix-3 T3 验证：抽查次级文字的实测对比度（计算样式色 vs 有效背景色）。
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

const grab = `(() => {
  const pick = el => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    let bg = 'rgba(0, 0, 0, 0)', node = el;
    while (node && (bg = getComputedStyle(node).backgroundColor) === 'rgba(0, 0, 0, 0)') node = node.parentElement;
    return { selector: el.dataset.probe, color: cs.color, bg, fontSize: cs.fontSize, text: el.textContent.trim().slice(0, 24) };
  };
  const out = [];
  const add = (name, el) => { if (el) { el.dataset.probe = name; out.push(pick(el)); } };
  add('circuit步号(绿底)', document.querySelector('#circuit .guide-step-number'));
  add('circuit地名DE小字', document.querySelector('#circuit .circuit-location small'));
  add('circuit地图脚注', document.querySelector('#circuit .circuit-map-footer'));
  add('circuit区间计数', document.querySelector('#circuit .circuit-gap-count'));
  add('circuit来源注脚', document.querySelector('#circuit .circuit-source-footnote'));
  add('circuit紧凑行meta', document.querySelector('#circuit .circuit-anchor-row .guide-step-number'));
  add('structure地图署名(纸底)', document.querySelector('.guide-map-credit'));
  add('structure步骤small(纸底)', document.querySelector('.guide-step > small'));
  add('工程章节span(纸底)', document.querySelector('.guide-engineering header > span'));
  add('home照片署名', document.querySelector('.story-credit'));
  return out;
})()`;

const lum = rgb => {
  const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255).map(c => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const results = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);
for (const item of await page.evaluate(grab)) {
  const r = ratio(item.color, item.bg);
  const ok = r >= 4.5;
  results.push({ ...item, ratio: r, ok });
  console.log(ok ? 'PASS' : 'FAIL', `${item.selector}  ${item.fontSize}  ${item.color} on ${item.bg}  = ${r.toFixed(2)}:1`);
}
// 截图：circuit 章节 meta 区域（桌面+移动）
await page.evaluate(() => document.getElementById('anchor-open-9')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
await page.waitForTimeout(400);
await page.screenshot({ path: join(OUT, 't3-desk-circuit-meta.png') });
await page.close();

const mp = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
await mp.evaluate(() => document.querySelector('#circuit .circuit-map-footer')?.scrollIntoView({ block: 'center', behavior: 'instant' }));
await mp.waitForTimeout(400);
await mp.screenshot({ path: join(OUT, 't3-mob-circuit-meta.png') });
await mp.close();

await browser.close();
server.close();
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} 处对比度 ≥ 4.5:1`);
process.exit(failed.length ? 1 : 0);
