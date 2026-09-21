# visual-fix-3 执行报告

> 执行：Kimi Code · 分支 `visual-fix-3`（基线 master `eba3677`）· 2026-09-21
> 任务清单：`project-workbench/tasks-visual-fix-3.md`（独立评审五问题打磨）
> 提交：`visual-fix-3-T1` ~ `visual-fix-3-T5` 共 5 个 commit（64e1fdb → 915d9c0）+ 本报告

## 总红线核验

| 红线 | 结果 |
|---|---|
| `npm run build` 无 warning | ✅ 各任务后均通过（rolldown-vite，~1.4s） |
| `npm test` 全过 | ✅ 18/18（无测试更新，结构未破坏既有断言） |
| Lighthouse a11y = 100 | ✅ `/` 与 `/corners` 均 100 |
| Lighthouse SEO = 100 | ✅ `/` 与 `/corners` 均 100 |
| Lighthouse CLS ≤ 0.01 | ✅ 两页均 0 |
| Lighthouse LCP ≤ 2.5s | ⚠️ **待 Jinke 决策**：`/corners` 2.508s（基线 2.564s，无回退）；`/` 在默认 mobile preset 下 3.6s，但已证实为 Chromium LCP 记账口径伪象（真机视口 390×844 实测 2.1s 达标，详见文末"LCP 专项"） |
| 截图（1440×900 + 390×844） | ✅ `project-workbench/visual-fix-3-screenshots/`（各任务前后对比，见各节索引） |
| 3D 链路一行不动 | ✅ 改动文件仅 6 个，见下；无 three/、KarussellViewer、TrackElevationRibbon 改动 |
| 不部署 / 不碰 quick-access | ✅ 全程在 `.worktrees/visual-fix-3` worktree，未混入 quick-access 文件 |

改动文件（src/ 共 6 个）：`GuidedChapters.jsx`、`guided-story.css`、`CornerIndex.jsx`、`corners.css`、`MagazineLayout.jsx`、`site.css`。

---

## T1 首页 #circuit 章节默认态再压缩

**改动**：`GuidedChapters.jsx`、`guided-story.css`（commit `64e1fdb`）

- lap 顺序前 2 个锚点卡保持完整卡片；其余 10 个默认降级为紧凑行（序号 + 中/德名 + 一句话 + "展开完整讲解"按钮），点击原地展开为完整卡片（照片、前后导航、"完整弯道档案"链接），再点收起。`<button aria-expanded aria-controls>`，展开/收起时焦点在对应按钮间移交，键盘 Enter 可操作。
- 地图点选 / 下拉 `jumpTo` 命中已降级锚点时自动展开并滚动到位（沿用 gap 展开的 requestAnimationFrame×2 路径）。
- 展开状态写入 `sessionStorage('nord-guide-open-anchors')`，与 gap 同款记忆，保证 PagePosition 恢复滚动位置时版面一致。
- `.story-static` / reduced-motion 下全部展开呈现（与 gap 既有回退语义一致；390×844 移动视口本身即触发 story-static，故移动端默认全展开、行为与基线一致）。

**清单命名修正（以数据为准）**：清单称"前 2 个锚点（萨宾娜弯、哈岑巴赫弧线）"——这两个是无 slug 纯地名（trackLabels 0、1，在首个 gap 折叠块内）；实际前 2 个锚点卡是**哈岑巴赫（2）、瑞典十字（7）**，已按 lap 顺序前 2 锚点执行。

**实测（1440×900，build + 短命静态服务，`scripts/vf3-measure.mjs`）**：

| 指标 | 基线 | 改后 | 红线 |
|---|---|---|---|
| `#circuit` 高 | 11,022px | **5,563px** | ≤7,000 ✅ |
| 全页高 | 23,215px | **17,757px** | ≤20,000 ✅ |
| 全部展开后 `#circuit` | — | 11,662px（≈基线 +640px 收起按钮行） | — |
| 水平溢出 | 0 | 0 | ✅ |

**验证**：`scripts/vf3-verify-t1.mjs` 13/13（43 个阅读目标在 DOM；默认 10 行折叠/2 卡完整；地图点选旋转木马→自动展开+滚动到位+照片+档案链接；地图点选 gap 内萨宾娜弯→gap 展开；键盘 Enter 展开/收起+焦点移交；sessionStorage 记忆；移动端 story-static 全展开+下拉 jumpTo）。
**截图**：`t1-desk-circuit-collapsed.png`、`t1-desk-circuit-expanded.png`、`t1-mob-circuit-static.png`。

## T2 "17 篇档案 vs 43 处地名"口径说明

