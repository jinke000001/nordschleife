# T1 构建提速诊断报告 —— 2026-08-30

## 结论

**4m25s 不可复现，当前构建耗时 1.3–2s，无需修改代码。**

## 测量记录

| 运行 | 条件 | 耗时 |
|------|------|------|
| 1 | 保留旧 dist | 1.95s（Vite 自报 1.27s） |
| 2 | 删除 dist 冷构建 | 1.86s |
| 3 | 再次冷构建 | 1.29s |

环境：M 系列 Mac、Node v24.14.0、Vite 7.3.2。

## 四个怀疑对象逐一排查

1. **`scripts/vite-networkInterfaces-patch.js`**：仅在 vite.config.js 加载时包装 `os.networkInterfaces()`，是 O(1) 的同步操作；且该方法只在 dev server 打印地址时被调用，build 阶段不触发。实测当前 `os.networkInterfaces()` 返回耗时 0ms，补丁无害也无必要移除（它防的是偶发 libuv 抛错）。
2. **`src/assets/` 117 张三格式图片**：通过 `OptimizedImage.jsx` 的 `import.meta.glob('...', { query: '?url' })` 以 **URL 引用** 方式进模块图，Rollup 只复制产物、不做转码，共输出 181 个静态文件，开销可忽略。
3. **巨型 SVG 内联**：`nordschleife-map.svg` 仅 98KB，且以 URL 方式 import（产物为独立文件），未内联进 JS。
4. **@vitejs/plugin-react 编译 277 个源文件**：全量编译就在 1.27s 内完成，非瓶颈。

## 推断

4m25s 大概率是测量当时的一次性系统级因素，与项目配置无关。补充证据：`MEMORY/事实.md` 记载 2026-08-16 曾"清理 node_modules 空目录与 dist 旧残留后重新构建（构建时间从 3 分 23 秒降至约 1.4 秒）"——即同类慢构建在两周前已通过清理旧产物解决，本次 4m25s 很可能是测量时又遇到类似的环境残留或磁盘扫描干扰，而非代码问题。

## 若复发，按此排查

```bash
rm -rf dist && time npm run build        # 复测
DEBUG=vite:* npm run build               # 定位耗时插件/阶段
node -e "const t=Date.now();require('node:os').networkInterfaces();console.log(Date.now()-t)"  # 检查 libuv 卡顿
```
