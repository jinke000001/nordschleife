# 第三期任务拆解 —— 体验回归（Kimi Code 执行规格）

> 来源：[prd-frontend-optimization.md](./prd-frontend-optimization.md) · 2026-08-30
> 执行方：Kimi Code · 审核方：Kimi 客户端（Jinke 把关）
> 执行前提：第一、二期已上线（✅ 2026-08-30 已部署 Netlify，线上性能 0.99 / SEO 100）。
> 通用规则：每任务开始前确认 `git status` 干净；完成后单独 commit，message 前缀 `phase3-Tx:`；不改动 `src/data/` 内容数据。

---

## T7 移动端细节回归

**背景**：8-16 曾修过移动端抽屉焦点问题，但此后经历了样式拆分（T5）等改动，需要一次系统性回归。2026-08-30 客户端预查（390×844 截图）：首页与圈速榜整体正常，无明显破版；以下按检查清单逐项确认，发现问题就修，没问题就在报告里勾掉。

**检查清单**（用 Playwright 移动视口 390×844 逐项过，每项留截图或说明）：

1. **全页面横向溢出**：遍历 8 类页面（首页/弯角列表/弯角详情/品牌列表/品牌详情/车型详情/圈速榜/404），执行 `document.documentElement.scrollWidth <= 390` 断言；圈速榜表格是最可疑对象，若溢出则给表格容器加横向滚动（`overflow-x: auto`），不要压缩字体到不可读。
2. **汉堡抽屉**：打开/关闭/焦点循环（Tab 不逃出抽屉）、Esc 关闭、点遮罩关闭、关闭后焦点回到触发按钮。
3. **触控目标尺寸**：导航项、筛选 pill、卡片链接的可点击区域 ≥ 44×44px（抽样 10 个交互元素）。
4. **触控动效**：`useMagnetic` / `useTilt3D` 在无 hover 的触屏设备上应自然退化为静态（检查是否有 `hover: hover` 媒体查询或 pointer 检测兜底，没有就补上）。
5. **TrackMap 触屏**：地图缩放/滑动在触屏可用，不与页面滚动冲突（`touch-action` 检查）。
6. **横屏**：844×390 下首页 hero 不截断主要按钮。

**验收**：以上 6 项全部有结论（通过 or 修复）；若产生修复，修复后重跑 `npm run build` + 桌面端 1440×900 首页截图确认无回归。输出 `project-workbench/t7-mobile-regression.md` 检查报告。

---

## T8 全站审计与收尾

**步骤**：

1. `npm run build && npm run preview`，对**全部 8 类页面**跑 Lighthouse（mobile preset）：
   ```bash
   npx lighthouse <url> --preset=perf --form-factor=mobile --output=json --output-path=...
   ```
   收四个分类分数：Performance / Accessibility / Best Practices / SEO。
2. 汇总成 `project-workbench/t8-audit-report.md`：每页四分数表格 + 所有扣分项清单。
3. **只修两类问题**（其余记录为遗留项，交 Jinke 决定排期）：
   - Accessibility 中改动 ≤5 行可修的（对比度、aria-label、alt、heading 顺序）；
   - 详情页 LCP > 2.5s 的（弯角/车型详情页的 hero 图若在首屏且无 `fetchpriority`，参照 T6 思路处理）。
4. **收尾**：更新 README 性能数据段落（构建 ~1.5s、线上性能 99、SEO 100、CLS 0）。

**验收**：审计报告完整；修复项复测分数提升；无新增视觉变化（抽 3 页截图对比）。

---

## 提交格式

```
phase3-T7: mobile regression — <通过项数/修复项数>
phase3-T8: site-wide audit + fixes — <四分类分数摘要>
```

完成后把 `git log --stat`、T7 检查报告、T8 审计报告交回 Kimi 客户端审核。三期通过后本项目"作品集化"阶段收官。