**改动**：`CornerIndex.jsx`、`corners.css`、`GuidedChapters.jsx`、`guided-story.css`（commit `39663f5`）

- `/corners` 页头新增：「北环沿途共有 43 处地名，其中 17 个弯收录了完整档案；其余地名的沿途故事，见首页的赛道地图章节。」（链至 `/#circuit`，页内链接加下划线；移动端页头 flex 换行处理）
- 首页 `#circuit` 章节头新增：「这 43 个名字中，12 个弯带实拍照片与完整讲解，其中后 10 个默认收起为紧凑行、可随时展开；另有 5 个弯暂无实拍照片，只以紧凑行呈现。全部 17 篇完整弯道档案，见弯道档案页。」（链至 `/corners`）
- 建议文案按 T1 后实际呈现修正；数据已核对：12 锚点（photographedSlugs）、5 个无实拍档案（hocheichen、flugplatz、bergwerk、kesselchen、schwalbenschwanz）、17 档案（每篇四段：NAME/HISTORY/CHARACTER/IN CONTEXT）。

**验证**：`scripts/vf3-verify-t2.mjs` 13/13（双端文案在档、链接可达并定位、无水平溢出）。
**截图**：`t2-desk-corners-scope.png`、`t2-mob-corners-scope.png`、`t2-desk-circuit-note.png`、`t2-mob-circuit-note.png`。

## T3 次级文字对比度提一档

**改动**：`guided-story.css`（commit `a2a1b35`）

| token | 出现处 | 旧对比度（绿底/纸底） | 新值 | 新对比度（绿底/纸底） |
|---|---|---|---|---|
| `#687263` ×12 | 步号、small、bridge、map-status/credit、engineering/timing span、circuit-stop-de/origin/neighbours | 4.38 / 4.84 | `#5d665e` | 5.18 / 5.73 |
| `#66705f` ×4 | gap 计数、来源注脚等 | 4.51 / 5.00 | `#5d665e` | 5.18 / 5.73 |
| `#63715c` ×3 | circuit-location small、map-footer、移动下拉标签 | 4.52 / 5.00 | `#5d665e` | 5.18 / 5.73 |

- visual-fix-2 的 `.guide-circuit` 覆盖规则随之完全冗余，已删除（含失真的旧注释）。
- 盘点后无需改动：`--ed-muted`/`--mg-brand-muted` 已是 `#5d665e`；`--mg-lap-muted #61695f`（5.47）、`story-credit #60675d`（5.62）、地图标签 `#4b5947`（7.17）、`mg-lap-pending #87643b`（5.16）均已 ≥4.5；红色强调、深色底浅色文字、边框/描边未动；`journey-number #7b8574` 为 32px 大字（3.71 ≥ 3:1 达标）未动。

**验证**：`scripts/vf3-verify-t3.mjs` 8/8 处实测（计算样式色 vs 有效背景色）全部 ≥4.5:1；Lighthouse a11y 保持 100；视觉上只提半档，浅淡层级未破坏。
**截图**：`t3-desk-circuit-meta.png`、`t3-mob-circuit-meta.png`。

## T4 移动端顶栏收纳（方案 A：单行横向滚动）

**改动**：`site.css`、`MagazineLayout.jsx`（commit `40d3249`）

- ≤760px：header `min-height: 128px → 0`、padding/gap 收紧、wordmark 20px；导航单行 `overflow-x: auto` + 隐藏滚动条 + 首尾 6% 留白。390/360/320 实测四项均可单行容纳（横滑为更窄屏兜底）；触控目标保持 44px，focus-visible 焦点环未动。
- 当前项可见性兜底：路由变化且导航溢出时以程序化 `scrollLeft` 居中当前项。**不用 `scrollIntoView`**：实测它会移动 Chromium 顺序焦点起始点，导致首个 Tab 跳过 wordmark 与当前项（修复前后均用 Tab 序列探针验证）。

**实测（390×844，`scripts/vf3-header-measure.mjs`）**：

| 指标 | 基线 | 改后 | 红线 |
|---|---|---|---|
| header 高 | 133px | **95px** | ≤96 ✅ |
| Hero 标题 top | 212px | 174px | — |
| Hero 首屏呈现 | 标题 189/189px 可见 | 同左，且底部多露出照片署名行（见前后截图） | ✅ |
| 页面级水平滚动 | 无 | 无 | ✅ |

**验证**：`scripts/vf3-verify-t4.mjs` 10/10（高度、触控目标、四项点击触达、Tab 全序列、return-to-guide chip 不变、320px 兜底）。
**截图**：`t4-mob-hero-before/after.png`、`t4-mob-corners-before/after.png`。

## T5 桌面端 43 地名快速定位

