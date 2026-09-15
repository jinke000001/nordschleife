# visual-fix-2 交付报告 —— 首页"每一个名字"章节分段折叠与密度分级

> 执行：Kimi Code · 2026-09-15
> 任务规格：`project-workbench/tasks-visual-fix-2.md`；方案：`prd-home-circuit-rhythm.md`（方案 B）

## 实测高度对比（1440×900，`scripts/measure-circuit-height.mjs`，dev 与生产构建结果一致）

| 指标 | 基线（实测） | 本次（实测） | 红线 | 结果 |
|------|------------|------------|------|------|
| 全页 `scrollHeight` | 33,663px | **23,215px** | ≤ 24,000px | ✅（-31%） |
| `#circuit` 章节高 | 21,470px | **11,022px** | ≤ 11,500px | ✅（-49%） |
| 阅读步骤数 | 43（全条目） | 20（12 锚点 + 7 摘要 + 1 紧凑行），展开后可达 43 | 43 处全可达 | ✅ |

## 分组清单（数据驱动推导，非硬编码）

锚点判定：`label.slug` 有档案 **且** 在已验证实拍照片集内（`circuit-groups.js` 的 `photographedSlugs`，即原 `GuidedChapters` 中用于决定是否展示照片的同一集合）。连续 ≥2 条非锚点地名折叠为区间摘要；单条孤立地名直接紧凑行。

| 区间摘要（默认折叠） | 含地名 |
|---|---|
| 起点 → 哈岑巴赫（2 处） | 萨宾娜弯、哈岑巴赫弧线 |
| 哈岑巴赫 → 瑞典十字（4 处） | 大橡树、奎德巴赫高地、飞机场、科滕博恩 |
| （单条紧凑行） | 阿伦山 |
| 屠宰场 → 旋转木马（12 处） | 卡伦哈特、镜像双子、三连右、防御谷、布赖德沙伊德、旧磨坊、劳达左弯、矿山、小谷地、勇气弯、修道谷、陡坡段 |
| 高八 → 小水井（3 处） | 海德薇高地、弹跳人、埃施巴赫 |
| 小水井 → 植物园 I（2 处） | 网红弯、冰弯 |
| 植物园 I → 小旋转木马（3 处） | 植物园 II、贝洛夫 S、燕尾 |
| 德廷根高地 → 回到起点（4 处） | 安东尼榉木、动物园、高雨组合弯、T13 |

锚点卡片（12 张，版式不变）：哈岑巴赫、瑞典十字、狐狸洞、阿德瑙森林、屠宰场、旋转木马、高八、小水井、植物园 I、小旋转木马、断头台、德廷根高地。

### ⚠️ 规格中的一处事实出入（按拍板口径执行，提请知悉）

任务规格 §1 写"有 `slug` 且 `getCornerBySlug(slug)` 有档案的地名（现 12 个）"。实测 `getCornerBySlug` 命中 **17** 个（另有 5 个有档案但首页故意不展示照片：大橡树、飞机场、矿山、小谷地、燕尾）。若按字面规则以 17 锚点分组，估算章节约 13,400px，**达不到 ≤11,500px 红线**；而 Jinke 拍板的是"12 个故事弯锚点"。故锚点集取 12 个有实拍照片的档案弯。上述 5 个无照片档案弯以紧凑行呈现，说明文字沿用 `record.explanation`（`trackNameNotes` 不含这 17 个地名），其"完整弯道档案"链接在首页不再逐条展示，仍可通过章节末尾"浏览全部弯道档案"与 `/corners` 到达。若希望这 5 个也恢复为完整卡片，需要接受章节高度超出红线约 1,900px。

## 交互验证（`scripts/check-visual-fix-2.mjs`，Playwright 实测 11/11 通过）

