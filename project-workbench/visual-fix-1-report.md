# visual-fix-1 执行报告

> 执行：Kimi Code（2026-09-14/15）· 任务规格：`project-workbench/tasks-visual-fix-1.md`
> 基线：Codex magazine/editorial 重构后的未提交工作区；设计走查证据 `output/design-review/`
> Commits：`visual-fix-T1` 8d83e6b → `T2` 8eabffc → `T3` a876044 → `T4` d5acedc → `T5`（见本节末尾）

## 总览

| 任务 | 状态 | 验证结果 |
|------|------|---------|
| T1 首页空白带 | ✅ 修复 | 全页截图无 ≥1 视口空白带（修复前 3731px） |
| T2 浮动按钮遮挡 | ✅ 修复 | 7 路由 × 2 视口逐屏扫描无遮挡 |
| T3 移动端 hero 行距 | ✅ 修复 | 间距 12px → 26px（仅 ≤760px，桌面实测不变） |
| T4 死代码清理 | ✅ 完成 | 删 29 文件；build 无 warning；15 tests 全过；8 路由冒烟全过；dist 无缺失 chunk |
| T5 Lighthouse 复测 | ✅ 红线全过 | 8 路由 a11y/SEO 全 100、CLS 全 0、首页 LCP 2.0s |

---

## T1 首页空白带修复

**成因**（实测定位，非推测）：
- 空白带 = `.journey-scene` 横向滚动章节的**滚动距离区**。桌面端该章节用 sticky 视口 + 横向位移（交互正常，逐滚动位置截图确认用户全程可见内容），其 `height = 100svh + travel(≈3571px) + 160` 中 travel 部分在任何静态渲染（Playwright full-page 截图捕获的是 1440×900 布局态原文档，sticky 只渲染首屏一条，下方 3731px 为纯背景色 #e9ece3）中必为空白。
- 连锁隐患：超高视口下（部分截图工具会拉伸视口到全文高）`svh` 全面爆炸（guide-step 70/85svh、journey-viewport 100svh），且 `scene.height = viewportHeight + travel` 会形成正反馈（实测文档高 33615 → 66602）。

**修法**（交互零改动）：
1. `HomeChapters.jsx` 新增 `.journey-static-trail`：把本章 8 张照片序列（复用 journey-photos 数据，`aria-hidden`、无链接、alt 空）渲染进滚动距离区。该区域交互时被钉住视口（等高、不透明纸色背景、z-index 1）**逐帧精确遮盖**——钉住期间覆盖全屏，解钉后视口恰好落在区域尾段之上，任何视口高度下用户都不可见（滚动过程逐位置截图验证无透出）；静态渲染（全页截图/打印）时呈现为正常的纵向照片流。
2. `useChapterMotion.js`：识别超高视口（`innerHeight > innerWidth × 2`，覆盖会拉伸视口的抓取工具），回退静态呈现并切断高度正反馈；正常桌面/移动/竖屏显示器不受影响。
3. `editorial.css` / `site.css`：`.ed-site`、`.mg-site main`、`.mg-loading` 的 svh/vh 最小高度加绝对上限（min()），消除静态抓取时的空白尾。

**验证**：1440×900 full-page 截图修复前后对比
- 前：`output/visual-fix-1/t1-gap-before.png` —— y 3750→7481 连续空白 3731px（均匀色带扫描确认）；
- 后：`output/visual-fix-1/t1-gap-after2.png` —— 无 ≥900px 色带（扫描脚本 `scripts/scan-blank-bands.mjs`）；trail 区域裁剪 `output/visual-fix-1/t1-trail-crop.png`。
- 回归：交互滚动 6 个位置视口截图正常；prefers-reduced-motion 降级不变（story-static 生效、trail 隐藏、无内联高度）；390×844 全页扫描无空白带。

## T2 浮动按钮遮挡修复

**成因**：`.return-to-guide` 为 `position: fixed` 右下角，滚动中会遮住途经的交互控件（圈速档案页"包含原型赛车"复选框 label 等）。任何固定角落在任何滚动位置都无法静态保证不遮挡。

**修法**（`MagazineLayout.jsx` + `site.css`）：避让检测 —— chip 矩形与 `main` 内任何交互元素（a/button/input/select/textarea/summary/label/[role=button]）相交时自动隐藏（opacity+visibility，同时退出 Tab 序与可访问树），不相交即恢复；挂 scroll/resize/ResizeObserver，rAF 节流，随路由切换重挂。过渡动画受全局 reduced-motion 兜底。

