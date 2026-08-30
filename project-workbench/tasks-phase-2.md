# 第二期任务拆解（预备）—— 样式与性能

> 来源：[prd-frontend-optimization.md](./prd-frontend-optimization.md) · 2026-08-30
> 状态：T5、T6 规格均已定稿（2026-08-30，拆分粒度与 og 方案经 Jinke 确认）。
> 执行前提：第一期 T1–T4 全部完成并通过审核（✅ 已满足），且 `git status` 干净。

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

## T6 首屏 LCP 优化

**背景**：首页为首屏性能的代表页面。当前未做过 LCP 优化：无关键资源 preload、图片缺尺寸属性可能有 CLS。

**步骤**：

1. **先实测再动手**（本任务的前置交付物）：
   ```bash
   npm run build && npm run preview
   npx lighthouse http://localhost:4173/ --preset=desktop --output=json --output-path=/tmp/lh-home.json
   ```
   从报告中提取：LCP 值与 LCP 元素、CLS 值与归因、阻塞渲染资源清单。把这三项写进 commit message 或 `project-workbench/t6-lighthouse-baseline.md`。
2. **根据实测结果，按以下优先级修法**（只修报告确认的问题，不确认的不动）：
   - LCP 元素是首页 hero 图 → 在 `index.html` 加 `<link rel="preload" as="image">` 指向该图（注意 Vite 构建后带 hash，用 `OptimizedImage` 的 glob 结果确认最终 URL，或在 index.html 用 `%VITE_%` 环境变量/构建插件注入；若实现复杂，改为在 HomePage 组件内用 `<link rel="preload">` 动态注入也可接受）；
   - 图片导致 CLS → 给 `<img>` 补 `width`/`height` 或 CSS `aspect-ratio`；
   - LCP 图加 `fetchpriority="high"`，非首屏图确认 `loading="lazy"` + `decoding="async"`（OptimizedImage 可能已有，核实即可）。
3. **红线**：视觉与布局不得变化；只动 `index.html`、`HomePage.jsx`、`OptimizedImage.jsx` 三个文件，其他页面性能问题留到第三期。

**验收**：改后再跑一次 Lighthouse（同命令），LCP ≤ 2.5s（桌面 preset）且 CLS 不劣化；基线与优化后两份报告都留存，连同 diff 交回审核。

---

## 提交格式

```
phase2-T5: split styles.css into base + components + per-page files
phase2-T6: LCP optimization — <基线 LCP → 优化后 LCP>
```

完成后把 `git log --stat`、拆分前后页面截图对比、Lighthouse 前后两份报告交回 Kimi 客户端审核。
