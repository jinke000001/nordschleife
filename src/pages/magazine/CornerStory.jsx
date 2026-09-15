import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { getCornerBySlug, getAdjacentCorners } from '../../data/corners.js';
import OptimizedImage from '../../components/OptimizedImage.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import NotFound from './NotFound.jsx';
import './corners.css';

const referenceLabels = { flugplatz: '区域参考 / Postbrücke，非 Flugplatz 弯心', bergwerk: '赛道参考 / Kallenhard，非 Bergwerk 实景', kesselchen: '区域参考 / Steilstrecke 入口', hocheichen: '模拟器画面 / 非实景照片', schwalbenschwanz: '参考素材 / 来源待核验' };

export default function CornerStory() {
  const { slug } = useParams();
  const corner = getCornerBySlug(slug);
  useDocumentTitle(corner ? `${corner.name} · ${corner.chineseName}` : '没有找到这个弯道');
  if (!corner) return <NotFound />;
  const { previous, next } = getAdjacentCorners(slug);
  const sections = corner.storySections?.length ? corner.storySections : [
    { eyebrow: 'NAME', title: '名字，是理解它的起点。', content: corner.origin },
    { eyebrow: 'HISTORY', title: '一段赛道的记忆。', content: corner.history },
    { eyebrow: 'CHARACTER', title: '它留给人的印象。', content: corner.story },
    { eyebrow: 'IN CONTEXT', title: '放回整圈，认识它的性格。', content: corner.fame },
  ];
  const sources = corner.resources.filter(resource => resource.href);
  return <article className="mg-corner-story">
    <header className="mg-corner-story-header"><Link className="ed-back" to="/corners"><ArrowLeft size={15} /> 全部弯道</Link><div className="mg-corner-story-heading"><div><p className="ed-kicker">CORNER {String(corner.order).padStart(2, '0')} / NORDSCHLEIFE</p><h1>{corner.name}<span>{corner.chineseName}</span></h1></div><p>{corner.explanation}</p></div></header>
    <figure className="mg-corner-main-photo"><OptimizedImage basename={corner.media.basename} alt={corner.media.credit} width={1600} height={1000} loading="eager" fetchPriority="high" style={{ objectPosition: corner.media.objectPosition }} /><figcaption><span>{referenceLabels[slug] ?? '档案影像'} · {corner.media.credit}</span>{corner.media.sourceHref && <a href={corner.media.sourceHref} target="_blank" rel="noreferrer">原图与许可 <ArrowUpRight size={14} /></a>}</figcaption></figure>
    <div className="mg-corner-reading-layout"><aside className="mg-corner-sidebar"><p className="ed-kicker">READ THE CORNER</p><dl><dt>在这一圈中</dt><dd>{corner.section}</dd><dt>阅读关键词</dt><dd>{corner.tags.join(' / ')}</dd></dl><nav aria-label="本篇目录">{sections.map((section, index) => <a key={section.title} href={`#corner-section-${index}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.title}</a>)}<a href="#corner-sources">资料与延伸阅读 <ArrowUpRight size={14} /></a></nav>{slug === 'karussell' && <Link className="mg-corner-study-link" to="/experience/karussell">看实景，读懂路面<ArrowRight size={19} /></Link>}</aside>
      <div className="mg-corner-prose"><p className="mg-corner-lede">{corner.readingFocus}</p>{sections.map((section, index) => <section id={`corner-section-${index}`} className="mg-corner-chapter" key={section.title}><p className="ed-kicker">{String(index + 1).padStart(2, '0')} / {section.eyebrow}</p><h2>{section.title}</h2><p>{section.content}</p></section>)}
      {corner.systems?.length > 0 && <section className="mg-corner-observations"><h2>三个观察角度</h2>{corner.systems.map(item => <div key={item.title}><span>{item.label}</span><h3>{item.title}</h3><p>{item.content}</p></div>)}</section>}
      {corner.techDeck?.length > 0 && <section className="mg-corner-notes"><h2>档案中的驾驶观察</h2><p>这些文字帮助理解车辆与地形的关系，不作为现场驾驶指引。</p>{corner.techDeck.map(item => <details key={item.title}><summary>{item.title}</summary><p>{item.content}</p></details>)}</section>}
      {corner.timeline?.length > 0 && <section className="mg-corner-timeline"><h2>沿着时间读</h2>{corner.timeline.map(item => <div key={`${item.year}-${item.title}`}><span>{item.year}</span><div><h3>{item.title}</h3><p>{item.content}</p></div></div>)}</section>}
      {corner.readingGuide?.length > 0 && <section className="mg-corner-notes"><h2>回到赛道，再看一次</h2><ol>{corner.readingGuide.map(item => <li key={item}>{item}</li>)}</ol></section>}
      <section className="mg-corner-sources" id="corner-sources"><h2>资料与延伸阅读</h2><p>{corner.verifiedOn ? `本篇结构资料复核：${corner.verifiedOn}。` : '以下为档案收录的参考资料，文字与历史细节仍需逐项复核。'}</p>{sources.map(source => <a key={source.id} href={source.href} target="_blank" rel="noreferrer"><span>{source.title}<small>{source.description}</small></span><ArrowUpRight size={17} /></a>)}{!sources.length && <p>本篇文字来源正在补齐。图像出处见上方照片署名。</p>}</section>
      </div>
    </div>
    <nav className="mg-corner-next" aria-label="相邻弯道">{previous ? <Link to={`/corners/${previous.slug}`}><span><ArrowLeft size={16} /> 上一站</span><strong>{previous.chineseName}</strong><small>{previous.name}</small></Link> : <Link to="/corners"><span>回到目录</span><strong>从这里出发</strong><small>THE CORNER ARCHIVE</small></Link>}{next ? <Link to={`/corners/${next.slug}`}><span>下一站 <ArrowRight size={16} /></span><strong>{next.chineseName}</strong><small>{next.name}</small></Link> : <Link to="/lap-times"><span>继续阅读 <ArrowRight size={16} /></span><strong>一圈之后，看看时间。</strong><small>THE LAP ARCHIVE</small></Link>}</nav>
  </article>;
}
