# T6 首屏性能基线 —— 2026-08-30

命令：`npx lighthouse http://localhost:4173/ --preset=desktop --output=json`（本地 `npm run preview`，构建于 T5 拆分后）

## 基线结果（/tmp 原始报告另存于 project-workbench/lighthouse-baseline.json）

| 指标 | 值 | 判定 |
|------|-----|------|
| LCP | **0.6s** | ✅ 已达标（≤2.5s），无需 preload |
| CLS | **0.22** | ❌ 超标（应 ≤0.1），唯一确认问题 |
| FCP | 0.4s | ✅ |
| TBT | 0ms | ✅ |
| 阻塞渲染资源 | 无 | ✅ |

## CLS 归因

- Lighthouse `layout-shifts` 唯一记录：`<footer class="site-footer">`，score 0.2202。
- 机制：SPA 首渲染时 main 几乎为空（约 540px），footer 初始落在视口内（top≈709 < 900）；React 挂载首页内容后 footer 被推到 5137——footer 在可见状态下位移，产生大额 CLS。
- 与图片无关：首页卡片图（CornerCard）已有 `loading="lazy"` 且容器 CSS 定高；SVG logo/赛道轮廓尺寸由 CSS 固定。

## 处置（只修确认问题）

- CLS：在 `index.html` 加启动期占位——仅首页路径给 `main` 临时 `min-height: 100vh`，使首屏绘制时 footer 落在视口外；由 `HomePage.jsx` 挂载后移除该类（最初试过 `window.load` 移除，但 load 早于 lazy chunk 渲染，移除本身造成二次位移，无效）。
- 复测结果：LCP 0.6→0.5s，CLS 0.22→0（报告见 project-workbench/lighthouse-optimized.json）。
- LCP preload：不做（LCP 0.6s 无问题确认）。
- `OptimizedImage` 不加 lazy：其调用点（弯角/车型详情页媒体图）都在首屏，加 lazy 反而伤 LCP；详情页性能属第三期范围。