- 默认折叠：43 个地名锚点全部在 DOM；区间内紧凑行不可见；7 个摘要块 `aria-expanded` 全为 false。
- 摘要块为 `<button aria-expanded aria-controls>`，点击与键盘 Enter 均可切换；展开后紧凑行参与滚动联动（`data-reading-step`）。
- 折叠态下摘要块作为一个阅读步骤，地图高亮区间内第一个地名（步骤携带 `data-label-index`，见下）。
- 地图点选折叠区间内地名（卡伦哈特）：所在区间自动展开并滚动到对应紧凑行（scrollY 12,108、目标 top 30px）。
- 移动端（390×844）："选择赛道地名"下拉含全部 43 项；选中折叠区间内地名可展开并滚动到位。
- `prefers-reduced-motion` / `.story-static`：摘要块隐藏、30 行紧凑行全部展开呈现（可见步骤 = 43）；折叠无任何高度动画（仅 Chevron 旋转，reduced-motion 下禁用）。
- 已知既有行为：390×844 竖屏触发 `useChapterMotion` 的 `captureViewport` 判定（844 > 390×2），移动端本来就处于 `.story-static` 全展开模式，因此折叠交互实际只在桌面生效；三条到达路径（滚动/地图点选/下拉）在移动端均已验证通过。

## 代码改动

- 新增 `src/pages/editorial/circuit-groups.js`：锚点判定 + 分组推导（纯函数，可测试）；`photographedSlugs` 从 `GuidedChapters.jsx` 移入此处作为唯一来源。
- `src/pages/editorial/GuidedChapters.jsx`：`CircuitReading` 按分组渲染——锚点卡片版式不变；纯地名改紧凑行（序号 + 中文名 + 德文名 + 一行说明，去掉逐条前后导航与"名称参考"外链）；区间摘要块默认折叠；章节末尾（剖面带之后、结束链接之前）新增来源脚注"地名来源 / Nurburgring Map（JJYing · MIT）"；`jumpTo` 扩展为自动展开目标所在区间。
- `src/pages/editorial/useReadingSteps.js`：测量时过滤无布局盒的隐藏节点（折叠行不计入步骤）；步骤节点携带 `data-label-index` 时直接返回地名索引，折叠/展开状态下地图高亮都正确。`ChapterNavigation` 的 `[data-guide-chapter]` 节点不带该属性，行为不变。
- `src/pages/editorial/guided-story.css`：新增 `.circuit-stop-brief`（紧凑行，桌面实测 ~179px 单条/区间行 ~130–160px）、`.circuit-gap-summary`（72px）、`.story-static` 全展开回退、reduced-motion 规则；移除不再使用的 `.circuit-note-source`。
- 3D 旋转木马链路、其他章节、其他页面、文案与数据文件：一行未动。

## 测试更新说明

- 新增 `tests/circuit-groups.test.js`（3 项）：43 地名不重不漏且顺序不变；锚点恰为 12 个带 slug 的照片档案弯；区间折叠规则（≥2 才折叠、边界锚点正确）。
- 现有测试无需修改：`full-track-guide.test.js`（数据层，未动）、`reading-position.test.js`（`readingStep`/`restoreTop` 签名不变）等全部通过。`npm test` 18/18 ✅，`npm run build` 无 warning ✅。

## Lighthouse（mobile 口径，`npm run preview` 生产构建，与 visual-fix-1 同口径）

原始 JSON：`project-workbench/lighthouse-visual-fix-2.json`

| 指标 | 结果 | 红线 |
|------|------|------|
| Accessibility | **100** | = 100 ✅ |
| SEO | **100** | = 100 ✅ |
| CLS | **0** | ≤ 0.01 ✅ |
| LCP | **1.9s** | ≤ 2.5s ✅ |
| Performance / Best-practices | 99 / 100 | — |

未触发红线，无追加修复 commit。

## 截图

`project-workbench/visual-fix-2-screenshots/`：`circuit-collapsed-1440x900.png`（折叠态：锚点卡片 + 摘要块）、`circuit-expanded-1440x900.png`（区间展开态：紧凑行）、`circuit-collapsed-390x844.png` / `circuit-expanded-390x844.png`（移动端为 story-static 全展开模式，分别取章节地图区与紧凑行区）。

## 复跑方式

```bash
npm run dev                                        # 或 npm run preview（生产构建）
node scripts/measure-circuit-height.mjs / 1440 900 # 高度验收
node scripts/check-visual-fix-2.mjs                # 交互验收（11 项）
npm test && npm run build
```
