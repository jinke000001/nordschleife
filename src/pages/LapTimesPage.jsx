import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Zap, Flame, GitMerge, Search, Timer, X } from 'lucide-react';
import { lapTimes, POWERTRAIN_TABS, getSortedTimes } from '../data/lap-times.js';
import useScrollReveal from '../hooks/useScrollReveal.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

const POWER_ICONS = {
  electric: { icon: Zap,      label: '纯电动', color: 'var(--ev-color)' },
  petrol:   { icon: Flame,    label: '燃油车', color: 'var(--petrol-color)' },
  hybrid:   { icon: GitMerge, label: '油电混动', color: 'var(--hybrid-color)' },
};

function LapBar({ timeMs, maxMs, minMs, powerType }) {
  const range = maxMs - minMs;
  const pct = range === 0 ? 100 : 30 + 70 * (1 - (timeMs - minMs) / range);
  const colors = { electric: '#44aaff', petrol: '#e5232e', hybrid: '#a78bfa' };
  return (
    <div className="lt-bar-track">
      <div
        className="lt-bar-fill"
        style={{ width: `${pct.toFixed(1)}%`, '--bar-color': colors[powerType] || colors.petrol }}
      />
    </div>
  );
}

export default function LapTimesPage() {
  useDocumentTitle('北环圈速档案');
  useScrollReveal();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'all';
  const showPrototype = searchParams.get('proto') === '1';
  const searchQuery = searchParams.get('q') || '';

  const setActiveCategory = (cat) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat === 'all') next.delete('cat');
      else next.set('cat', cat);
      return next;
    });
  };

  const togglePrototype = (on) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (on) next.set('proto', '1');
      else next.delete('proto');
      return next;
    });
  };

  const setSearch = (q) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (q.trim()) next.set('q', q.trim());
      else next.delete('q');
      return next;
    });
  };

  const filteredAndSorted = useMemo(() => {
    let result = getSortedTimes(activeCategory, showPrototype);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.brand.toLowerCase().includes(q) ||
        (t.driver && t.driver.toLowerCase().includes(q))
      );
    }
    return result;
  }, [activeCategory, showPrototype, searchQuery]);

  const minMs = filteredAndSorted.length ? filteredAndSorted[0].timeMs : 0;
  const maxMs = filteredAndSorted.length ? filteredAndSorted[filteredAndSorted.length - 1].timeMs : 0;

  return (
    <article className="detail-page lt-page">
      <header className="lt-hero">
        <div className="lt-hero-copy">
          <p className="eyebrow">Nordschleife Lap Records</p>
          <h1>北环圈速档案</h1>
          <p className="detail-subtitle">
            纽博格林北环量产车与原型赛车官方圈速权威排行榜。
          </p>
        </div>
        <div className="lt-hero-stats">
          <div>
            <strong>{lapTimes.length}</strong>
            <span>收录圈速</span>
          </div>
          <div>
            <strong>
              {(() => {
                const record = lapTimes.find(t => t.isRecord && t.category !== 'prototype');
                return record ? record.time : '—';
              })()}
            </strong>
            <span>量产纪录</span>
          </div>
        </div>
      </header>

      <div className="lt-controls">
        <div className="lt-controls-top">
          <div className="lt-cat-tabs">
            {POWERTRAIN_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`lt-cat-tab ${activeCategory === tab.id ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="lt-search-wrapper">
            <Search size={16} />
            <input
              type="text"
              placeholder="搜索车型、品牌或车手…"
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
            />
            {searchQuery && (
              <button className="lt-search-clear" onClick={() => setSearch('')} title="清除">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="lt-toggles">
          <label className="lt-toggle">
            <input type="checkbox" checked={showPrototype} onChange={(e) => togglePrototype(e.target.checked)} />
            <span>显示原型赛车</span>
          </label>
        </div>
      </div>

      <div className="lt-legend">
        {Object.entries(POWER_ICONS).map(([key, { icon: Icon, label, color }]) => (
          <div key={key} className="lt-legend-item">
            <Icon size={14} style={{ color }} />
            <span>{label}</span>
          </div>
        ))}
        {searchQuery && (
          <span className="lt-search-count">找到 {filteredAndSorted.length} 条结果</span>
        )}
      </div>

      <section className="lt-table-section">
        {filteredAndSorted.length === 0 ? (
          <div className="lt-empty">
            <Timer size={32} />
            <p>{searchQuery ? '无匹配车型' : '当前筛选条件下无匹配圈速记录'}</p>
            <button className="text-btn" onClick={() => setSearchParams({})}>
              重置筛选
            </button>
          </div>
        ) : (
          <div className="lt-table">
            <div className="lt-row lt-row-head">
              <div>#</div>
              <div>车型 / 车手</div>
              <div>圈速</div>
              <div className="lt-col-bar">可视化</div>
              <div className="lt-cell-year">年份</div>
              <div className="lt-cell-circuit">赛道</div>
            </div>
            {filteredAndSorted.map((entry, i) => {
              const { icon: Icon, color, label } = POWER_ICONS[entry.powerType] || POWER_ICONS.petrol;
              const rowClass = [
                'lt-row lt-row-data',
                entry.isRecord && 'lt-row-record',
                entry.category === 'prototype' && 'lt-row-prototype',
              ].filter(Boolean).join(' ');

              return (
                <div key={`${entry.name}-${entry.year}`} className={`${rowClass} lt-rank-${i + 1}`}>
                  <div className="lt-cell-rank">
                    {i === 0 ? <span className="lt-medal-gold">🥇</span> : 
                     i === 1 ? <span className="lt-medal-silver">🥈</span> :
                     i === 2 ? <span className="lt-medal-bronze">🥉</span> :
                     i + 1}
                  </div>
                  <div className="lt-cell-name">
                    <div className="lt-name-row">
                      <Icon size={13} style={{ color }} title={label} />
                      <span className="lt-brand">{entry.brand}</span>
                      {entry.category === 'prototype' && <span className="lt-badge lt-badge-proto">原型</span>}
                    </div>
                    {entry.modelLink ? (
                      <Link to={`/brands/${entry.modelLink.brand}/${entry.modelLink.model}`} className="lt-model-link">
                        <strong className="lt-model">{entry.name}</strong>
                      </Link>
                    ) : (
                      <strong className="lt-model">{entry.name}</strong>
                    )}
                    {entry.driver && <p className="lt-driver">{entry.driver}</p>}
                    {entry.note && <p className="lt-note">{entry.note}</p>}
                  </div>
                  <div className="lt-cell-time">
                    <span className={`lt-time ${entry.isRecord ? 'lt-time-record' : ''}`}>{entry.time}</span>
                  </div>
                  <div className="lt-col-bar">
                    <LapBar timeMs={entry.timeMs} minMs={minMs} maxMs={maxMs} powerType={entry.powerType} />
                  </div>
                  <div className="lt-cell-year">{entry.year}</div>
                  <div className="lt-cell-circuit">{entry.circuit}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <footer className="lt-footnote">
        <Timer size={16} />
        <p>数据来源于厂商新闻稿及官方认证资料。</p>
      </footer>
    </article>
  );
}
