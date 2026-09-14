import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import TrackMap from '../../components/TrackMap.jsx';
import TrackElevationRibbon from '../../components/TrackElevationRibbon.jsx';
import { getCornerBySlug } from '../../data/corners.js';
import { trackLabels, trackLabelId, trackLabelKey } from '../../data/track-labels.js';
import { trackNameNotes } from '../../data/track-name-notes.js';
import photo from '../../assets/karussell-wikimedia-1800.webp';
import { ImageCredit } from './HomeChapters.jsx';
import useReadingSteps from './useReadingSteps.js';

const referenceUrl = 'https://github.com/JJYing/Nurburgring-Map';
const cornerImages = import.meta.glob('../../assets/corners/*.webp', { eager: true, query: '?url', import: 'default' });
// Only show an existing photo when its actual location matches the selected name.
const photographedSlugs = new Set(['hatzenbach', 'schwedenkreuz', 'fuchsroehre', 'adenauer-forst', 'metzgesfeld', 'karussell', 'hohe-acht', 'brunnchen', 'pflanzgarten', 'kleines-karussell', 'galgenkopf', 'doettinger-hoehe']);

export function CircuitReading() {
  const root = useRef(null);
  const step = Math.max(0, useReadingSteps(root, '[data-reading-step]', .2));
  const [manual, setManual] = useState(null);
  useEffect(() => { setManual(null); }, [step]);
  const current = manual?.step === step ? manual.label : trackLabels[step];
  const currentIndex = trackLabels.indexOf(current);
  const jumpTo = label => {
    const target = document.getElementById(trackLabelId(label));
    target?.scrollIntoView({ block: 'start', behavior: 'instant' });
  };
  const selectOnMap = (label, interaction) => {
    setManual({ step, label });
    if (interaction === 'activate') jumpTo(label);
  };
  return <section className="guide-circuit circuit-complete mg-home-map" id="circuit" data-reading-position data-guide-chapter ref={root} aria-labelledby="mg-map-title">
    <header className="guide-heading"><p className="ed-kicker">03 / 把弯道连成一圈</p><h2 id="mg-map-title">每一个名字，<br /><em>都是赛道的一部分。</em></h2><p>从刚才的旋转木马，回到完整的北环。<br />沿着右侧讲解慢慢读，也可以直接选择地图上的名字。</p></header>
    <div className="guide-two-column">
      <div className="guide-sticky guide-map-visual">
        <div className="guide-visual-meta"><span>NORDSCHLEIFE / 20.832 KM</span><span>完整地图 · {trackLabels.length} 处地名</span></div>
        <TrackMap activeSlug={trackLabelKey(current)} selectionOnly showElevation={false} onSelectCorner={selectOnMap} />
        <label className="circuit-mobile-select">选择赛道地名<select value={trackLabelKey(current)} onChange={event => jumpTo(trackLabels.find(label => trackLabelKey(label) === event.target.value))}>{trackLabels.map((label, index) => <option key={label.de} value={trackLabelKey(label)}>{String(index + 1).padStart(2, '0')} · {label.zh} / {label.de}</option>)}</select></label>
        <div className="circuit-location"><span>{String(currentIndex + 1).padStart(2, '0')} / {trackLabels.length}</span><strong>{current.zh}</strong><small>{current.de}</small>{manual?.step === step && <button type="button" onClick={() => jumpTo(current)}>阅读此处讲解 <ArrowDown size={13} /></button>}</div>
        <div className="circuit-map-footer"><a href={referenceUrl} target="_blank" rel="noreferrer">地图 / JJYing · MIT <ArrowUpRight size={11} /></a><a href="#machines">继续看汽车 <ArrowDown size={13} /></a></div>
      </div>
      <div className="guide-steps circuit-stories">{trackLabels.map((label, index) => {
        const record = label.slug ? getCornerBySlug(label.slug) : null;
        const media = record?.media;
        const image = photographedSlugs.has(label.slug) ? (label.slug === 'karussell' ? photo : cornerImages[`../../assets/corners/${media.basename}.webp`]) : null;
        const previous = trackLabels[index - 1];
        const next = trackLabels[index + 1];
        return <article className={`circuit-stop${step === index ? ' is-current' : ''}${image ? ' has-photo' : ''}`} key={label.de} id={trackLabelId(label)} data-reading-position data-reading-step>
          <span className="guide-step-number">{String(index + 1).padStart(2, '0')} / {trackLabels.length} · {record ? '弯道故事' : '沿途地名'}</span>
          <h3>{label.zh}</h3><p className="circuit-stop-de">{label.de}</p>
          <p className="circuit-stop-copy">{record?.explanation ?? trackNameNotes[label.de]}</p>
          {image && <figure><img src={image} alt={media.title} width="1200" height="800" loading="lazy" fetchPriority="low" style={{ objectPosition: media.objectPosition }} /><ImageCredit href={media.sourceHref}>{media.credit} · 展示裁切</ImageCredit></figure>}
          {record && <p className="circuit-stop-origin">{record.origin}</p>}
          <div className="circuit-neighbours"><span>{previous ? `前一处 / ${previous.zh}` : '一圈的开始'}</span><span>{next ? `下一处 / ${next.zh}` : '回到起点区域'}</span></div>
          {record ? <Link className="ed-text-link" to={`/corners/${label.slug}`}>完整弯道档案 <ArrowUpRight size={16} /></Link> : <a className="circuit-note-source" href={referenceUrl} target="_blank" rel="noreferrer">名称参考 / Nurburgring Map <ArrowUpRight size={11} /></a>}
        </article>;
      })}</div>
    </div>
    <div className="guide-elevation"><TrackElevationRibbon activeSlug={current.slug} /><div className="circuit-end-links"><Link className="ed-text-link" to="/corners">浏览全部弯道档案 <ArrowUpRight size={16} /></Link><a href="#machines" className="ed-text-link">看过赛道，再看车的答案 <ArrowDown size={18} /></a></div></div>
  </section>;
}
