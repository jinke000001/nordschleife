import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import TrackMap from '../../components/TrackMap.jsx';
import TrackElevationRibbon from '../../components/TrackElevationRibbon.jsx';
import { getCornerBySlug } from '../../data/corners.js';
import { trackLabels, trackLabelId, trackLabelKey } from '../../data/track-labels.js';
import { trackNameNotes } from '../../data/track-name-notes.js';
import photo from '../../assets/karussell-wikimedia-1800.webp';
import { ImageCredit } from './HomeChapters.jsx';
import { buildCircuitItems, photographedSlugs } from './circuit-groups.js';
import useReadingSteps from './useReadingSteps.js';

const referenceUrl = 'https://github.com/JJYing/Nurburgring-Map';
const cornerImages = import.meta.glob('../../assets/corners/*.webp', { eager: true, query: '?url', import: 'default' });

// Restore the reading layout before PagePosition restores its scroll offset.
// Keep an in-memory copy too, matching PagePosition's storage fallback.
let rememberedOpenGaps = [];
try {
  const saved = JSON.parse(sessionStorage.getItem('nord-guide-open-gaps'));
  if (Array.isArray(saved)) rememberedOpenGaps = saved;
} catch { /* Storage can be unavailable. */ }
// visual-fix-3: anchors past the opening two also fold away, and their open
// state is restored the same way before PagePosition restores the scroll offset.
let rememberedOpenAnchors = [];
try {
  const saved = JSON.parse(sessionStorage.getItem('nord-guide-open-anchors'));
  if (Array.isArray(saved)) rememberedOpenAnchors = saved;
} catch { /* Storage can be unavailable. */ }

function CircuitStop({ label, index, step, compact = false }) {
  const record = label.slug ? getCornerBySlug(label.slug) : null;
  const media = record?.media;
  const image = !compact && photographedSlugs.has(label.slug) ? (label.slug === 'karussell' ? photo : cornerImages[`../../assets/corners/${media.basename}.webp`]) : null;
  const previous = trackLabels[index - 1];
  const next = trackLabels[index + 1];
  return <article className={`circuit-stop${compact ? ' circuit-stop-brief' : ''}${step === index ? ' is-current' : ''}${image ? ' has-photo' : ''}`} id={trackLabelId(label)} data-reading-position data-reading-step data-label-index={index}>
    <span className="guide-step-number">{String(index + 1).padStart(2, '0')} / {trackLabels.length} · {record && !compact ? '弯道故事' : '沿途地名'}</span>
    <h3>{label.zh}</h3><p className="circuit-stop-de">{label.de}</p>
    <p className="circuit-stop-copy">{record?.explanation ?? trackNameNotes[label.de]}</p>
    {image && <figure><img src={image} alt={media.title} width="1200" height="800" loading="lazy" fetchPriority="low" style={{ objectPosition: media.objectPosition }} /><ImageCredit href={media.sourceHref}>{media.credit} · 展示裁切</ImageCredit></figure>}
    {!compact && record && <p className="circuit-stop-origin">{record.origin}</p>}
    {!compact && <div className="circuit-neighbours"><span>{previous ? `前一处 / ${previous.zh}` : '一圈的开始'}</span><span>{next ? `下一处 / ${next.zh}` : '回到起点区域'}</span></div>}
    {!compact && record && <Link className="ed-text-link" to={`/corners/${label.slug}`}>完整弯道档案 <ArrowUpRight size={16} /></Link>}
  </article>;
}

// visual-fix-3: an anchor folded to a compact row (number, names, one line of
// the story) with a toggle that unfolds the full card in place. The row carries
// the reading step while the detail is collapsed, mirroring the gap summary.
function AnchorRow({ label, index, step, open, onExpand }) {
  const record = getCornerBySlug(label.slug);
  return <div className={`circuit-stop circuit-stop-brief circuit-anchor-row${step === index ? ' is-current' : ''}`} data-reading-step data-label-index={index}>
    <span className="guide-step-number">{String(index + 1).padStart(2, '0')} / {trackLabels.length} · 弯道故事</span>
    <h3>{label.zh}</h3><p className="circuit-stop-de">{label.de}</p>
    <p className="circuit-stop-copy">{record?.explanation ?? trackNameNotes[label.de]}</p>
    <button type="button" id={`anchor-open-${index}`} className="circuit-anchor-toggle" aria-expanded={open} aria-controls={`anchor-detail-${index}`} onClick={onExpand}>展开完整讲解 <ChevronDown size={14} /></button>
  </div>;
}

