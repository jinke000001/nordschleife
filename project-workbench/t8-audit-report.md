# T8 全站审计与收尾 —— 报告

> 执行：Kimi Code · 2026-08-30
> 环境：`npm run build && npm run preview`（本地生产构建），Lighthouse mobile preset（form-factor=mobile），8 类页面各跑一遍。

## 四分类分数（修复前 → 修复后）

| 页面 | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|------|------------|---------------|----------------|-----|-----|-----|
| 首页 / | 97 → 97 | 100 → 100 | 100 → 100 | 100 → 100 | 2.28s → 2.34s | 0 → 0 |
| 弯角列表 /corners | **64 → 82** | 98 → 100 | 100 → 100 | 100 → 100 | **10.21s → 4.81s** | **0.21 → 0** |
| 弯角详情 /corners/bergwerk | 88 → 98 | 100 → 100 | 100 → 100 | 100 → 100 | 2.14s → 2.14s | **0.21 → 0** |
| 品牌列表 /brands | 88 → 98 | 100 → 100 | 100 → 100 | 100 → 100 | 2.14s → 2.14s | **0.21 → 0** |
| 品牌详情 /brands/porsche | 88 → 98 | 100 → 100 | 100 → 100 | 100 → 100 | 2.14s → 2.14s | **0.21 → 0** |
| 车型详情 /brands/porsche/911-gt3-rs | 89 → 98 | 100 → 100 | 100 → 100 | 100 → 100 | **3.16s → 2.14s** | **0.118 → 0** |
| 圈速榜 /lap-times | 89 → 99 | 98 → 100 | 100 → 100 | 100 → 100 | 1.84s → 1.84s | **0.21 → 0** |
| 404 | 99 → 99 | 98 → 100 | 100 → 100 | 100 → 100 | 1.84s → 1.84s | 0.041 → 0.003 |

注：本地 preview 数据（有 Slow 4G 模拟），与线上 Netlify（性能 99）口径不同，仅用于横向对比修复效果。

## 已修复项（全部复测提升）

1. **全站 CLS 0.21 → 0**（5 页）：`Suspense` 兜底 `.page-fallback` 只有 60vh，路由 chunk 加载完内容展开时 footer 在视口内位移 7000+px。
   修复：`min-height: 60vh → 100vh`（`src/styles/base.css`），位移发生在视口外，不计入 CLS。
2. **弯角列表 LCP 10.2s → 4.8s**：首屏第一张卡片图（Hatzenbach）是 `loading="lazy"`，慢网下发现太晚。
   修复：`CornerCard` 新增 `priority` prop，列表首张卡 `loading="eager" + fetchPriority="high"`。
3. **车型详情 LCP 3.16s → 2.14s**：随 CLS 修复（渲染时序）一并达标，hero 图此前已有 fetchpriority。
4. **heading-order**（弯角列表/圈速榜/404）：`CornerCard` 卡片标题 h3 → h2、页脚导航组标题 h3 → h2，CSS 选择器同步更新，样式不变。
5. **label-content-name-mismatch**（全站）：header/footer 品牌链接的 `aria-label="返回首页"` 与可见文本不符 → 移除 aria-label，让可见文本自身作为可访问名；品牌卡片链接 aria-label 调整为包含可见文本。
6. **unsized-images**（首页/品牌详情）：品牌 logo `<img>` 补 `width="24" height="24"`（SVG viewBox 均为 24×24）。

## 遗留项（未修，交 Jinke 决定排期）

| 问题 | 影响页 | 说明 |
|------|--------|------|
| 图片体积优化（image-delivery 最高可省 ~1.5MB） | 弯角列表/首页/弯角详情/车型详情 | 弯角照片为大尺寸 JPG，需用 `scripts/optimize-images.mjs` 或手动压缩/转 AVIF；属内容资产处理，工作量大 |
| 弯角列表 LCP 仍 4.8s（>2.5s） | 弯角列表 | 主因即上面的图片体积；进一步可做首屏图预加载或缩略图 |
| unused-javascript ~30KiB | 全站 | React/路由运行时的固有开销，拆分收益有限 |
| render-blocking ~150ms | 全站 | 主 CSS 阻塞渲染，可考虑关键 CSS 内联，收益小 |
| llms-txt 建议 | 全站 | Lighthouse 新审计项，可选 |
| agent-accessibility-tree 提示 | 首页 | 新审计项，分数未受影响（a11y 仍 100） |

## 视觉回归确认 3 页截图（修复后）

- `t7-screenshots/08-desktop-home-final.png`（桌面 1440×900 首页）
- `t7-screenshots/09-mobile-corners-final.png`（移动 390×844 弯角列表）
- `t7-screenshots/10-mobile-model-detail-final.png`（移动 390×844 车型详情）

h3→h2 与兜底高度改动均无视觉差异（选择器同步迁移；兜底只在加载瞬间出现）。

## 收尾

- README 新增「性能数据」段落（构建 ~1.5s、线上性能 99、SEO 100、CLS 0），并顺手修正 T5 后过时的 `src/styles.css` 路径引用。
- 改动文件：`src/components/{Header,Footer,CornerCard}.jsx`、`src/pages/{CornersPage,BrandsPage,HomePage,BrandDetailPage}.jsx`、`src/styles/{base,components}.css`、`README.md`。
