// T4 路由冒烟：8 条路由渲染 + 控制台错误收集
import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4173';
const routes = ['/', '/corners', '/corners/karussell', '/experience/karussell', '/brands', '/brands/porsche', '/lap-times', '/no-such-page-404'];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let fail = 0;
for (const route of routes) {
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const resp = await page.goto(BASE + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => ({
    h1orTitle: document.querySelector('h1, h2')?.textContent?.trim().slice(0, 30) || '(none)',
    mainLen: document.querySelector('main')?.textContent?.trim().length || 0,
  }));
  const ok = resp.ok() && info.mainLen > 50 && errors.length === 0;
  if (!ok) fail++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${route} -> ${resp.status()} 内容长度=${info.mainLen} 首标题="${info.h1orTitle}" 错误=${errors.length ? JSON.stringify(errors.slice(0, 2)) : 0}`);
}
await browser.close();
process.exit(fail ? 1 : 0);
