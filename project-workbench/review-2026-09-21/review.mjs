// 独立评审脚本：本地静态服务 dist，Playwright 遍历主要路由（桌面 + 移动），截图并采集控制台错误/失败请求/页面文本大纲。
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

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

const server = createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    let file = join(DIST, p);
    if (!existsSync(file) || !p.includes('.')) file = join(DIST, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('nf');
  }
});
await new Promise(r => server.listen(0, r));
const PORT = server.address().port;
const BASE = `http://127.0.0.1:${PORT}`;
console.log('serving', BASE);

const browser = await chromium.launch();
const report = { consoleErrors: {}, failedRequests: {}, pages: {} };

async function collect(label, page, url) {
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const failed = [];
  page.on('requestfailed', r => failed.push(`${r.url()} :: ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.url()} :: HTTP ${r.status()}`); });
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => errs.push('goto: ' + e.message));
  await page.waitForTimeout(800);
  report.consoleErrors[label] = errs;
  report.failedRequests[label] = failed;
  return Date.now() - t0;
}

async function outline(page) {
  return page.evaluate(() => {
    const hs = [...document.querySelectorAll('h1,h2,h3')].map(h => `${h.tagName} ${h.textContent.trim().replace(/\s+/g, ' ').slice(0, 80)}`);
    const nav = [...document.querySelectorAll('header nav a, header a[href]')].map(a => `${a.textContent.trim()} -> ${a.getAttribute('href')}`).slice(0, 20);
    const links = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
    const bodyText = document.body.innerText.length;
    return { hs, nav, linkCount: links.length, bodyText };
  });
}

async function shot(page, name) {
  await page.screenshot({ path: join(OUT, name + '.png') });
  console.log('shot', name);
}

// ---------- 桌面 ----------
const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const dp = await desk.newPage();

// 首页
const homeMs = await collect('home', dp, BASE + '/');
report.pages.home = await outline(dp);
await shot(dp, 'desk-home-hero');
// 向下滚动分段截图
const vh = 900;
for (let i = 1; i <= 8; i++) {
  await dp.evaluate(y => window.scrollTo({ top: y }), i * vh);
  await dp.waitForTimeout(700);
  await shot(dp, `desk-home-s${i}`);
}
const docH = await dp.evaluate(() => document.body.scrollHeight);
console.log('home page height(px):', docH);
// 直达地图章节
await dp.evaluate(() => document.querySelector('#circuit')?.scrollIntoView());
await dp.waitForTimeout(900);
await shot(dp, 'desk-home-map');
// 弯角列表
await collect('corners', dp, BASE + '/corners');
report.pages.corners = await outline(dp);
await shot(dp, 'desk-corners-top');
// 尝试搜索/筛选控件
const filterInfo = await dp.evaluate(() => {
  const inputs = [...document.querySelectorAll('input,select,[role="searchbox"],button')].map(el => `${el.tagName}.${el.className} type=${el.type || ''} text=${(el.textContent || el.value || '').trim().slice(0, 30)}`);
  return inputs.slice(0, 40);
});
console.log('corners controls:', JSON.stringify(filterInfo, null, 1));
// 点击第一个弯角卡进入详情
const firstCorner = await dp.evaluate(() => {
  const a = document.querySelector('a[href^="/corners/"]');
  return a ? a.getAttribute('href') : null;
});
console.log('first corner link:', firstCorner);
if (firstCorner) {
  await collect('corner-detail', dp, BASE + firstCorner);
  report.pages.cornerDetail = await outline(dp);
  await shot(dp, 'desk-corner-detail-top');
  await dp.evaluate(() => window.scrollTo(0, 1200));
  await dp.waitForTimeout(600);
  await shot(dp, 'desk-corner-detail-mid');
}
// 圈速档案
await collect('lap-times', dp, BASE + '/lap-times');
report.pages.lapTimes = await outline(dp);
await shot(dp, 'desk-laptimes-top');
await dp.evaluate(() => window.scrollTo(0, 1400));
await dp.waitForTimeout(600);
await shot(dp, 'desk-laptimes-mid');
// 品牌页
await collect('brands', dp, BASE + '/brands');
report.pages.brands = await outline(dp);
await shot(dp, 'desk-brands');
const firstBrand = await dp.evaluate(() => {
  const a = document.querySelector('a[href^="/brands/"]');
  return a ? a.getAttribute('href') : null;
});
if (firstBrand) {
  await collect('brand-detail', dp, BASE + firstBrand);
  await shot(dp, 'desk-brand-detail');
}
// Karussell 体验页
await collect('karussell', dp, BASE + '/experience/karussell');
report.pages.karussell = await outline(dp);
await shot(dp, 'desk-karussell-top');
// 404
await collect('notfound', dp, BASE + '/no-such-page');
await shot(dp, 'desk-404');
// 键盘导航抽查：首页 Tab 焦点
await dp.goto(BASE + '/');
await dp.waitForTimeout(500);
await dp.keyboard.press('Tab');
await dp.waitForTimeout(200);
const focus1 = await dp.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 40) + ' | ' + (document.activeElement?.getAttribute('href') || ''));
console.log('first Tab focus:', focus1);

await desk.close();

// ---------- 移动 ----------
const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const mp = await mob.newPage();
await collect('m-home', mp, BASE + '/');
report.pages.mHome = await outline(mp);
await shot(mp, 'mob-home-hero');
await mp.evaluate(() => window.scrollTo(0, 900));
await mp.waitForTimeout(600);
await shot(mp, 'mob-home-s1');
await mp.evaluate(() => window.scrollTo(0, 2800));
await mp.waitForTimeout(600);
await shot(mp, 'mob-home-s2');
// 水平溢出检查
const hOverflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('mobile horizontal overflow px:', hOverflow);
// 抽屉菜单
const burger = await mp.evaluate(() => {
  const b = document.querySelector('button[class*="menu"], button[aria-label*="菜单" i], button[aria-label*="menu" i], header button');
  if (b) { b.click(); return b.getAttribute('aria-label') || b.className; }
  return null;
});
console.log('burger:', burger);
await mp.waitForTimeout(600);
await shot(mp, 'mob-drawer');
await collect('m-corners', mp, BASE + '/corners');
await shot(mp, 'mob-corners');
await collect('m-laptimes', mp, BASE + '/lap-times');
await shot(mp, 'mob-laptimes');
if (firstCorner) {
  await collect('m-corner-detail', mp, BASE + firstCorner);
  await shot(mp, 'mob-corner-detail');
}
await mob.close();
await browser.close();
server.close();

report.timings = { homeMs };
console.log('REPORT_JSON_START');
console.log(JSON.stringify(report, null, 1));
console.log('REPORT_JSON_END');
