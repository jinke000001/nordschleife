# Handoff Prompt

下面这段可以复制给 Codex、Claude Code 或其他协作工具。

```text
你正在接手一个中文 Nürburgring Nordschleife 科普/汽车文化网站。

项目路径：
/Users/jinke00001/Desktop/纽北赛道

请先阅读：
- project-workbench/README.md
- project-workbench/project-overview.md
- project-workbench/content-status.md
- project-workbench/workflow.md
- project-workbench/next-steps.md
- CONTENT_GUIDE.md

项目是 Vite + React 静态站，没有后端。使用 BrowserRouter，Netlify / Vercel 均已配置 SPA fallback。

核心风格：
- 中文汽车杂志感
- 赛道展览感
- 深色科技、黑红赛车
- 不要百科腔
- 不要改成浅色风格

重要约束：
- 不要大规模重构
- 不要随意删除已有内容
- 修改后运行 npm run build
- 新增车型详情时，要保证品牌 modelStories 里的 slug 能跳转到 model-records 里的记录
- 图片需要记录来源、作者和授权

当前建议任务：
为剩余品牌车型逐步替换真实授权 hero 图片。

优先处理：
1. Lexus LFA
2. Lamborghini Huracan Performante
3. Nissan GT-R R35
4. BMW M4 CSL
5. Audi R8 LMS GT3
6. Volkswagen ID.R

每次改动后请说明：
- 修改了哪些文件
- 是否运行 npm run build
- 哪些事实仍需要核验
```

