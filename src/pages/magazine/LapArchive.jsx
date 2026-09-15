import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { lapTimes, POWERTRAIN_TABS, CIRCUIT_OPTIONS, getSortedTimes } from '../../data/lap-times.js';
import { lapTimeSources } from '../../data/lap-time-sources.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './lap-archive.css';

const powerLabels = { petrol: '燃油', electric: '纯电', hybrid: '混动' };
const references = [
  { name: 'Porsche 919 Hybrid Evo', label: '2018 · 原型赛车' },
  { name: 'Mercedes-AMG ONE', label: '2024 · 量产车型' },
  { name: 'Volkswagen ID.R', label: '2019 · 电动原型' },
];

function EntrySource({ entry }) {
  const source = lapTimeSources[entry.name];
  return source ? (
    <div className="mg-lap-source">
      <a href={source.href} target="_blank" rel="noreferrer">{source.title} <ArrowUpRight size={12} aria-hidden="true" /></a>
      <span>复核 {source.checkedOn}</span>
    </div>
  ) : <p className="mg-lap-pending">来源与成绩待核验</p>;
}

export default function LapArchive() {
  useDocumentTitle('北环圈速档案');
  const [searchParams, setSearchParams] = useSearchParams();
  const category = POWERTRAIN_TABS.some(tab => tab.id === searchParams.get('cat')) ? searchParams.get('cat') : 'all';
  const circuit = CIRCUIT_OPTIONS.includes(searchParams.get('circuit')) ? searchParams.get('circuit') : CIRCUIT_OPTIONS[0];
  const showPrototype = searchParams.get('proto') === '1';
  const query = searchParams.get('q') || '';

  const setFilter = (key, value, replace = false) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace });
  };

  const entries = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return getSortedTimes(category, showPrototype, circuit).filter(entry => !normalized ||
      [entry.name, entry.brand, entry.driver].some(value => value?.toLowerCase().includes(normalized)));
  }, [category, showPrototype, circuit, query]);
  const leader = entries[0]?.timeMs ?? 0;

  return (
    <article className="mg-lap">
      <header className="mg-lap-heading">
        <div>
          <p className="mg-lap-kicker">THE NORDSCHLEIFE / TIME ARCHIVE</p>
          <h1>圈速档案<span>Every second counts.</span></h1>
        </div>
        <p className="mg-lap-intro">秒针背后，是不同年代的工程答案。<br />先选相同的计时口径，再读懂每一个数字。</p>
      </header>

      <section className="mg-lap-references" aria-labelledby="mg-lap-reference-title">
        <div className="mg-lap-reference-title"><h2 id="mg-lap-reference-title">三个历史坐标</h2><p>固定参考 · 不随筛选变化</p></div>
        <div className="mg-lap-reference-list">
          {references.map(reference => {
            const entry = lapTimes.find(item => item.name === reference.name);
            if (!entry) return null;
            return <div className="mg-lap-reference" key={entry.name}>
              <p>{reference.label}</p><strong>{entry.time}</strong><span>{entry.name}</span>
              <EntrySource entry={entry} />
            </div>;
          })}
        </div>
      </section>

      <section className="mg-lap-archive" aria-labelledby="mg-lap-results-title">
        <div className="mg-lap-section-heading"><h2 id="mg-lap-results-title">查阅成绩</h2><span>按总用时从快到慢排列</span></div>
        <div className="mg-lap-controls">
          <div className="mg-lap-control-top">
            <label className="mg-lap-circuit">计时口径
              <select value={circuit} onChange={event => setFilter('circuit', event.target.value)}>
                <option value="20.832 km">20.832 km · 完整北环</option>
                <option value="20.6 km">20.6 km · 历史计时段</option>
              </select>
            </label>
            <div className="mg-lap-search"><Search size={17} aria-hidden="true" />
              <input type="search" aria-label="搜索车型、品牌或车手" placeholder="搜索车型、品牌或车手" value={query} onChange={event => setFilter('q', event.target.value.trim() ? event.target.value : '', true)} />
              {query && <button type="button" aria-label="清除搜索" onClick={() => setFilter('q', '', true)}><X size={16} aria-hidden="true" /></button>}
            </div>
          </div>
          <div className="mg-lap-control-bottom">
            <div className="mg-lap-tabs" role="group" aria-label="动力类型">
              {POWERTRAIN_TABS.map(tab => <button type="button" key={tab.id} aria-pressed={category === tab.id} onClick={() => setFilter('cat', tab.id === 'all' ? '' : tab.id)}>{tab.label}</button>)}
            </div>
            <label className="mg-lap-prototype"><input type="checkbox" checked={showPrototype} onChange={event => setFilter('proto', event.target.checked ? '1' : '')} />包含原型赛车</label>
          </div>
        </div>
        <div className="mg-lap-result-summary"><p aria-live="polite" aria-atomic="true">{circuit} <span>·</span> {entries.length} 条成绩</p><span>Δ 相对当前筛选内最快成绩</span></div>
        {entries.length === 0 ? <div className="mg-lap-empty"><h3>没有找到符合条件的成绩</h3><p>试试其他关键词，或重新选择计时口径与动力类型。</p><button type="button" onClick={() => setSearchParams({})}>重置全部筛选</button></div> : (
          <table className="mg-lap-table">
            <caption className="mg-lap-sr-only">{circuit} 圈速成绩，差距仅比较本次筛选结果</caption>
            <thead><tr><th scope="col">序号</th><th scope="col">车型与成绩来源</th><th scope="col">总用时</th><th scope="col">差距 Δ</th></tr></thead>
            <tbody>{entries.map((entry, index) => <tr key={`${entry.name}-${entry.year}`}>
              <td className="mg-lap-rank">{String(index + 1).padStart(2, '0')}</td>
              <th scope="row" className="mg-lap-car">
                <p className="mg-lap-car-meta">{entry.year} <span>·</span> {powerLabels[entry.powerType]} <span>·</span> {entry.category === 'prototype' ? '原型 / 赛道专用' : entry.category === 'suv' ? 'SUV' : '公路车型 / 改装版本'}</p>
                {entry.modelLink ? <Link className="mg-lap-model" to={`/brands/${entry.modelLink.brand}/${entry.modelLink.model}`}>{entry.name}<ArrowUpRight size={15} aria-hidden="true" /></Link> : <strong className="mg-lap-model">{entry.name}</strong>}
                {entry.driver && <p className="mg-lap-driver">车手 · {entry.driver}</p>}
                <EntrySource entry={entry} />
                {entry.note && <details className="mg-lap-entry-note"><summary>成绩说明</summary><p>{lapTimeSources[entry.name] ? entry.note : `待核验 · ${entry.note}`}</p></details>}
              </th>
              <td className="mg-lap-time"><span className="mg-lap-mobile-label">总用时</span>{entry.time}</td>
              <td className="mg-lap-delta"><span className="mg-lap-mobile-label">差距 Δ</span>{index === 0 ? <span className="mg-lap-baseline">本次基准</span> : `+${((entry.timeMs - leader) / 1000).toFixed(3)}s`}</td>
            </tr>)}</tbody>
          </table>
        )}
      </section>
      <footer className="mg-lap-method">
        <h2>如何阅读这份档案</h2>
        <div><p>20.832 km 与 20.6 km 分开列示，不直接混排。差距是当前筛选结果内的总用时差，并非分段遥测；车辆、轮胎、年份与测试条件仍可能不同。</p><p>本页为历史成绩选录，不代表实时或完整排名。已复核条目附来源与日期，其余条目明确标注待核验。</p><a href="https://www.nuerburgring.de/info/nuerburgring/records?locale=en" target="_blank" rel="noreferrer">查看官方计时规则 <ArrowUpRight size={14} aria-hidden="true" /></a></div>
      </footer>
    </article>
  );
}