export function CircuitReading() {
  const root = useRef(null);
  // Steps carry data-label-index, so this is a trackLabels index even while gap rows are collapsed away.
  const step = Math.max(0, useReadingSteps(root, '[data-reading-step]', .2));
  const [manual, setManual] = useState(null);
  const items = useMemo(() => buildCircuitItems(), []);
  const [openGaps, setOpenGaps] = useState(() => new Set(rememberedOpenGaps.filter(key => items.some(item => item.type === 'gap' && item.key === key))));
  // Anchors past the opening two default to compact rows; keyed by trackLabels index.
  const collapsibleAnchors = useMemo(() => new Set(items.filter(item => item.type === 'anchor').slice(2).map(item => item.index)), [items]);
  const [openAnchors, setOpenAnchors] = useState(() => new Set(rememberedOpenAnchors.filter(index => collapsibleAnchors.has(index))));
  useEffect(() => {
    rememberedOpenGaps = [...openGaps];
    try { sessionStorage.setItem('nord-guide-open-gaps', JSON.stringify(rememberedOpenGaps)); } catch { /* Keep in-memory restoration. */ }
  }, [openGaps]);
  useEffect(() => {
    rememberedOpenAnchors = [...openAnchors];
    try { sessionStorage.setItem('nord-guide-open-anchors', JSON.stringify(rememberedOpenAnchors)); } catch { /* Keep in-memory restoration. */ }
  }, [openAnchors]);
  useEffect(() => { setManual(null); }, [step]);
  const current = manual?.step === step ? manual.label : trackLabels[step];
  const currentIndex = trackLabels.indexOf(current);
  const jumpTo = label => {
    const index = trackLabels.indexOf(label);
    const gap = items.find(item => item.type === 'gap' && item.labels.some(entry => entry.index === index));
    const needsGap = gap && !openGaps.has(gap.key);
    const needsAnchor = collapsibleAnchors.has(index) && !openAnchors.has(index);
    const scroll = () => document.getElementById(trackLabelId(label))?.scrollIntoView({ block: 'start', behavior: 'instant' });
    if (needsGap || needsAnchor) {
      if (needsGap) setOpenGaps(previous => new Set(previous).add(gap.key));
      if (needsAnchor) setOpenAnchors(previous => new Set(previous).add(index));
      requestAnimationFrame(() => requestAnimationFrame(scroll));
    } else scroll();
  };
  const selectOnMap = (label, interaction) => {
    setManual({ step, label });
    if (interaction === 'activate') jumpTo(label);
  };
  const toggleGap = key => {
    setOpenGaps(previous => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };
  const toggleAnchor = (index, expand) => {
    setOpenAnchors(previous => {
      const next = new Set(previous);
      if (expand) next.add(index); else next.delete(index);
      return next;
    });
    // The clicked toggle hides with its container; hand focus to the counterpart.
    requestAnimationFrame(() => document.getElementById(expand ? `anchor-detail-${index}` : `anchor-open-${index}`)?.focus());
  };
  return <section className="guide-circuit circuit-complete mg-home-map" id="circuit" data-reading-position data-guide-chapter ref={root} aria-labelledby="mg-map-title">
    <header className="guide-heading"><p className="ed-kicker">03 / 把弯道连成一圈</p><h2 id="mg-map-title">每一个名字，<br /><em>都是赛道的一部分。</em></h2><p>从刚才的旋转木马，回到完整的北环。<br />沿着右侧讲解慢慢读，也可以直接选择地图上的名字。</p><p className="guide-heading-note">这 43 个名字中，12 个弯带实拍照片与完整讲解，其中后 10 个默认收起为紧凑行、可随时展开；另有 5 个弯暂无实拍照片，只以紧凑行呈现。全部 17 篇完整弯道档案，见<Link to="/corners">弯道档案页</Link>。</p></header>
    <div className="guide-two-column">
      <div className="guide-sticky guide-map-visual">
        <div className="guide-visual-meta"><span>NORDSCHLEIFE / 20.832 KM</span><span>完整地图 · {trackLabels.length} 处地名</span></div>
        <label className="circuit-jump-select">选择赛道地名<select value={trackLabelKey(current)} onChange={event => jumpTo(trackLabels.find(label => trackLabelKey(label) === event.target.value))}>{trackLabels.map((label, index) => <option key={label.de} value={trackLabelKey(label)}>{String(index + 1).padStart(2, '0')} · {label.zh} / {label.de}</option>)}</select></label>
        <TrackMap activeSlug={trackLabelKey(current)} selectionOnly showElevation={false} onSelectCorner={selectOnMap} />
        <div className="circuit-location"><span>{String(currentIndex + 1).padStart(2, '0')} / {trackLabels.length}</span><strong>{current.zh}</strong><small>{current.de}</small>{manual?.step === step && <button type="button" onClick={() => jumpTo(current)}>阅读此处讲解 <ArrowDown size={13} /></button>}</div>
        <div className="circuit-map-footer"><a href={referenceUrl} target="_blank" rel="noreferrer">地图 / JJYing · MIT <ArrowUpRight size={11} /></a><a href="#machines">继续看汽车 <ArrowDown size={13} /></a></div>
      </div>
      <div className="guide-steps circuit-stories">{items.map(item => {
        if (item.type === 'gap') {
          const open = openGaps.has(item.key);
          const first = item.labels[0];
          const from = item.from?.zh ?? '起点';
          const to = item.to?.zh ?? '回到起点';
          return <div className={`circuit-gap${open ? ' is-open' : ''}`} key={item.key}>
            <button type="button" id={`${item.key}-summary`} className={`circuit-gap-summary${!open && step === first.index ? ' is-current' : ''}`} aria-expanded={open} aria-controls={item.key} onClick={() => toggleGap(item.key)} data-reading-step data-label-index={first.index}>
              <span className="circuit-gap-route">{from} → {to}</span>
              <span className="circuit-gap-count">之间还有 {item.labels.length} 处地名</span>
              <ChevronDown size={15} />
            </button>
            <div className="circuit-gap-items" id={item.key} role="region" aria-labelledby={`${item.key}-summary`}>
              {item.labels.map(entry => <CircuitStop key={entry.label.de} label={entry.label} index={entry.index} step={step} compact />)}
            </div>
          </div>;
        }
        if (item.type === 'anchor' && collapsibleAnchors.has(item.index)) {
          const open = openAnchors.has(item.index);
          return <div className={`circuit-anchor${open ? ' is-open' : ''}`} key={item.label.de}>
            <AnchorRow label={item.label} index={item.index} step={step} open={open} onExpand={() => toggleAnchor(item.index, true)} />
            <div className="circuit-anchor-detail" id={`anchor-detail-${item.index}`} role="region" aria-label={`${item.label.zh}完整讲解`} tabIndex={-1}>
              <CircuitStop label={item.label} index={item.index} step={step} />
              <button type="button" id={`anchor-fold-${item.index}`} className="circuit-anchor-toggle circuit-anchor-fold" aria-expanded={open} aria-controls={`anchor-detail-${item.index}`} onClick={() => toggleAnchor(item.index, false)}>收起完整讲解 <ChevronUp size={14} /></button>
            </div>
          </div>;
        }
        return <CircuitStop key={item.label.de} label={item.label} index={item.index} step={step} compact={item.type === 'stop'} />;
      })}</div>
    </div>
    <div className="guide-elevation"><TrackElevationRibbon activeSlug={current.slug} /><p className="circuit-source-footnote"><a href={referenceUrl} target="_blank" rel="noreferrer">地名来源 / Nurburgring Map（JJYing · MIT） <ArrowUpRight size={11} /></a></p><div className="circuit-end-links"><Link className="ed-text-link" to="/corners">浏览全部弯道档案 <ArrowUpRight size={16} /></Link><a href="#machines" className="ed-text-link">看过赛道，再看车的答案 <ArrowDown size={18} /></a></div></div>
  </section>;
}
