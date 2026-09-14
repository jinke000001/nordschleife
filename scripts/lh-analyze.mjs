// 解析 lighthouse JSON：扣分项、CLS 归因、LCP 元素
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const file = process.argv[2];
const r = require(file);
const fmt = c => Math.round(c.score * 100);
console.log('分类:', ['performance', 'accessibility', 'best-practices', 'seo'].map(k => `${k}=${fmt(r.categories[k])}`).join(' '));
console.log('LCP', r.audits['largest-contentful-paint'].displayValue, '| CLS', r.audits['cumulative-layout-shift'].displayValue, '| FCP', r.audits['first-contentful-paint'].displayValue, '| TBT', r.audits['total-blocking-time'].displayValue);

console.log('\n=== Accessibility 扣分项');
for (const ref of r.categories.accessibility.auditRefs) {
  const a = r.audits[ref.id];
  if (a && a.score !== null && a.score < 1) {
    console.log(`- ${ref.id}: ${a.title}`);
    (a.details?.items || []).slice(0, 4).forEach(it => console.log('   ', JSON.stringify(it.node?.snippet ?? it).slice(0, 220)));
  }
}
console.log('\n=== CLS 归因');
const clsItems = r.audits['cumulative-layout-shift'].details?.items || [];
for (const item of clsItems.slice(0, 5)) {
  console.log(`- 贡献 ${item.score}:`);
  (item.items || []).slice(0, 3).forEach(n => console.log('   ', JSON.stringify(n.node?.snippet ?? n).slice(0, 220)));
}
console.log('\n=== LCP 元素');
const lcpItems = r.audits['largest-contentful-paint-element'].details?.items || [];
for (const it of lcpItems) (it.items || []).slice(0, 2).forEach(n => console.log('-', JSON.stringify(n.node?.snippet ?? n).slice(0, 260), it.phase ? `${it.phase}: ${it.displayValue || it.timing}` : ''));
console.log('\n=== SEO 扣分项');
for (const ref of r.categories.seo.auditRefs) {
  const a = r.audits[ref.id];
  if (a && a.score !== null && a.score < 1) console.log(`- ${ref.id}: ${a.title}`);
}
