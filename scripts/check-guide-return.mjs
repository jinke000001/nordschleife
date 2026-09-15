// Run against a running production preview: BASE=http://localhost:4173 node scripts/check-guide-return.mjs
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const base = process.env.BASE || 'http://localhost:4173';
const browser = await chromium.launch();
const cases = [
  { name: 'expanded interval survives return-to-guide', expand: true },
  { name: 'expanded interval survives browser Back', expand: true, back: true },
  { name: 'expanded interval survives a detail-page reload', expand: true, reload: true },
  { name: 'resizing restores the visible story, not a hidden stop', resize: { width: 1200, height: 800 } },
  { name: 'expanded story survives return to a mobile viewport', expand: true, resize: { width: 390, height: 844 } },
  { name: 'return still works when session storage is unavailable', expand: true, blockStorage: true },
];
let failed = 0;
try {
  for (const scenario of cases) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    try {
      if (scenario.blockStorage) {
        await context.addInitScript(() => {
          Object.defineProperty(window, 'sessionStorage', { get() { throw new DOMException('Storage disabled', 'SecurityError'); } });
        });
      }
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // PagePosition's initial restoration has settled.
      const summary = page.locator('.circuit-gap-summary').filter({ hasText: '屠宰场 → 旋转木马' });
      assert.equal(await summary.getAttribute('aria-expanded'), 'false', 'new session starts collapsed');
      if (scenario.expand) await summary.click();
      const link = page.locator('#circuit a[href="/corners/karussell"]');
      await link.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const story = link.locator('..');
      const before = await story.evaluate(node => {
        const rect = node.getBoundingClientRect();
        return { id: node.id, top: rect.top, progress: -rect.top / rect.height };
      });
      await link.click();
      await page.waitForURL('**/corners/karussell');
      await page.waitForTimeout(1000);
      if (scenario.reload) {
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
      }
      if (!scenario.blockStorage) {
        const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem('nord-guide-position')));
        // Check this independently from absolute scroll restoration.
        if (scenario.resize && !scenario.expand) assert.equal(saved.section, before.id, 'remember the visible story');
      }
      if (scenario.resize) await page.setViewportSize(scenario.resize);
      if (scenario.back) await page.goBack();
      else await page.getByRole('link', { name: '← 返回导览' }).click();
      await page.waitForURL(url => url.pathname === '/');
      await page.waitForTimeout(1100);
      const after = await story.evaluate(node => {
        const rect = node.getBoundingClientRect();
        return { top: rect.top, progress: -rect.top / rect.height };
      });
      if (scenario.expand) assert.equal(await summary.getAttribute('aria-expanded'), 'true', 'restore the expanded interval');
      if (scenario.resize) assert.ok(Math.abs(after.progress - before.progress) < .02, `reading progress drifted: ${JSON.stringify({ before, after })}`);
      else assert.ok(Math.abs(after.top - before.top) < 4, `story moved: ${JSON.stringify({ before, after })}`);
      assert.deepEqual(errors, [], 'no browser errors');
      console.log(`PASS ${scenario.name}`);
    } catch (error) {
      failed++;
      console.error(`FAIL ${scenario.name}: ${error.message}`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`${cases.length - failed}/${cases.length} guide-return scenarios passed`);
process.exitCode = failed ? 1 : 0;
