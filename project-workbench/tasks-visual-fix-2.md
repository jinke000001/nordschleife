# 首页"每一个名字"章节节奏优化 —— 任务规格（visual-fix-2）

> 执行：Kimi Code · 审核：Kimi 客户端
> 前置：visual-fix-1 已验收通过；方案文档 `project-workbench/prd-home-circuit-rhythm.md`（含实测数据）。
> Jinke 已于 2026-09-15 拍板三项决策：**① 区间摘要默认折叠；② 按 12 个故事弯锚点分组（不按地理赛段）；③ 纯地名逐条来源外链合并为一条章节脚注**。

## 范围

只改首页 `/` 的 `#circuit` 章节（`src/pages/editorial/GuidedChapters.jsx` 的 `CircuitReading` + `guided-story.css` 相关规则 + `useReadingSteps`/`reading-position` 如需）。其他章节、其他页面一律不动。3D 旋转木马链路（见 visual-fix-1 硬性约束清单）继续一行不动。

## 设计规格（方案 B：分段折叠 + 密度分级）

### 1. 分组逻辑（数据驱动，不新增赛段元数据）

- "故事锚点" = `trackLabels` 中有 `slug` 且 `getCornerBySlug(slug)` 有档案的地名（现 12 个）。
- 分组：从每个锚点开始，连同其后直到下一个锚点之前的连续纯地名，为一个分组。
- 分组必须由现有数据推导，不要硬编码分组名单。

### 2. 呈现

- **锚点条目**：保持现有完整卡片版式不变（含照片、"完整弯道档案"链接、前后导航）。
- **纯地名条目**：改为紧凑行（目标高度 130–160px/条）：序号 + 中文名 + 德文名 + 一行说明（取 `trackNameNotes`），去掉逐条的"前一处/下一处"导航与"名称参考"外链。
- **区间摘要块**：连续 ≥2 条纯地名折叠为一个摘要按钮，文案形如 `Hatzenbach → Flugplatz · 之间还有 3 处地名 ∧`；默认折叠。单条孤立的纯地名（两侧都是锚点）可直接以紧凑行呈现，不必包摘要块。
- **章节脚注**：章节末尾（剖面带之前或之后，按版面合适处）加一条来源脚注："地名来源 / Nurburgring Map（JJYing · MIT）"，链接 `https://github.com/JJYing/Nurburgring-Map`。

### 3. 交互与联动（不丢失现有能力）

- 摘要块是 `<button aria-expanded>`，键盘可操作；展开后区间内紧凑行参与滚动联动（`data-reading-step`）。
- 折叠状态下摘要块作为**一个**阅读步骤，地图高亮区间内第一个地名。
- 在地图上点选折叠区间内的地名：所在区间自动展开并滚动到对应紧凑行（现有 `jumpTo` 路径的延伸）。
- 移动端（≤999px）单列下折叠行为一致；现有的"选择赛道地名"下拉必须始终包含全部 43 个地名（不受折叠影响）。
- `prefers-reduced-motion`：无展开/折叠动画；`.story-static` 静态回退模式下全部内容展开呈现。
- TrackElevationRibbon 与章节末尾链接（"浏览全部弯道档案"等）保持不变。

### 4. 验收标准（量化）

- 1440×900 实测：`#circuit` ≤ 11,500px；全页 `document.documentElement.scrollHeight` ≤ 24,000px（基线 33,615px）。用 `scripts/measure-gaps.mjs` 或等效方法复核。
- 43 处地名全部可达：滚动（展开后）+ 地图点选 + 移动端下拉三条路径都通。
- `npm run build` 无 warning；`npm test` 全过（`full-track-guide.test.js`、`reading-position.test.js` 等若因结构变化需更新，同步修改并说明）。
- Lighthouse（mobile preset，与 visual-fix-1 同口径）至少复测 `/`：a11y = 100、SEO = 100、CLS ≤ 0.01、LCP ≤ 2.5s；原始 JSON 存 `project-workbench/lighthouse-visual-fix-2.json`。
- 截图（1440×900 + 390×844）：章节折叠态、区间展开态各一，存 `project-workbench/visual-fix-2-screenshots/`。

### 5. 执行方式

- 一个 commit：`visual-fix-2: 首页整圈地名章节分段折叠与密度分级`（若 Lighthouse 红线触发修复，追加独立 commit）。
- 完成后输出 `project-workbench/visual-fix-2-report.md`：实测高度前后对比、分组清单（哪个锚点带哪几个地名）、测试更新说明、Lighthouse 结果。

### 6. 明确不做

- 不动首页其他章节与其余页面；不动文案与数据；不动 3D 链路；不部署 Netlify。
- 不新增赛段分组元数据；不改变 43 地名的内容与顺序。
