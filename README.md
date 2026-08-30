# 纽博格林北环中文科普网站

这是一个 Vite + React 项目，介绍 Nürburgring Nordschleife 的弯角故事、驾驶特点和品牌文化预留内容。

## 推荐打开方式

开发预览：

```bash
npm install
npm run dev
```

然后打开：

```text
http://localhost:5173/
```

## 构建后本地预览

不要直接打开项目根目录或根目录下的 `index.html`，也不要直接用 `file://` 打开构建产物。项目使用 BrowserRouter 和绝对资源路径，请构建后启动本地预览：

```bash
npm run build
npm run preview
```

然后打开 `http://localhost:4173/`（实际端口以终端输出为准）。线上部署时，Netlify 与 Vercel 都配置了 SPA fallback，因此子路由可以直接访问和刷新。

## SEO 与分享卡片

`index.html` 内含 Open Graph / Twitter Card / canonical / favicon / theme-color 元信息。og 分享图为 `public/og-image.jpg`，修改文案后运行 `npm run og` 重新生成（依赖 Playwright，模板在 `scripts/og-image.html`）。注意：本站是 SPA，og 标签为全站统一的静态标签，无法按路由区分——社交分享任何子页面都会显示同一张卡片。

## 主要文件

- `src/data/corner-records/`：弯角数据目录（每个弯角一个文件），由 `src/data/corner-records/index.js` 汇总；`src/data/corners.js` 在其上组合图片资源，补真实资料主要改这里。
- `src/data/brand-records/`：品牌数据目录，由 `src/data/brand-records/index.js` 汇总；`src/data/brands.js` 在其上组合默认资源位。
- `src/data/model-records/`：车型数据目录，由 `src/data/model-records/index.js` 汇总；`src/data/models.js` 对外导出。
- `src/data/lap-times.js`：圈速榜数据。
- `src/assets/nordschleife-map.svg`：真实 Nordschleife 矢量赛道图，来自 Wikimedia Commons，作者 Will Pittenger，Public Domain。
- `src/components/TrackMap.jsx`：地图展台和红色进度路径。前景路径与 dash 动画机制参考 `JJYing/Nurburgring-Map`，该项目为 MIT License。
- `src/pages/HomePage.jsx`：首页。
- `src/pages/CornersPage.jsx`：弯角列表和搜索。
- `src/pages/CornerDetailPage.jsx`：弯角详情页。
- `src/pages/BrandsPage.jsx`、`src/pages/BrandDetailPage.jsx`：品牌列表与详情。
- `src/pages/LapTimesPage.jsx`：圈速榜。
- `src/styles.css`：整体视觉和响应式样式。

## 开发约定

- 内容数据改动只动 `src/data/`（各记录目录与其 `index.js`），不要在组件里硬编码文案数据。
- 样式改动前先读 `src/styles.css` 里的现有变量与类名，优先复用，不新增重复变量。
- 新页面需在 `src/App.jsx` 注册路由，并保持 `React.lazy` 懒加载方式不变。
- og 分享图改文案后运行 `npm run og` 重新生成 `public/og-image.jpg`。
- commit 前先跑 `npm run build`，确认构建通过再提交。
