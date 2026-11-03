# 纽博格林北环中文指南

这份说明给第一次打开仓库的人。不需要先懂 React，按顺序看就行。

## 这是什么

这是一个中文网站，用来认识德国的纽博格林北环赛道（Nürburgring Nordschleife，常被叫做「绿色地狱」）。

打开之后可以做三件事：

1. 从首页顺着赛道往下读：地形、弯道、汽车和圈速是怎么连在一起的。
2. 从页顶进入弯道档案、品牌与车、圈速档案，直接看某一类内容。
3. 打开旋转木马（Karussell）这一个弯的专题页。

它是静态网站，数据写在项目里，没有账号，也没有服务器接口。页面是中文的。

## 怎么打开线上版

用浏览器打开：

**https://nordschleife-guide.netlify.app/**

建议从首页进去。页顶有四个入口：

| 页顶文字 | 打开后是什么 | 地址 |
| --- | --- | --- |
| 认识纽北 | 首页导览，从封面往下读 | https://nordschleife-guide.netlify.app/ |
| 弯道档案 | 弯道列表，点进某一个弯 | https://nordschleife-guide.netlify.app/corners |
| 品牌与车 | 品牌列表，再进车型 | https://nordschleife-guide.netlify.app/brands |
| 圈速档案 | 圈速记录 | https://nordschleife-guide.netlify.app/lap-times |

旋转木马专题不在页顶四个字里，地址是：

https://nordschleife-guide.netlify.app/experience/karussell

这些地址都可以直接复制给别人。刷新子页面也会留在那一页，不会被送回一个空白文件。

2026-11-02 核对过：上表四个地址、旋转木马页、分享图 `/og-image.jpg` 都返回 HTTP 200，首页要用到的脚本、样式和封面图也能下载。这次是用命令看状态码，没有在浏览器里逐个点击页面。

以前有人记过另一个地址：`https://n-rburgring-nordschleife-flugplatz.vercel.app`。同一天核对时，它的首页还能打开，但弯道、品牌、圈速这三个路径返回 404。请改用上一节的 Netlify 地址。

## 想在自己电脑上跑

只有在你要改网站时才需要这一节。只是阅读内容，用上面的线上地址即可。

1. 安装 Node.js。线上构建用的是 22，见仓库里的 `netlify.toml`。安装包：https://nodejs.org/
2. 把这个仓库下载到电脑上，用终端进入项目根目录（能看到 `package.json` 的那一层）。
3. 依次运行：

```bash
npm install
npm run dev
```

4. 终端会打印一个本地地址，一般是 http://localhost:5173/ 。用浏览器打开它。
5. 页顶同样有「认识纽北」「弯道档案」「品牌与车」「圈速档案」。

`npm run dev` 在 Windows、macOS、Linux 上都可以用。它启动的是本地开发服务器。改完代码，浏览器通常会自己刷新。

请从终端给出的 `http://localhost:...` 进去。直接双击 `index.html`，或把地址改成 `file://` 开头，样式和页面跳转会对不上。

想看和线上更接近的构建结果时，再运行：

```bash
npm run build
npm run preview
```

然后打开终端打印的地址，一般是 http://localhost:4173/ 。如果 4173 已经被占用，以终端里的端口为准。

提交代码前，项目约定先跑一次 `npm run build`，确认能构建成功。更细的文件放在哪、改内容时动哪些数据文件，写在 [README.md](./README.md) 的「主要文件」和「开发约定」里。
