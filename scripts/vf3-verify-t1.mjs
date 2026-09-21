// visual-fix-3 T1 验证：三条可达路径 + 展开/收起交互。
// 1) 地图点选已降级锚点（旋转木马）→ 自动展开 + 滚动到位；点选 gap 内地名（萨宾娜弯）→ gap 展开 + 滚动到位
// 2) 紧凑行"展开完整讲解"→ 完整卡片（照片 + 档案链接 + 前后导航）原地展开，"收起"还原，键盘 Enter 可触发
// 3) 移动端下拉（390×844，story-static 全展开回退）选中地名 → 滚动到位
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const DIST = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
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
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(ok ? 'PASS' : 'FAIL', name, detail); };

// ---------- 桌面 1440×900 ----------
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);

// 全部 43 个阅读目标存在于 DOM
const ids43 = await page.evaluate(() => new Set([...document.querySelectorAll('#circuit [id^="track-stop-"]')].map(n => n.id)).size);
check('43 个阅读目标全部存在于 DOM', ids43 === 43, `实际 ${ids43}`);

// 默认态：10 个降级锚点行可见、详情隐藏；前 2 锚点完整卡直接可见
const defaults = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('.circuit-anchor-row')];
  const details = [...document.querySelectorAll('.circuit-anchor-detail')];
  const firstCards = ['track-stop-2', 'track-stop-7'].map(id => document.getElementById(id)?.getClientRects().length > 0);
  return { rows: rows.length, rowsVisible: rows.filter(n => n.getClientRects().length > 0).length,
    detailsHidden: details.filter(n => n.getClientRects().length === 0).length, firstCards };
});
check('默认态 10 个降级紧凑行全部可见', defaults.rows === 10 && defaults.rowsVisible === 10, JSON.stringify(defaults));
check('默认态 10 个详情区全部隐藏', defaults.detailsHidden === 10);
check('前 2 锚点（哈岑巴赫/瑞典十字）完整卡默认可见', defaults.firstCards.every(Boolean));

// 路径 1：地图点选已降级锚点（旋转木马，index 24）
await page.evaluate(() => document.getElementById('circuit').scrollIntoView());
await page.waitForTimeout(400);
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('.track-label-layer button, .track-label-layer [role="button"]')]
    .find(el => /旋转木马|Karussell/.test(el.textContent) && !/小旋转木马|Kleine/.test(el.textContent));
  btn?.scrollIntoView({ block: 'center' });
  btn?.click();
});
await page.waitForTimeout(600);
const mapPick = await page.evaluate(() => {
  const detail = document.getElementById('anchor-detail-24');
  const card = document.getElementById('track-stop-24');
  const toggle = document.getElementById('anchor-open-24');
  const rect = card?.getBoundingClientRect();
  return { detailVisible: detail?.getClientRects().length > 0, expanded: toggle?.getAttribute('aria-expanded') === 'true',
    cardTop: Math.round(rect?.top ?? -9999), hasPhoto: !!card?.querySelector('figure img'),
    hasArchiveLink: !!card?.querySelector('a[href="/corners/karussell"]'), scrollY: Math.round(scrollY) };
});
check('地图点选旋转木马 → 自动展开 + 滚动到位', mapPick.detailVisible && mapPick.expanded && mapPick.cardTop > -100 && mapPick.cardTop < 400 && mapPick.scrollY > 0, JSON.stringify(mapPick));
check('展开卡含照片与完整档案链接', mapPick.hasPhoto && mapPick.hasArchiveLink);

// 路径 1b：地图点选 gap 内地名（萨宾娜弯，index 0）
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('.track-label-layer button, .track-label-layer [role="button"]')]
    .find(el => /萨宾娜|Sabine/.test(el.textContent));
  btn?.click();
});
await page.waitForTimeout(600);
const gapPick = await page.evaluate(() => {
  const row = document.getElementById('track-stop-0');
  const rect = row?.getBoundingClientRect();
  return { visible: row?.getClientRects().length > 0, top: Math.round(rect?.top ?? -9999) };
});
check('地图点选萨宾娜弯 → gap 展开 + 滚动到位', gapPick.visible && gapPick.top > -100 && gapPick.top < 500, JSON.stringify(gapPick));

