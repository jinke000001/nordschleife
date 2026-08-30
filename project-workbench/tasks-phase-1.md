# 第一期任务拆解 —— 工程基础（Kimi Code 执行规格）

> 来源：[prd-frontend-optimization.md](./prd-frontend-optimization.md) · 2026-08-30
> 执行方：Kimi Code · 审核方：Kimi 客户端（Jinke 把关）
> 通用规则：每任务开始前确认 `git status` 干净；完成后单独 commit，message 前缀 `phase1-Tx:`；不改动 `src/data/` 下任何内容数据。

---

## T1 构建提速诊断与修复

**背景**：`npm run build` 实测 4m25s（M 系列 Mac，2026-08-30）。同体量 Vite 项目正常应在 30s 内。

**步骤**：
1. 先诊断，不要急着改：
   - 运行 `npm run build`，用 `vite build --debug` 或 `DEBUG=vite:*` 定位耗时阶段；
   - 怀疑对象按优先级：`src/scripts/vite-networkInterfaces-patch.js`（vite.config.js 里 import 的补丁）、`src/assets/` 下 100+ 张三格式图片是否全部被当作模块导入而非仅 public 引用、是否有巨型 SVG（`nordschleife-map.svg`）被内联进 JS、@vitejs/plugin-react 对 277 个源文件的编译。
2. 诊断结论写入 commit message 或简短报告（改动文件 + 原因）。
3. 针对结论修复。常见修法：图片改走 `public/` 或 `new URL()` 引用、SVG 改为 `<img>` 引用而非 inline import、移除不必要的补丁。
4. **红线**：修复后 `npm run build` 产物内容不得变化（页面功能、图片 URL、hash 可以变，展示效果不能变）。

**验收**：`npm run build` ≤ 60s；`npm run preview` 后手动浏览首页/弯角页/车型详情页无 404、无图片丢失。

---

## T2 SEO 全套元信息 + favicon + og 图

**背景**：`index.html` 当前只有 title + description，无任何社交分享卡片支持。

**改动范围**：

1. **`index.html`** `<head>` 内补充：
   - Open Graph：`og:type=website`、`og:title`、`og:description`、`og:image`（绝对 URL，指向 `/og-image.jpg`，放 `public/`）、`og:url`、`og:locale=zh_CN`；
   - Twitter Card：`twitter:card=summary_large_image`、title/description/image；
   - favicon：`public/favicon.svg`（用现有纽北红 `#e5232e` 做简洁"N"或赛道轮廓图标），`<link rel="icon" type="image/svg+xml">`；
   - `theme-color: #0b0d11`；
   - canonical 链接（部署域名以 Netlify 生产站为准，从 `netlify.toml` 或线上确认）。
2. **og 图**（已定方案 B，Jinke 2026-08-30 确认）：`public/og-image.jpg`，1200×630，定制卡片——深灰底（`#0b0d11`）+ 红色（`#e5232e`）赛道轮廓 SVG 放大做背景肌理 + 左下角白色标题"走进绿色地狱"与一行简介。**生成方式**：写一个一次性 HTML 页面 `scripts/og-image.html`（内联 `src/assets/nordschleife-map.svg` 轮廓），用项目已有的 `@playwright/test` 无头浏览器 1200×630 视口截图导出为 `public/og-image.jpg`。脚本保留在 `scripts/` 下并加 npm script（如 `"og": "node scripts/generate-og-image.mjs"`），以后改文案可重出图。
3. **动态标题已是现成的**（`useDocumentTitle` hook），但 og 标签是静态的——本期接受静态 og（SPA 限制），在 README 注明即可。

**验收**：构建后 `dist/index.html` 含全部标签；`curl -I https://<生产域名>/og-image.jpg` 返回 200；Lighthouse SEO 分类 100 分。

---

## T3 README 修正 + 开发约定

**改动范围**：
1. `README.md`：修正"主要文件"一节——`src/data/corners.js` 和 `src/data/brands.js` 已不存在，实际为 `src/data/corner-records/`、`src/data/brand-records/`、`src/data/model-records/` 目录 + 各自的 `index.js`；补充构建产物预览说明保持现状。
2. `README.md` 末尾新增"开发约定"小节（3–5 条即可）：数据改动只动 `src/data/`；样式改动前先读 `styles.css` 现有变量；新页面需在 `App.jsx` 注册路由并保持 lazy；commit 前跑 `npm run build`。

**验收**：README 中不再出现不存在的文件路径；`npm run build` 不受影响。

---

## T4 `prefers-reduced-motion` 动效降级

**背景**：站点大量使用动效（`useMagnetic`、`useParallax`、`useTilt3D`、`useScrollReveal`、页面过渡、顶部加载条、赛道图 dash 动画），但无降级处理，对前庭敏感用户不友好，也是作品集级的细节缺失。

**改动范围**：
1. **CSS 层**：`src/styles.css` 全局补充
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
     html { scroll-behavior: auto; }
   }
   ```
2. **JS 层**：新建 `src/hooks/usePrefersReducedMotion.js`（`matchMedia('(prefers-reduced-motion: reduce)')` + change 监听），让 `useMagnetic` / `useParallax` / `useTilt3D` / `useScrollReveal` 在降级时直接跳过 rAF 循环与 transform 计算，元素保持静态可见状态（**关键**：scroll-reveal 类元素降级后必须 `opacity: 1`，不能卡在透明态）。
3. **TrackMap dash 动画**：降级时路径直接以完整描边静态显示。

**验收**：macOS 系统设置 → 辅助功能 → 显示 → 打开"减少动态效果"，`npm run preview` 下全站无位移动画、无滚动渐入，且所有内容可见；关闭后动效恢复。

---

## 提交格式

```
phase1-T1: build speed fix — <诊断结论一句话>
phase1-T2: add SEO meta, favicon, og image
phase1-T3: fix README stale paths, add dev conventions
phase1-T4: prefers-reduced-motion support
```

完成后把 4 次 commit 的 `git log --stat` 输出 + 构建耗时截图/数字交回 Kimi 客户端审核。
