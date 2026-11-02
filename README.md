# 纽博格林北环中文科普网站

这是一个给中文读者看的纽博格林北环（Nürburgring Nordschleife）导览站：弯道故事、品牌与车、圈速档案。技术上是 Vite + React 的静态网站，没有后端。

第一次看这个仓库、想知道「这是什么、线上在哪、自己电脑怎么跑」，请读 [README.zh-CN.md](./README.zh-CN.md)。下面先放可以直接点开的地址。

## 线上入口

现在对外使用的站点：

**https://nordschleife-guide.netlify.app/**

打开首页就是主导览「认识纽北」。页顶导航可以直接进入另外三个主要页面：

- 认识纽北（首页导览）：https://nordschleife-guide.netlify.app/
- 弯道档案：https://nordschleife-guide.netlify.app/corners
- 品牌与车：https://nordschleife-guide.netlify.app/brands
- 圈速档案：https://nordschleife-guide.netlify.app/lap-times

2026-11-02 用命令核对过：上面四个地址，以及旋转木马页 `/experience/karussell`、分享图 `/og-image.jpg`，都返回 HTTP 200；首页引用的脚本、样式和封面图也能下载。`netlify.toml` 把任意子路径交回 `index.html`，所以这些地址可以刷新，也可以直接发给别人。

仓库里还留着 Vercel 配置（`vercel.json`）。以前记下的地址 `https://n-rburgring-nordschleife-flugplatz.vercel.app` 在同一天核对时，只有首页返回 200，`/corners`、`/brands`、`/lap-times` 是平台返回的 404。访客入口以本节的 Netlify 地址为准。

## 本地运行

需要先安装 [Node.js](https://nodejs.org/)（线上构建用的是 22，见 `netlify.toml`）和 npm。在项目根目录执行：

```bash
npm install
npm run dev
```

然后打开终端里打印的本地地址，一般是：

```text
http://localhost:5173/
```

`npm run dev` 启动的是 Vite，Windows、macOS、Linux 都可以用。

请从终端打印的 `http://localhost:...` 打开。直接双击根目录的 `index.html`，或用 `file://` 打开，样式和页面跳转会对不上：站点用的是浏览器路径（BrowserRouter）和以 `/` 开头的资源地址。

构建后再在本地看一遍：

```bash
npm run build
npm run preview
```

然后打开 `http://localhost:4173/`（端口被占用时，以终端打印的地址为准）。仓库里的 `netlify.toml` 和 `vercel.json` 都写了把子路径交回首页的规则；当前已经上线、子页面也能打开的，是上一节的 Netlify 地址。

## SEO 与分享卡片

`index.html` 内含 Open Graph / Twitter Card / canonical / favicon / theme-color 元信息。og 分享图为 `public/og-image.jpg`，修改文案后运行 `npm run og` 重新生成（依赖 Playwright，模板在 `scripts/og-image.html`）。注意：本站是 SPA，og 标签为全站统一的静态标签，无法按路由区分——社交分享任何子页面都会显示同一张卡片。

## 性能数据（2026-08-30 三期优化后）

- 构建耗时 ~1.5s（Vite 7，按路由代码分割 + 数据懒加载）
- 线上（Netlify）Lighthouse：Performance 99、SEO 100、CLS 0
- 本地全站审计明细见 `project-workbench/t8-audit-report.md`

## 主要文件

- `src/data/corner-records/`：弯角数据目录（每个弯角一个文件），由 `src/data/corner-records/index.js` 汇总；`src/data/corners.js` 在其上组合图片资源，补真实资料主要改这里。
- `src/data/brand-records/`：品牌数据目录，由 `src/data/brand-records/index.js` 汇总；`src/data/brands.js` 在其上组合默认资源位。
- `src/data/model-records/`：车型数据目录，由 `src/data/model-records/index.js` 汇总；`src/data/models.js` 对外导出。
- `src/data/lap-times.js`：圈速榜数据。
- `src/assets/nordschleife-map.svg`：真实 Nordschleife 矢量赛道图，来自 Wikimedia Commons，作者 Will Pittenger，Public Domain。
- `src/components/TrackMap.jsx`：地图展台和红色进度路径。前景路径与 dash 动画机制参考 `JJYing/Nurburgring-Map`，该项目为 MIT License。
- `src/App.jsx`：路由。首页、弯道、品牌、圈速和旋转木马都从这里进去。
- `src/pages/magazine/MagazineLayout.jsx`：全站顶栏。四个入口是「认识纽北」「弯道档案」「品牌与车」「圈速档案」。
- `src/pages/editorial/EditorialHome.jsx`：首页导览。
- `src/pages/magazine/CornerIndex.jsx`、`CornerStory.jsx`：弯道列表和详情。
- `src/pages/magazine/BrandsIndex.jsx`、`BrandStory.jsx`、`ModelStory.jsx`：品牌列表、品牌详情、车型详情。
- `src/pages/magazine/LapArchive.jsx`：圈速档案。
- `src/pages/editorial/EditorialKarussell.jsx`：旋转木马专题，地址是 `/experience/karussell`。
- `src/styles/base.css`、`src/styles/components.css`，以及 `src/pages/editorial/`、`src/pages/magazine/site.css`：视觉和响应式样式。页面样式跟在对应页面旁边。

## 开发约定

- 内容数据改动只动 `src/data/`（各记录目录与其 `index.js`），不要在组件里硬编码文案数据。
- 样式改动前先读 `src/styles/` 里的现有变量与类名，优先复用，不新增重复变量。
- 新页面需在 `src/App.jsx` 注册路由，并保持 `React.lazy` 懒加载方式不变。
- og 分享图改文案后运行 `npm run og` 重新生成 `public/og-image.jpg`。
- commit 前先跑 `npm run build`，确认构建通过再提交。
