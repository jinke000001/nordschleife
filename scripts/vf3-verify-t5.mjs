// visual-fix-3 T5 验证：桌面端 43 地名快速定位下拉。
// 1440 与 1280：下拉可见、含 43 项、不与地图重叠；选中"旋转木马"→ 地图高亮 +
// 自动展开 + 右栏切换 + 滚动到位；移动端原有功能无回归；原生 select 键盘可用。
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
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok }); console.log(ok ? 'PASS' : 'FAIL', name, detail); };

for (const width of [1440, 1280]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => {
    const label = document.querySelector('.circuit-jump-select');
    const select = label.querySelector('select');
    const map = document.querySelector('#circuit .guide-map-visual .track-map');
    const lr = label.getBoundingClientRect(), mr = map.getBoundingClientRect();
    return { visible: lr.height > 0, options: select.options.length,
      overlap: !(lr.bottom <= mr.top || lr.top >= mr.bottom || lr.right <= mr.left || lr.left >= mr.right),
      wraps: (() => { const r = select.getBoundingClientRect(); return r.width > 0 && r.right <= label.parentElement.getBoundingClientRect().right + 1; })() };
  });
  check(`${width}：下拉可见且含 43 项`, info.visible && info.options === 43, JSON.stringify(info));
  check(`${width}：下拉不与地图重叠、不折行溢出`, !info.overlap && info.wraps, JSON.stringify(info));
  if (width === 1440) {
    await page.evaluate(() => document.querySelector('.circuit-jump-select').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(OUT, 't5-desk-jump-select.png') });
  }
  // 选中"旋转木马"（index 24，已降级锚点）→ 高亮 + 展开 + 滚动
  await page.evaluate(() => document.getElementById('circuit').scrollIntoView({ behavior: 'instant' }));
  await page.waitForTimeout(300);
  await page.selectOption('.circuit-jump-select select', 'karussell');
  await page.waitForTimeout(700);
  const jumped = await page.evaluate(() => {
    const card = document.getElementById('track-stop-24');
    const loc = document.querySelector('.circuit-location strong');
    const detail = document.getElementById('anchor-detail-24');
    const activeLabel = document.querySelector('.track-label-layer .active, .track-label.active');
    return { cardTop: Math.round(card?.getBoundingClientRect().top ?? -9999),
      detailVisible: detail?.getClientRects().length > 0,
      locationText: loc?.textContent, mapActive: activeLabel?.textContent?.trim() ?? null };
  });
  check(`${width}：选中旋转木马 → 展开 + 滚动到位 + 右栏切换`, jumped.detailVisible && jumped.cardTop > -100 && jumped.cardTop < 400 && /旋转木马/.test(jumped.locationText ?? ''), JSON.stringify(jumped));
  check(`${width}：地图高亮联动`, !!jumped.mapActive, `active: ${jumped.mapActive}`);
  await page.close();
}

// 移动端回归：下拉仍可用（story-static 下全部展开，jumpTo 滚动到位）
const mp = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
await mp.waitForTimeout(400);
const mobVisible = await mp.evaluate(() => { const el = document.querySelector('.circuit-jump-select'); return el && el.getBoundingClientRect().height > 0 && el.querySelectorAll('option').length === 43; });
check('移动端下拉可见且 43 项（回归）', !!mobVisible);
await mp.selectOption('.circuit-jump-select select', 'doettinger-hoehe');
await mp.waitForTimeout(700);
const mobJump = await mp.evaluate(() => Math.round(document.getElementById('track-stop-38')?.getBoundingClientRect().top ?? -9999));
check('移动端选中多廷根高地 → 滚动到位（回归）', mobJump > -100 && mobJump < 500, `top ${mobJump}`);
await mp.evaluate(() => document.querySelector('.circuit-jump-select').scrollIntoView({ block: 'center', behavior: 'instant' }));
await mp.waitForTimeout(400);
await mp.screenshot({ path: join(OUT, 't5-mob-jump-select.png') });
await mp.close();

await browser.close();
server.close();
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} 通过`);
process.exit(failed.length ? 1 : 0);
