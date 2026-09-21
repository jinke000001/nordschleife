// 客户端独立验收：visual-fix-3 关键红线复验
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const DIST = resolve(ROOT, '../dist');
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
const results = [];
const check = (name, ok, detail = '') => { results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

// 桌面 1440
const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dp = await dctx.newPage();
const errs = [];
dp.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
dp.on('response', r => { if (r.status() >= 400) errs.push(`${r.url()} ${r.status()}`); });
await dp.goto(BASE + '/', { waitUntil: 'networkidle' });
await dp.waitForTimeout(1200);
const circuitH = await dp.evaluate(() => document.querySelector('#circuit')?.offsetHeight ?? -1);
const pageH = await dp.evaluate(() => document.documentElement.scrollHeight);
check('T1 #circuit ≤7000px', circuitH <= 7000, `#circuit=${circuitH}px`);
check('T1 全页 ≤20000px', pageH <= 20000, `全页=${pageH}px`);
// T1 默认态：2 完整卡 + 10 紧凑行
const t1 = await dp.evaluate(() => {
  const full = document.querySelectorAll('#circuit .circuit-stop.is-full, #circuit [class*="circuit-stop"]:not([class*="compact"])').length;
  const expandBtns = [...document.querySelectorAll('#circuit button[aria-expanded]')].filter(b => /展开完整讲解/.test(b.textContent));
  return { expandBtns: expandBtns.length };
});
check('T1 默认 10 个可展开紧凑行', t1.expandBtns === 10, `展开按钮=${t1.expandBtns}`);
// T2 首页口径文案
const t2home = await dp.evaluate(() => document.querySelector('#circuit')?.innerText.includes('17 篇完整弯道档案') ?? false);
check('T2 首页口径文案在档', t2home);
// T5 桌面下拉 43 项
const t5 = await dp.evaluate(() => {
  const sel = document.querySelector('#circuit select');
  return sel ? { options: sel.options.length, visible: sel.offsetParent !== null } : null;
});
check('T5 桌面下拉可见且 43 项', !!t5 && t5.visible && t5.options === 43, t5 ? `options=${t5.options} visible=${t5.visible}` : 'select 不存在');
// T5 联动实测：选旋转木马
await dp.selectOption('#circuit select', { index: 24 });
await dp.waitForTimeout(900);
const t5b = await dp.evaluate(() => {
  const open = sessionStorage.getItem('nord-guide-open-anchors');
  const right = document.querySelector('#circuit .guide-panel, #circuit [class*="guide"]')?.innerText ?? '';
  return { open, hasKarussell: /旋转木马/.test(right) };
});
check('T5 选中旋转木马联动右栏', t5b.hasKarussell);
await dp.screenshot({ path: join(ROOT, 'accept-desk-circuit.png') });
check('桌面无控制台/资源错误', errs.length === 0, errs.slice(0, 3).join(' | '));
await dctx.close();

// 移动 390
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const mp = await mctx.newPage();
const merrs = [];
mp.on('console', m => { if (m.type() === 'error') merrs.push(m.text()); });
await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
await mp.waitForTimeout(1000);
const headerH = await mp.evaluate(() => document.querySelector('header')?.offsetHeight ?? -1);
check('T4 移动 header ≤96px', headerH <= 96, `header=${headerH}px`);
const hOverflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check('移动无页面级水平溢出', hOverflow <= 0, `overflow=${hOverflow}px`);
// T2 移动文案
const t2mob = await mp.evaluate(() => document.body.innerText.includes('北环沿途共有 43 处地名'));
check('T2 移动 corners 文案', t2mob, '(首页文案)');
await mp.goto(BASE + '/corners', { waitUntil: 'networkidle' });
await mp.waitForTimeout(800);
const t2corners = await mp.evaluate(() => document.body.innerText.includes('北环沿途共有 43 处地名'));
check('T2 /corners 页口径文案', t2corners);
await mp.screenshot({ path: join(ROOT, 'accept-mob-corners.png') });
check('移动无控制台错误', merrs.length === 0, merrs.slice(0, 3).join(' | '));
await mctx.close();

await browser.close();
server.close();
console.log(results.join('\n'));
