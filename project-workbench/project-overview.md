# Project Overview

## 项目定位

这是一个中文 Nürburgring Nordschleife 科普与汽车文化网站。目标用户包括：

- 第一次了解纽北的新手
- 汽车爱好者
- 赛车游戏玩家
- 模拟赛车玩家

内容方向不是百科词条，而是偏汽车杂志、赛道展览和纪录片式叙事。

## 核心目标

通过弯角名称、背后故事、驾驶特点、品牌文化和车型档案，让用户理解 Nordschleife 为什么被称为“绿色地狱”。

## 技术栈

- Vite
- React
- React Router BrowserRouter（Netlify / Vercel 均配置 SPA fallback）
- CSS 单文件全局样式：`src/styles.css`
- 静态数据驱动页面

当前项目没有后端。

## 页面结构

主要路由：

```text
/                           首页
/corners                    弯角列表
/corners/:slug              弯角详情
/brands                     品牌陈列馆
/brands/:slug               品牌详情
/brands/:brandSlug/:modelSlug  车型详情
```

由于使用 BrowserRouter，本地直接访问子路由时应使用：

```text
http://127.0.0.1:5173/brands/porsche/911-gt3-rs
```

开发服务器自带 fallback；线上由 Netlify / Vercel 的 rewrite 规则负责，子路由可以刷新和分享。

## 关键目录

```text
src/pages/                  页面组件
src/components/             通用组件
src/data/corner-records/    弯角数据
src/data/brand-records/     品牌数据
src/data/model-records/     车型详情数据
src/assets/                 图片与地图资源
docs/                       研究资料
project-workbench/          项目工作台与交接资料
```

## 设计方向

- 深色科技风
- 黑、灰、红为主
- 赛车纪录片 / 高性能汽车杂志 / 赛道博物馆结合
- 避免纯黑大面积背景，保留暗灰黑渐变与微弱红色光晕
- 桌面端强调展览感，移动端强调清晰、易读、可分享

