// visual-fix-3 测量：短命静态服务 dist，测首页全页高、#circuit 章节高（桌面+移动）。
// 用法：node scripts/vf3-measure.mjs [extra]
//   extra=expand  额外测量：点开全部"展开完整讲解"后的高度（验证展开可达性）
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const DIST = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
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
  } catch { res.writeHead(404); res.end('nf'); }
});
await new Promise(r => server.listen(0, r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();

async function measure(width, height, expand = false) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  if (expand) {
    await page.evaluate(async () => {
      for (const button of document.querySelectorAll('[id^="anchor-open-"]')) {
        button.click();
        await new Promise(r => setTimeout(r, 30));
      }
    });
    await page.waitForTimeout(300);
  }
  // 触发懒加载图片稳定布局
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 400));
  });
  const report = await page.evaluate(() => {
    const section = document.getElementById('circuit');
    const toggles = [...document.querySelectorAll('.circuit-anchor-toggle')];
    return {
      docHeight: document.documentElement.scrollHeight,
      circuitHeight: section?.offsetHeight ?? null,
      anchorToggles: toggles.length,
      expandedToggles: toggles.filter(b => b.getAttribute('aria-expanded') === 'true').length,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  await page.close();
  return report;
}

const out = { base: BASE };
out.desktop = await measure(1440, 900);
out.mobile = await measure(390, 844);
if (process.argv[2] === 'expand') out.desktopExpanded = await measure(1440, 900, true);
console.log(JSON.stringify(out, null, 2));

await browser.close();
server.close();