**验证**：脚本 `scripts/check-chip-overlap.mjs` 对 7 条非首页路由 × 1440×900 / 390×844 逐屏（半屏步进）扫描：**修复前**圈速档案 1440×900 首屏即遮挡（复选框 label 与 chip 相交），**修复后**全部位置无可见遮挡；证据截图 `output/visual-fix-1/t2-chip-avoids-1440.png`（遮挡点 chip 隐藏、复选框完整可读）、`t2-chip-visible-*.png`（常规位置 chip 正常显示）。

## T3 移动端 hero 行距修复

**修法**：`editorial.css` ≤760px 媒体查询内 `.ed-cover-english` 增加 `margin-top: 26px`（原基线 12px 为桌面值）。该选择器仅首页 hero 使用（EditorialKarussell 无此元素）。

**验证**：实测 h1 底 → 副题顶间距 390×844 下 26px（修复前几乎相碰），1440×900 下保持 12px 不变。截图：`project-workbench/visual-fix-1-screenshots/home-mobile-top.png`（后）对比 `output/design-review/crop-mobile-hero.png`（前）。

## T4 死代码清理（保留 3D 链路）

**方法**：先建双向引用图（每个候选文件的正向 import 清单 + 全项目反向 grep），只删"既不被路由页面引用、也不被 3D 保留链路引用"的文件。

**实际删除（29 个文件）**：
- 页面 8：`HomePage` `CornersPage` `CornerDetailPage` `BrandsPage` `BrandDetailPage` `ModelDetailPage` `LapTimesPage` `NotFoundPage`（App.jsx 已不再路由）；
- 组件 8：`CornerCard` `InfoBlock` `SectionHeader`（仅旧页面引用）、`ResourceShelf` `TopLoadingBar` `ReadingProgress` `Header` `Footer`（全项目零引用）；
- hooks 5：`useScrollReveal` `useTilt3D` `useParallax` `useCounterAnimation`（仅旧页面）、`useMagnetic`（仅 Header）；
- 页面样式 8：`styles/pages/{home,corners,corner-detail,brands,brand-detail,model-detail,lap-times,not-found}.css`（与旧页面一一对应）。

**保留清单（含理由）**：
- `KarussellExperiencePage.jsx` + `KarussellViewer` `KarussellDiagram` + `src/three/**` + `karussell-exhibit.js` + `karussell-experience.css` + `tests/karussell-geometry.test.js` + package.json `three` 依赖：硬性约束，保留备用，一行未动；
- `TrackMap` `TrackElevationRibbon`（GuidedChapters 引用）、`OptimizedImage`（magazine 三页引用）：在用；
- `useDocumentTitle` `usePrefersReducedMotion`、`src/data/**` 全部：均有在用引用；
- 素材文件（含仅旧页面用到的 `assets/nordschleife-map.svg` 等）：不在任务范围内，保留。

**验证**：`npm run build` 无 warning；`npm test` 15/15 通过；8 条路由冒烟（HTTP 200 / 有内容 / 零控制台错误，脚本 `scripts/smoke-routes.mjs`）；dist 与删除前逐文件对照 —— 所有真实 chunk（js/css/图片）完全一致，仅清掉 205 个 macOS Finder 重复产物（`xxx 2.webp`/`xxx 3.js` 这类历史遗留垃圾文件）。

**遗留标注**：`base.css` 中 `.app-shell`、`.page-fallback` 两个类定义随之成为死样式，但 base.css 是全局基础文件、本任务范围不含类级裁剪，暂留待后续统一处理。

## T5 Lighthouse 复测 + 视觉回归

环境：`npm run build && npm run preview`（本地生产构建），Lighthouse 13.4.1，`--form-factor=mobile`（Slow 4G 模拟，与 T8 同口径）。

**首轮未达红线，按"先修再报"修复了 4 个问题**（均 commits 于 visual-fix-T5）：