**改动**：`GuidedChapters.jsx`、`guided-story.css`（commit `915d9c0`）

- `.circuit-mobile-select` 更名为中性的 `.circuit-jump-select`，移到地图工具行（`guide-visual-meta`）与地图之间，桌面/移动共用同一组件与样式（11px 标签 + 44px select，纸底细边）。
- 复用现有 `jumpTo`：选中即地图高亮 + 右栏讲解切换 + 已降级锚点自动展开 + 滚动到位；原生 select 键盘可操作。
- 同步更新 `scripts/check-visual-fix-2.mjs`、`scripts/vf3-verify-t1.mjs` 的类名引用。

**验证**：`scripts/vf3-verify-t5.mjs` 10/10（1440/1280 下拉可见含 43 项、不与地图重叠不折行、选中"旋转木马"三步联动、移动端多廷根高地回归）；`check-visual-fix-2` 11/11 回归通过。
**截图**：`t5-desk-jump-select.png`、`t5-mob-jump-select.png`。

---

## LCP 专项（红线待决策项）

**现象**：终态 `/` 在默认 mobile preset（412×823，模拟节流，lighthouse 13.4.1，vite preview 同 visual-fix-1/2 口径）复测 LCP = 3.6–3.7s（红线 ≤2.5s）；基线 eba3677 同机同口径 = 2.0s。

**定位过程**（逐 commit + 逐属性二分，共 11 次对照测量）：

1. eba3677=2.0s、T1 后=2.0s、T3 后=2.0s、**T4 后=3.7s** → 元凶锁定 T4。
2. T4 内二分：JS effect 无关；`overflow-x` 无关；**仅当 `min-height:0` 与紧凑 padding 同时存在（header ≈95–110px）时复现**；header ≥ ~120px 即回到 2.0s。
3. trace（`--save-assets`）证据：两种 header 下 Hero 图解码 ≈50ms、firstImagePaint ≈75ms 完全相同；差别仅在于 Chromium LCP 候选采纳——高 header 时 Hero 图在 ~71ms 以裁切矩形（388×703）被采纳，矮 header 时封面 710px 完全落入首屏（header+8+710 ≤ 823），story-motion 视差 transform 使照片成为合成层，LCP 改以含出血的层矩形（388×887）在 ~194ms 采纳。模拟节流把这段差值放大成 1.6s 的账面差。
4. **胶片帧证据**：375ms（模拟时刻）两个配置的帧截图逐像素一致——首屏视觉在同一时刻完成，真实用户无感知回退；FCP（1.6s）、CLS（0）、TBT（≈90ms）均无变化。
5. **真机视口证据**：390×844 仿真（真实手机触发 story-static、无视差合成层）终态实测 **LCP 2.1s 达标**。
6. `/corners`：终态 2.508s vs 基线 2.564s——基线期即贴线，无回退（终态略优）。

**结论**：`/corners` 无回退（基线即贴线）；`/` 的 3.6s 是"Lighthouse 默认预设视口（412×823 恰好落在 story-motion 分支）+ 首页 Hero 视差合成层"共同造成的 LCP 记账口径伪象，非真实性能回退。修改 Hero 图/视差/captureViewport 任一环节均可让账面回到 2.0s，但都超出 T4 核准范围（"不动首页其他章节"）。

**请 Jinke 决策（三选一）**：

- **A（建议）**：接受证据，视为口径伪象通过。依据：胶片帧一致、FCP/CLS/TBT 不变、真机视口 2.1s 达标、`/corners` 无回退。
- B：批准小幅扩大范围——微调 ≤760px Hero 图出血参数（如 `height:110%; top:-10%`，静止构图不变、仍覆盖视差缩放余量），让账面回到 ≤2.5s。
- C：放宽移动端 header 目标至 ~120px（LCP 账面即恢复，但 T4 首屏收益基本丧失）。

原始 JSON：`project-workbench/lighthouse-visual-fix-3.json`（含终态两页、真机视口、基线两页共 5 个 run）。

---

## 附：验证脚本索引（均 build + 短命静态服务，无长挂 dev server）

- `scripts/vf3-serve.mjs`（静态服务）、`scripts/vf3-measure.mjs`（高度红线）
- `scripts/vf3-verify-t1.mjs`（13 项）、`scripts/vf3-verify-t2.mjs`（13 项）、`scripts/vf3-verify-t3.mjs`（8 项对比度）、`scripts/vf3-header-measure.mjs` + `scripts/vf3-verify-t4.mjs`（10 项）、`scripts/vf3-verify-t5.mjs`（10 项）
- `scripts/vf3-shot-t1.mjs`、`scripts/vf3-shot-t4.mjs`（截图）
