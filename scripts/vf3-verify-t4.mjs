// visual-fix-3 T4 验证：移动端顶栏收纳。
// header ≤96px、四项导航可点击触达、Tab 可进入全部导航项、无页面级水平滚动、
// 窄屏（320px）导航自身横滑但页面不横滚、return-to-guide chip 不受影响。
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
const DIST = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
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

const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const m = await page.evaluate(() => {
  const h = document.querySelector('.mg-header');
  const nav = h.querySelector('nav');
  return { header: Math.round(h.getBoundingClientRect().height),
    pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    navItems: [...nav.querySelectorAll('a')].map(a => ({ text: a.textContent.trim(), h: Math.round(a.getBoundingClientRect().height), visible: a.getBoundingClientRect().left >= 0 && a.getBoundingClientRect().right <= innerWidth })) };
});
check('header ≤ 96px', m.header <= 96, `${m.header}px`);
check('无页面级水平滚动', m.pageOverflow <= 0, `${m.pageOverflow}px`);
check('四项导航触控目标 ≥44px', m.navItems.length === 4 && m.navItems.every(i => i.h >= 44), JSON.stringify(m.navItems.map(i => i.h)));
check('390px 下四项导航全部可见', m.navItems.every(i => i.visible), JSON.stringify(m.navItems.map(i => i.visible)));

// 四项导航逐项点击触达
const paths = ['/corners', '/brands', '/lap-times', '/'];
let allNav = true;
for (let i = 1; i <= 4; i++) {
  await page.click(`.mg-header nav a:nth-child(${i === 4 ? 1 : i + 1})`);
  await page.waitForTimeout(700);
  const here = await page.evaluate(() => location.pathname);
  const want = paths[i - 1];
  if (here !== want) { allNav = false; console.log('  导航失败:', want, '实际', here); }
}
check('四项导航均可点击触达', allNav);

// Tab 键进入全部导航项
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const tabbed = [];
for (let i = 0; i < 10; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(120); tabbed.push(await page.evaluate(() => ({ text: document.activeElement?.textContent?.trim().slice(0, 8), inNav: !!document.activeElement?.closest('.mg-header nav') }))); }
const navTabs = new Set(tabbed.filter(t => t.inNav).map(t => t.text));
check('Tab 可进入全部 4 个导航项', ['认识纽北', '弯道档案', '品牌与车', '圈速档案'].every(n => navTabs.has(n)), JSON.stringify(tabbed.map(t => t.text)));

// return-to-guide chip 不受影响（非首页存在且可点）
await page.goto(BASE + '/corners', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const chip = await page.evaluate(() => { const c = document.querySelector('.return-to-guide'); return c ? { visible: getComputedStyle(c).visibility !== 'hidden', href: c.getAttribute('href') } : null; });
check('return-to-guide chip 存在且指向 /', !!chip && chip.href === '/', JSON.stringify(chip));
await page.close();

// 320px 窄屏：导航内部可横滑、页面不横滚
const tiny = await browser.newPage({ viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true });
await tiny.goto(BASE + '/lap-times', { waitUntil: 'networkidle' });
await tiny.waitForTimeout(500);
const t = await tiny.evaluate(() => {
  const nav = document.querySelector('.mg-header nav');
  const header = document.querySelector('.mg-header');
  return { header: Math.round(header.getBoundingClientRect().height),
    pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    navCanScroll: nav.scrollWidth > nav.clientWidth,
    currentVisible: (() => { const a = nav.querySelector('[aria-current]'); if (!a) return null; const r = a.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })() };
});
check('320px header ≤ 96px', t.header <= 96, `${t.header}px`);
check('320px 页面无水平滚动', t.pageOverflow <= 0, `${t.pageOverflow}px`);
check('320px 当前导航项可见（JS 兜底）', t.currentVisible === true, JSON.stringify(t));
await tiny.close();

await browser.close();
server.close();
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} 通过`);
process.exit(failed.length ? 1 : 0);