1. **a11y 96 → 100（首页）**：`.ed-wordmark` 的 aria-label 与可见文本不匹配（label-content-name-mismatch）→ 移除 aria-label，可见文本本身即完整名称；整圈地名章节 `#687263` 在 #eef0e9 底上对比度 4.38:1 → 该区块内 4 类文字改为 `#66705f`（4.52:1，同色系的极轻微加深，guided-story.css 内注明）。
2. **a11y 96 → 100（圈速档案）**：`.mg-lap-rank` `#7b8178` 对比度 3.85:1 → `#6f756c`（4.56:1）。
3. **CLS 0.13/0.21 → 0（全站）**：两处根因 —— ① 短内容页面（404 等）内容换入时 footer 被推入视口；② 内容首元素 margin-top 折叠穿透 `main`，使 main 盒位置在 fallback→正文间移动。修复：`.mg-loading` 与 `.mg-site main` 最小高度统一为 `min(100svh, 940px)`（短页面 footer 始终停在折叠线下且换入前后位置一致），`main` 加 `display: flow-root` 阻断 margin 穿透（零视觉变化）。
4. **首页 LCP 6.4s → 2.0s（Slow 4G）**：封面图原是 JS 渲染后才被发现的大图（1920w/255KB）。组合拳 —— ① 封面图改走 `public/` 稳定 URL + 800/1200/1920w srcset（移动端实载 46KB）；② `index.html` 增加"启动封面"（boot cover）：首屏 HTML 即绘制头图（复刻 `.ed-header`/`.ed-cover.story-cover` 几何，含同款暗角），`EditorialHome` 挂载且 boot 图实际绘制后才撤下（decode + 绘制帧 + 150ms 下限，2s 兜底超时），交接几何逐像素一致、共享同一图片 URL 无二次请求、真实浏览器实测 CLS=0；③ 首页改回非懒加载路由（少一次 chunk 往返）；④ 首屏之下全部 lazy 图片加 `fetchPriority="low"`，消除与 LCP 图的带宽争抢（此为双模摆动的根因：600KB 级懒加载大图与封面抢带宽，导致 LCP 在 2.0/3.5 间摆动，修复后 6/6 次稳定在 2.0–2.1s）。

**最终成绩（8 路由，mobile preset）**：

| 路由 | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|------|----|----|----|----|-----|-----|
| `/` | 99 | 100 | 100 | 100 | 2.0s | 0 |
| `/corners` | 96 | 100 | 100 | 100 | 2.5s | 0 |
| `/corners/karussell` | 93 | 100 | 100 | 100 | 3.0s | 0 |
| `/experience/karussell` | 94 | 100 | 100 | 100 | 2.9s | 0 |
| `/brands` | 82 | 100 | 100 | 100 | 4.7s | 0 |
| `/brands/porsche` | 88 | 100 | 100 | 100 | 3.6s | 0 |
| `/lap-times` | 97 | 100 | 100 | 100 | 2.3s | 0 |
| 404 路径 | 98 | 100 | 100 | 100 | 2.1s | 0 |

**红线核验**：Accessibility = 100 ✅（8/8）；SEO = 100 ✅（8/8）；CLS ≤ 0.01 ✅（8/8 全 0）；首页 LCP ≤ 2.5s ✅（2.0s，6 连跑稳定 2.0–2.1s）。

**产出**：
- 原始 JSON：`project-workbench/lighthouse-visual-fix-1.json`（8 路由完整原始报告合集，4.5MB）；
- 截图：`project-workbench/visual-fix-1-screenshots/`（首页/圈速档案/弯道档案 × 1440×900 / 390×844，各首屏 + 全页，共 12 张）；
- 验证脚本：`scripts/measure-gaps.mjs` `scan-blank-bands.mjs` `check-chip-overlap.mjs` `smoke-routes.mjs` 等（可复跑）。

**稳定性备注**：
- 详情/品牌类页面 LCP 3–4.7s（无红线约束，未动）：其 hero 图同样是 JS 发现 + 大图；如需提升可套用首页的 public+srcset+启动封面模式，建议另立任务。
- `/brands` perf 82 主要来自 LCP 4.7s（品牌墙多图）。同上。
- Lighthouse 模拟值存在环境噪声（同构建 ±0.3s 摆动曾观测到）；首页已做 6 连跑确认稳定。

## 未做（按任务约束）

- 3D 旋转木马链路一行未动；`three` 依赖保留。
- 首页 43 地名长列表结构未动（等 Jinke 拍板客户端的节奏优化方案）。
- 文案与数据未动（919 Hybrid Evo 5:19.55 / 5:19.546 精度差异仍为已知遗留）。
- 未部署 Netlify。

## 给审核人的维护提示

- `index.html` 的启动封面几何复刻自 `editorial.css` / `home-story.css` 的 `.ed-header` / `.ed-cover.story-cover` 规则（含 1050/760/600/360 断点）。**改动头图区尺寸/边距时必须同步此处**，否则启动帧与正式帧会出现几像素交接跳动（文件内已注明）。
- 封面图更换时：`public/brunnchen-cover-{800,1200,1920}.webp` 三个文件需同名替换（稳定 URL 是启动封面与 React 封面共享缓存的关键）。
