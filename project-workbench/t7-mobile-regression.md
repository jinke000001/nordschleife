# T7 移动端细节回归 —— 检查报告

> 执行：Kimi Code · 2026-08-30
> 环境：`vite preview`（生产构建）+ Playwright Chromium，移动视口 390×844（touch），横屏 844×390
> 证据截图：`project-workbench/t7-screenshots/`

## 结论摘要

| # | 检查项 | 结果 |
|---|--------|------|
| 1 | 全页面横向溢出（8 类页面） | ✅ 通过 |
| 2 | 汉堡抽屉交互 | 🛠 发现 3 个问题，已修复并复测通过 |
| 3 | 触控目标尺寸 ≥44px | 🛠 发现 5 处不达标，已修复并复测通过 |
| 4 | 触控动效退化（useMagnetic / useTilt3D） | ✅ 通过（原本就有兜底） |
| 5 | TrackMap 触屏 | ✅ 通过 |
| 6 | 横屏 844×390 hero | ✅ 通过 |

---

## 1. 全页面横向溢出

8 类页面（首页/弯角列表/弯角详情/品牌列表/品牌详情/车型详情/圈速榜/404）在 390×844 下
`document.documentElement.scrollWidth === 390`，全部无横向溢出，包括滚到底部触发懒加载后。

- 圈速榜表格在移动端有自适应布局，未溢出。
- 首页 `home-hero-map-visual` 与关闭态抽屉存在视觉出血元素，但被 `overflow: clip` 裁剪，不产生滚动条。

## 2. 汉堡抽屉

修复前发现 3 个问题（其中 1 个为真回归 bug）：

1. **🛠 抽屉/遮罩定位失效（严重）**：`.site-header` 带 `backdrop-filter: blur(18px)` + `transform: translateZ(0)`，
   成为 `position: fixed` 子元素的包含块，导致遮罩和抽屉被限制在 header 条（74px 高）内：
   遮罩只盖住顶栏，点页面其他区域无法关闭抽屉，抽屉内容溢出显示。
   **修复**：`Header.jsx` 中遮罩与抽屉改用 `createPortal` 挂到 `document.body`。
2. **🛠 Tab 焦点可逃出抽屉**：打开后 Tab 会移到背景内容。
   **修复**：keydown 中对 Tab/Shift+Tab 做焦点循环，限制在抽屉内。
3. **🛠 关闭后焦点未归还触发按钮**：Esc/遮罩关闭后焦点丢失到 body。
   **修复**：关闭时 `triggerRef.current?.focus()`。

复测结果（全部通过）：

- 点击 trigger 打开 ✅，焦点自动进入抽屉关闭按钮 ✅
- 连续 Tab 15 次，焦点始终在抽屉内循环 ✅
- Esc 关闭 ✅，焦点回到 trigger ✅
- 点遮罩关闭 ✅，焦点回到 trigger ✅
- 打开时背景滚动锁定（`body overflow hidden`）✅

证据：`02-drawer-open.png`（修复后：抽屉全高、遮罩正常压暗背景）。

## 3. 触控目标尺寸（抽样）

修复前不达标项（移动端 < 44×44px）：

| 元素 | 修复前 | 修复后 |
|------|--------|--------|
| `.mobile-nav-trigger` | 42×42 | 44×44 |
| `.map-language-toggle button` | 34×28 | ≥44×44（移动端媒体查询） |
| `.mobile-map-tabs button` | ×34 | ×44 |
| `.corner-card` 标题链接 / `进入详情` | ×26 / ×40 | ≥44（移动端媒体查询，不影响桌面） |
| 页脚导航链接 | ×19 | ≥44（移动端媒体查询） |
| 圈速榜 `.lt-cat-tab` / `.lt-toggle` / `.lt-search-clear` | ×32 / ×24 / ×18 | ≥44（640px 媒体查询） |

复测：首页/弯角列表/弯角详情/圈速榜 4 页抽样交互元素全部 ≥44×44 ✅

## 4. 触控动效退化

- `useMagnetic`：有 `matchMedia('(hover: hover) and (pointer: fine)')` 门槛，触屏不绑定监听 ✅
- `useTilt3D`：有 `(hover: none) and (pointer: coarse)` 提前返回 ✅
- 运行时验证：模拟触屏环境对卡片派发 pointermove，卡片 `transform` 保持 `none` ✅

## 5. TrackMap 触屏

- `.track-map` / `.map-stage` / SVG / 标签层 `touch-action: auto`，无滚动阻塞 ✅
- 真实触摸滑动（CDP touch 事件）页面正常滚动（scrollY 1776 → 2217）✅
- 移动端标签默认隐藏，改用 `mobile-map-tabs`：点击切换 callout（飞机场→瑞典十字）✅，「进入」按钮跳转详情 ✅
- 证据：`05-trackmap-mobile.png`

## 6. 横屏 844×390

首页 hero 主要按钮（「进入赛道地图」「查看弯角档案」）在首屏内完整可见 ✅
（factbar 的「圈速档案」卡片在 390px 高度下位于首屏下方，属次要入口，可滚动到达。）
证据：`06-landscape-home.png`

## 桌面回归

修复后重跑 `npm run build`（1.4s 通过），桌面 1440×900 首页截图无回归：桌面导航正常、无横向滚动、抽屉正确隐藏。
证据：`07-desktop-home-after.png`

## 改动文件

- `src/components/Header.jsx` — 抽屉/遮罩改 portal 到 body；新增 Tab 焦点循环与焦点归还
- `src/styles/components.css` — trigger 44px、mobile-map-tabs 44px、移动端触控目标媒体查询
- `src/styles/pages/lap-times.css` — 圈速榜筛选控件移动端 44px
