// visual-fix-2 交互验证：折叠默认态、点击展开、地图点选折叠区间、reduced-motion 全展开。
import { chromium } from '@playwright/test';

const BASE = process.env.BASE || 'http://localhost:5173';
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok, detail }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); };

{
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  // 1. 默认折叠：43 个地名 id 都在 DOM，但区间内行不可见
  const counts = await page.evaluate(() => ({
    ids: [...Array(43)].filter((_, i) => document.getElementById(`track-stop-${i}`)).length,
    visibleRows: [...document.querySelectorAll('.circuit-gap-items .circuit-stop-brief')].filter(n => n.getClientRects().length).length,
    summaries: document.querySelectorAll('.circuit-gap-summary').length,
    expandedAttr: [...document.querySelectorAll('.circuit-gap-summary')].map(b => b.getAttribute('aria-expanded'))
  }));
  check('默认折叠：43 个地名锚点全部在 DOM', counts.ids === 43, `ids=${counts.ids}`);
  check('默认折叠：区间内紧凑行不可见', counts.visibleRows === 0, `visible=${counts.visibleRows}`);
  check('摘要块 7 个且 aria-expanded 全为 false', counts.summaries === 7 && counts.expandedAttr.every(v => v === 'false'), JSON.stringify(counts.expandedAttr));

  // 2. 点击第一个摘要块展开，紧凑行可见且成为阅读步骤
  await page.locator('.circuit-gap-summary').first().click();
  await page.waitForTimeout(300);
  const afterOpen = await page.evaluate(() => ({
    ariaExpanded: document.querySelector('.circuit-gap-summary').getAttribute('aria-expanded'),
    visibleRows: [...document.querySelectorAll('.circuit-gap-items .circuit-stop-brief')].filter(n => n.getClientRects().length).length,
    visibleSteps: [...document.querySelectorAll('#circuit [data-reading-step]')].filter(n => n.getClientRects().length).length
  }));
  check('点击展开：aria-expanded=true 且 2 行可见', afterOpen.ariaExpanded === 'true' && afterOpen.visibleRows === 2, JSON.stringify(afterOpen));

  // 3. 地图点选折叠区间内地名（Kallenhard，idx 12）：所在区间自动展开并滚动
  await page.locator('.circuit-gap-summary').first().click(); // 重新折上第一个
  await page.waitForTimeout(200);
  const before = await page.evaluate(() => [...document.querySelectorAll('.circuit-gap-summary')].map(b => b.getAttribute('aria-expanded')));
  // TrackMap 的标签是 button；直接派发点选（找到文本为 Kallenhard 的地图标签点击）
  const mapLabel = page.locator('#circuit .track-label', { hasText: '卡伦哈特' }).first();
  await mapLabel.click();
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => {
    const target = document.getElementById('track-stop-12');
    const rect = target?.getBoundingClientRect();
    return {
      expanded: [...document.querySelectorAll('.circuit-gap-summary')].map(b => b.getAttribute('aria-expanded')),
      targetVisible: target ? target.getClientRects().length > 0 : false,
      targetTop: rect ? Math.round(rect.top) : null,
      scrollY: Math.round(scrollY)
    };
  });
  const kallenGapOpened = after.expanded[2] === 'true'; // 第三个摘要块 = Metzgesfeld → Karussell 区间
  check('地图点选 Kallenhard：所在区间自动展开', kallenGapOpened && after.targetVisible, `expanded=${JSON.stringify(after.expanded)} top=${after.targetTop} scrollY=${after.scrollY}`);
  check('地图点选 Kallenhard：页面滚动到该紧凑行附近', after.scrollY > 0 && after.targetTop !== null && after.targetTop < 200, `top=${after.targetTop}`);

  // 4. 键盘操作：摘要块可被 Tab 聚焦并用 Enter 切换
  await page.evaluate(() => window.scrollTo(0, 0));
  const summary = page.locator('.circuit-gap-summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  const kb = await page.evaluate(() => document.querySelector('.circuit-gap-summary').getAttribute('aria-expanded'));
  check('键盘 Enter 可切换摘要块', kb === 'true', `aria-expanded=${kb}`);
  await browser.close();
}

{
  // 5. reduced-motion：全部内容展开、无摘要块干扰
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const rm = await page.evaluate(() => ({
    isStatic: !!document.querySelector('.story-static'),
    visibleRows: [...document.querySelectorAll('.circuit-gap-items .circuit-stop-brief')].filter(n => n.getClientRects().length).length,
    visibleSummaries: [...document.querySelectorAll('.circuit-gap-summary')].filter(n => n.getClientRects().length).length,
    visibleSteps: [...document.querySelectorAll('#circuit [data-reading-step]')].filter(n => n.getClientRects().length).length
  }));
  check('reduced-motion：story-static 生效且 30 行紧凑行全部可见', rm.isStatic && rm.visibleRows === 30, JSON.stringify(rm));
  check('reduced-motion：摘要块隐藏，可见步骤=43', rm.visibleSummaries === 0 && rm.visibleSteps === 43, `steps=${rm.visibleSteps}`);
  await browser.close();
}

{
  // 6. 移动端 390×844：下拉包含全部 43 个地名，选折叠区间内地名可展开跳转
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const mobile = await page.evaluate(() => ({
    options: document.querySelectorAll('.circuit-mobile-select option').length
  }));
  check('移动端下拉含全部 43 个地名', mobile.options === 43, `options=${mobile.options}`);
  await page.locator('.circuit-mobile-select select').selectOption({ index: 12 });
  await page.waitForTimeout(600);
  const mJump = await page.evaluate(() => {
    const target = document.getElementById('track-stop-12');
    return { visible: target ? target.getClientRects().length > 0 : false, top: target ? Math.round(target.getBoundingClientRect().top) : null, scrollY: Math.round(scrollY) };
  });
  check('移动端下拉选中折叠区间地名：区间展开并滚动到位', mJump.visible && mJump.scrollY > 0 && mJump.top !== null && mJump.top < 200, JSON.stringify(mJump));
  await browser.close();
}

const failed = results.filter(r => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} 项通过`);
process.exit(failed ? 1 : 0);
