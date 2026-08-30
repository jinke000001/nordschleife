// 生成 public/og-image.jpg（1200×630）
// 用法：npm run og
// 原理：把 src/assets/nordschleife-map.svg 内联进 scripts/og-image.html，
//       用 Playwright 无头 Chromium 按 1200×630 视口截图导出 JPEG。
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [svg, template] = await Promise.all([
  readFile(path.join(root, 'src/assets/nordschleife-map.svg'), 'utf8'),
  readFile(path.join(root, 'scripts/og-image.html'), 'utf8')
]);

const html = template.replace('<!--TRACK_SVG-->', svg);
if (html === template) {
  throw new Error('og-image.html 中缺少 <!--TRACK_SVG--> 占位符');
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1
  });
  await page.setContent(html, { waitUntil: 'load' });
  const out = path.join(root, 'public/og-image.jpg');
  await page.screenshot({ path: out, type: 'jpeg', quality: 90 });
  console.log(`已生成 ${out}`);
} finally {
  await browser.close();
}
