# 视觉升级修复与复测 —— 任务规格（visual-fix-1）

> 执行：Kimi Code · 审核：Kimi 客户端
> 背景：Codex 完成了 magazine/editorial 全站视觉重构（当前为未提交的工作区改动）。客户端已于 2026-09-14 完成设计走查（截图证据在 `output/design-review/`），本文件是修复任务清单。
> 执行方式：按 T1 → T5 顺序执行，每个任务一个 commit，message 前缀 `visual-fix-T1` … `visual-fix-T5`。全部完成后输出 `project-workbench/visual-fix-1-report.md`。

## 硬性约束（所有任务适用）

- **3D 旋转木马链路整体保留，一行都不许动**：`src/three/**`、`src/components/KarussellViewer.jsx`、`src/components/KarussellDiagram.jsx`、`src/pages/KarussellExperiencePage.jsx`、`src/styles/pages/karussell-experience.css`、`src/data/karussell-exhibit.js`、`tests/karussell-geometry.test.js`，以及 package.json 里的 `three` 依赖。Jinke 明确保留备用。
- 不改设计语言（配色、字体、排版体系、文案、数据），只修缺陷。
- 每个任务完成后跑 `npm run build` 与 `npm test`，15 个测试必须全过才能进下一个任务。
- 提交前确认 prefers-reduced-motion 降级行为不受影响。

## T1 首页空白带修复

- 现象：首页 `/` 在 1440×900 下，"敞篷赛车的年代"图注（约 y=3600）到下一章节之间存在约 3000px（两个多视口高）的纯空白。证据：`output/design-review/crop-gap.png`。
- 要求：定位成因（章节间距、占位元素或 spacer），修复后全页不存在超过 1 个视口高度的连续无内容区域；章节间正常的呼吸感留白保留。
- 验证：1440×900 full-page 截图，修复前后对比写入报告。

## T2 圈速档案页浮动按钮遮挡修复

- 现象：`/lap-times` 在 1440×900 下，右下角"← 返回导览"浮动 chip 遮住"包含原型车"复选框文字。证据：`output/design-review/crop-laptimes-br.png`。
- 要求：浮动按钮与页面上任何交互控件不得重叠（1440×900 与 390×844 两种视口都要查）；顺带检查 `/corners`、`/brands` 等页面的同类"返回导览"浮动 chip 是否有相同问题，一并修复。
- 验证：两种视口截图证明无遮挡。

## T3 移动端 hero 行距修复

- 现象：首页 390×844 下，意大利体副题 "The Green Hell." 与中文主标题"地狱。"几乎相碰。证据：`output/design-review/crop-mobile-hero.png`。
- 要求：拉丁副题与中文主标题之间出现明确间距；桌面端（1440×900）视觉不得有任何变化。
- 验证：390×844 与 1440×900 首页首屏截图对比。

## T4 死代码清理（保留 3D 链路）

- 背景：`src/pages/` 下旧页面体系（HomePage、CornersPage、CornerDetailPage、BrandsPage、BrandDetailPage、ModelDetailPage、LapTimesPage、NotFoundPage）已不再被 `src/App.jsx` 引用；App 现在只路由 `pages/magazine` 与 `pages/editorial`。本次 diff 中这些旧文件仍被修改过，属于需要清理的历史包袱。
- 要求：
  1. **先建引用图再动手**：逐个 grep 确认候选文件的被引用情况。只有"既不被路由页面引用、也不被保留的 3D 链路引用"的文件才能删除。
  2. **必须保留**：KarussellExperiencePage 及其完整依赖链（见硬性约束清单）；TrackMap、TrackElevationRibbon 等凡被 magazine/editorial 任一页面引用的组件。
  3. 候选删除：上述 8 个旧页面；`src/styles/pages/` 下仅被旧页面引用的 css（如 home.css、corner-detail.css 等，以引用图为准）；仅被旧页面引用的组件（如 CornerCard、InfoBlock、ResourceShelf、TopLoadingBar、ReadingProgress 等，以引用图为准）。
  4. 删除后 `npm run build` 无 warning、`npm test` 全过、各路由渲染正常。
- 验证：报告中列出"实际删除清单 + 保留清单（含理由）"；dist 产物对照删除前无缺失 chunk。

## T5 Lighthouse 复测 + 视觉回归截图

- 环境：`npm run build && npm run preview`（本地生产构建），Lighthouse mobile preset（form-factor=mobile，与 T8 审计同口径）。
- 路由（8 个）：`/`、`/corners`、`/corners/karussell`、`/experience/karussell`、`/brands`、`/brands/porsche`、`/lap-times`、一个不存在路径（404）。
- 红线（不达标先修再报）：Accessibility = 100、SEO = 100、CLS ≤ 0.01、首页 LCP ≤ 2.5s（本地 Slow 4G 口径）。
- 产出：
  - 原始 JSON 存 `project-workbench/lighthouse-visual-fix-1.json`；
  - 四分类分数 + LCP/CLS 表格写入 `project-workbench/visual-fix-1-report.md`；
  - 截图（1440×900 与 390×844）：首页、圈速档案、弯道档案，存 `project-workbench/visual-fix-1-screenshots/`。

## 明确不做

- 不删除、不改动 3D 旋转木马链路任何文件与 `three` 依赖。
- 不改首页"每一个名字，都是赛道的一部分"43 地名长列表的结构（客户端另有节奏优化方案，待 Jinke 拍板后单独排期）。
- 不动文案与数据（含 919 Hybrid Evo 5:19.55 / 5:19.546 展示精度差异，属已知遗留项）。
- 不部署 Netlify（审核通过后由 Jinke 决定）。
