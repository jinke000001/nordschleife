import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { corners } from '../../data/corners.js';
import OptimizedImage from '../../components/OptimizedImage.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './corners.css';

const referenceThumbnails = { flugplatz: '区域参考 / Postbrücke', bergwerk: '赛道参考 / Kallenhard', kesselchen: '区域参考 / Steilstrecke' };

export default function CornerIndex() {
  useDocumentTitle('弯道档案');
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const filtered = corners.filter(corner => [corner.name, corner.chineseName, corner.explanation, corner.section, corner.location, corner.origin, corner.history, corner.story, corner.driving, corner.fame, ...corner.tags].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  const updateQuery = value => { const next = new URLSearchParams(params); if (value) next.set('q', value); else next.delete('q'); setParams(next, { replace: true }); };
  return <div className="mg-corners">
    <header className="mg-corner-index-header"><div><p className="ed-kicker">THE CORNER ARCHIVE</p><h1>每一个弯，<br /><em>都有自己的名字。</em></h1></div><div><span className="mg-corner-count">{String(corners.length).padStart(2, '0')}<small>篇弯道档案</small></span><p>这些德语地名，既是赛道的坐标，也是森林、山谷与历史留下的线索。</p></div></header>
    <Link className="mg-corner-spotlight" to="/experience/karussell"><span>本期细读 / KARUSSELL</span><strong>从两种路面，认识旋转木马。</strong><span>实景交互解读 <ArrowUpRight size={18} /></span></Link>
    <div className="mg-corner-tools"><p>按行驶顺序阅读 <span aria-live="polite">{filtered.length} / {corners.length}</span></p><label className="mg-corner-search"><Search size={17} /><input aria-label="搜索弯道名称或关键词" type="search" placeholder="搜索弯名、地形或关键词" value={query} onChange={event => updateQuery(event.target.value)} />{query && <button type="button" aria-label="清空弯道搜索" onClick={() => updateQuery('')}><X size={16} /></button>}</label></div>
    {filtered.length ? <div className="mg-corner-grid">{filtered.map(corner => <Link key={corner.slug} className="mg-corner-card" to={`/corners/${corner.slug}`}>
      <div className="mg-corner-thumb"><OptimizedImage basename={corner.media.basename} alt={corner.media.credit} width={800} height={520} style={{ objectPosition: corner.media.objectPosition }} /><span>{String(corner.order).padStart(2, '0')}</span>{(referenceThumbnails[corner.slug] || !corner.media.sourceHref) && <small>{referenceThumbnails[corner.slug] ?? (corner.slug === 'hocheichen' ? '模拟器画面' : '参考素材 · 来源待核验')}</small>}</div>
      <div className="mg-corner-card-title"><h2>{corner.chineseName}<span>{corner.name}</span></h2><ArrowUpRight size={20} /></div><p>{corner.explanation}</p><div className="mg-corner-tags">{corner.tags.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div>
    </Link>)}</div> : <div className="mg-corner-empty" role="status"><h2>还没有找到这个名字。</h2><p>试试德语弯名，或「森林」「坡顶」这样的关键词。</p><button type="button" onClick={() => updateQuery('')}>清空搜索，查看全部弯道 →</button></div>}
    <p className="mg-corner-index-note">图片包括赛道照片、历史影像与参考素材，具体来源见各篇档案。弯道顺序用于阅读导航。</p>
  </div>;
}