// 路径 2：紧凑行按钮展开/收起 + 键盘
await page.evaluate(() => { document.getElementById('anchor-open-29').scrollIntoView({ block: 'center' }); });
await page.waitForTimeout(300);
await page.evaluate(() => document.getElementById('anchor-open-29').focus());
await page.keyboard.press('Enter');
await page.waitForTimeout(400);
const expand29 = await page.evaluate(() => ({
  visible: document.getElementById('anchor-detail-29').getClientRects().length > 0,
  expanded: document.getElementById('anchor-open-29').getAttribute('aria-expanded') === 'true',
  focusInDetail: document.getElementById('anchor-detail-29').contains(document.activeElement)
}));
check('键盘 Enter 展开小水井（index 29）', expand29.visible && expand29.expanded, JSON.stringify(expand29));
check('展开后焦点进入详情区', expand29.focusInDetail);
await page.evaluate(() => document.getElementById('anchor-fold-29').click());
await page.waitForTimeout(400);
const fold29 = await page.evaluate(() => ({
  hidden: document.getElementById('anchor-detail-29').getClientRects().length === 0,
  expanded: document.getElementById('anchor-open-29').getAttribute('aria-expanded') === 'false',
  focusOnToggle: document.activeElement?.id === 'anchor-open-29'
}));
check('收起后详情隐藏、aria-expanded=false、焦点回到行按钮', fold29.hidden && fold29.expanded && fold29.focusOnToggle, JSON.stringify(fold29));

// sessionStorage 记忆：展开 24 后重新加载应保持展开
await page.evaluate(() => document.getElementById('anchor-open-32').scrollIntoView({ block: 'center' }));
await page.evaluate(() => document.getElementById('anchor-open-32').click());
await page.waitForTimeout(300);
await page.reload({ waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const remembered = await page.evaluate(() => document.getElementById('anchor-detail-32').getClientRects().length > 0);
check('展开状态经 sessionStorage 记忆（刷新后 32 仍展开）', remembered);
await page.close();

// ---------- 移动 390×844（story-static 回退：全部展开） ----------
const mp = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
await mp.waitForTimeout(400);
const staticAll = await mp.evaluate(() => ({
  isStatic: document.querySelector('.story-home')?.classList.contains('story-static'),
  rowsHidden: [...document.querySelectorAll('.circuit-anchor-row')].every(n => n.getClientRects().length === 0),
  detailsShown: [...document.querySelectorAll('.circuit-anchor-detail')].every(n => n.getClientRects().length > 0)
}));
check('移动端 story-static 回退：紧凑行隐藏、全部完整卡呈现', staticAll.isStatic && staticAll.rowsHidden && staticAll.detailsShown, JSON.stringify(staticAll));
// 路径 3：移动端下拉 jumpTo
await mp.evaluate(() => document.querySelector('.circuit-jump-select').scrollIntoView({ block: 'center' }));
await mp.waitForTimeout(300);
await mp.selectOption('.circuit-jump-select select', 'karussell');
await mp.waitForTimeout(600);
const mobJump = await mp.evaluate(() => {
  const card = document.getElementById('track-stop-24');
  return { top: Math.round(card?.getBoundingClientRect().top ?? -9999), visible: card?.getClientRects().length > 0 };
});
check('移动端下拉选旋转木马 → 滚动到位', mobJump.visible && mobJump.top > -100 && mobJump.top < 500, JSON.stringify(mobJump));
await mp.close();

await browser.close();
server.close();
const failed = results.filter(r => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} 通过`);
process.exit(failed.length ? 1 : 0);
