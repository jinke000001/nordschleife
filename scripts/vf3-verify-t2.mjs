// visual-fix-3 T2 验证：两处口径文案存在、链接可达、1440/390 无水平溢出。
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

for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: 2 });
  // /corners 文案 + 链接
  await page.goto(BASE + '/corners', { waitUntil: 'networkidle' });
  const corners = await page.evaluate(() => {
    const note = document.querySelector('.mg-corner-scope');
    const link = note?.querySelector('a');
    return { text: note?.textContent ?? '', href: link?.getAttribute('href'), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  check(`/corners 口径文案存在 (${vp.width})`, /43 处地名，其中 17 个弯收录了完整档案/.test(corners.text), corners.text.slice(0, 60));
  check(`/corners 链接指向 /#circuit (${vp.width})`, corners.href === '/#circuit', corners.href);
  if (vp.width === 1440) {
    await page.evaluate(() => document.querySelector('.mg-corner-scope').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(OUT, 't2-desk-corners-scope.png') });
    // 链接可达：点击后应回到首页并定位 #circuit
    await page.click('.mg-corner-scope a');
    await page.waitForTimeout(1200);
    const landed = await page.evaluate(() => ({ path: location.pathname, hash: location.hash, circuitTop: Math.round(document.getElementById('circuit')?.getBoundingClientRect().top ?? -9999) }));
    check('点击链接回到首页并定位 #circuit', landed.path === '/' && landed.circuitTop > -200 && landed.circuitTop < 600, JSON.stringify(landed));
  } else {
    await page.evaluate(() => document.querySelector('.mg-corner-scope').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(OUT, 't2-mob-corners-scope.png') });
  }
  check(`无水平页面溢出 (${vp.width})`, corners.overflow <= 0, `overflow ${corners.overflow}px`);

  // 首页 #circuit 章节头文案 + 链接
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const home = await page.evaluate(() => {
    const note = document.querySelector('#circuit .guide-heading-note');
    const link = note?.querySelector('a');
    return { text: note?.textContent ?? '', href: link?.getAttribute('href'), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  check(`#circuit 章节头口径文案存在 (${vp.width})`, /12 个弯带实拍照片与完整讲解/.test(home.text) && /5 个弯暂无实拍照片/.test(home.text), home.text.slice(0, 80));
  check(`#circuit 链接指向 /corners (${vp.width})`, home.href === '/corners', home.href);
  check(`首页无水平页面溢出 (${vp.width})`, home.overflow <= 0, `overflow ${home.overflow}px`);
  await page.evaluate(() => document.querySelector('#circuit .guide-heading-note').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, vp.width === 1440 ? 't2-desk-circuit-note.png' : 't2-mob-circuit-note.png') });
  await page.close();
}
await browser.close();
server.close();
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} 通过`);
process.exit(failed.length ? 1 : 0);
