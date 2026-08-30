# 第二期任务拆解（预备）—— 样式与性能

> 来源：[prd-frontend-optimization.md](./prd-frontend-optimization.md) · 2026-08-30
> 状态：T5 规格已定（拆分粒度经 Jinke 确认），T6 待第一期完成后实测再定细节。
> 执行前提：第一期 T1–T4 全部完成并通过审核，且 `git status` 干净。

---

## T5 `styles.css` 拆分：共享核心 + 按页面拆（混合粒度）

**背景**：`src/styles.css` 单文件 5512 行，承载全站令牌、组件、页面样式。拆分粒度已定：三层混合（Jinke 2026-08-30 确认）。

**目标结构**：

```
src/styles/
  base.css        —— :root 设计令牌、reset、body 背景、全局工具类、reduced-motion 规则
  components.css  —— Header、Footer、按钮、CornerCard、InfoBlock、SectionHeader、
                     ReadingProgress、TopLoadingBar、ResourceShelf 等跨页组件样式
  pages/
    home.css
    corners.css
    corner-detail.css
    brands.css
    brand-detail.css
    model-detail.css
    lap-times.css
    not-found.css
```

**拆分规则**：

1. **移动不改写**：逐段剪切粘贴，禁止顺手"优化"选择器或改值——本次只做物理拆分，保证渲染结果逐像素不变。
2. **归属判断**：样式只被单一页面使用 → 进对应 `pages/*.css`；被 ≥2 个页面或全局组件使用 → `components.css`；令牌/reset/背景/工具类 → `base.css`。判不准的放 `components.css`，不要复制两份。
3. **加载方式**：
   - `base.css` + `components.css` 在 `src/main.jsx` 全局 import；
   - `pages/*.css` 在对应页面组件里 `import '../styles/pages/xxx.css'`，让 Vite 把页面 CSS 打进页面 chunk 随路由懒加载；
   - 删除原 `src/styles.css`，全局搜索确认无残留 import。
4. **不引入 CSS Modules / 预处理器**（本期约束不变）。

**验收**：
- `npm run build` 通过，且 dist 中出现按页面分割的 CSS chunk；
- `npm run preview` 下逐页面对比截图（拆分前后各一套，Playwright 截首页/弯角列表/弯角详情/品牌详情/车型详情/圈速榜/404），肉眼无差异；
- `grep -r "styles.css" src/` 无结果。

---

## T6 首屏 LCP 优化（规格待补）

第一期完成后先跑一次 Lighthouse 实测，拿到 LCP 元素和阻塞清单后再写本任务规格。预计涉及：首屏关键图 preload、`<img>` 宽高属性防 CLS、字体加载策略。

---

## 提交格式

```
phase2-T5: split styles.css into base + components + per-page files
```
