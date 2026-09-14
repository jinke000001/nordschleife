// 扫描 PNG 中的纯色连续纵向带（空白检测）
import sharp from 'sharp';

const file = process.argv[2];
const thresholdPx = Number(process.argv[3] || 900); // 报告超过此高度的色带
const img = sharp(file);
const { width, height } = await img.metadata();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const channels = info.channels;

let bands = [];
let runStart = 0;
let prevKey = null;
for (let y = 0; y < height; y++) {
  const off = y * width * channels;
  const r = data[off], g = data[off + 1], b = data[off + 2];
  // 抽样检查整行是否均匀（每 32 像素采一点）
  let uniform = true;
  for (let x = 0; x < width; x += 32) {
    const o = off + x * channels;
    if (Math.abs(data[o] - r) > 4 || Math.abs(data[o + 1] - g) > 4 || Math.abs(data[o + 2] - b) > 4) { uniform = false; break; }
  }
  const key = uniform ? `${r},${g},${b}` : null;
  if (key !== prevKey) {
    if (prevKey !== null && y - runStart >= thresholdPx) bands.push({ from: runStart, to: y, size: y - runStart, rgb: prevKey });
    runStart = y;
    prevKey = key;
  }
}
if (prevKey !== null && height - runStart >= thresholdPx) bands.push({ from: runStart, to: height, size: height - runStart, rgb: prevKey });
console.log(JSON.stringify({ width, height, bands }, null, 2));
