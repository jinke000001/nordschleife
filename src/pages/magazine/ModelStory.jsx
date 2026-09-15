import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { getBrandBySlug } from '../../data/brands.js';
import { getModelByBrandAndSlug } from '../../data/models.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { BrandPhoto, PhotoCredit } from './BrandVisual.jsx';
import './brands.css';

export default function ModelStory() {
  const { brandSlug, modelSlug } = useParams();
  const brand = getBrandBySlug(brandSlug);
  const requestKey = `${brandSlug}/${modelSlug}`;
  const [result, setResult] = useState({ key: '', status: 'loading', model: null });
  useEffect(() => {
    let active = true;
    getModelByBrandAndSlug(brandSlug, modelSlug).then(model => {
      if (active) setResult({ key: requestKey, status: model ? 'ready' : 'missing', model });
    }).catch(() => {
      if (active) setResult({ key: requestKey, status: 'error', model: null });
    });
    return () => { active = false; };
  }, [brandSlug, modelSlug, requestKey]);
  const status = result.key === requestKey ? result.status : 'loading';
  const model = status === 'ready' ? result.model : null;
  useDocumentTitle(model ? `${model.name} · 车型档案` : '车型档案');
  if (!brand) return <Navigate to="/brands" replace />;
  if (status === 'loading') return <div className="mg-model-page mg-model-state" aria-busy="true"><p className="mg-brand-kicker">MODEL ARCHIVE</p><h1>正在打开车型档案</h1><p role="status">文字与图片加载中…</p><Link className="mg-brand-text-link" to={`/brands/${brandSlug}`}><ArrowLeft size={16} /> 返回品牌故事</Link></div>;
  if (!model) return <div className="mg-model-page mg-model-state"><p className="mg-brand-kicker">MODEL ARCHIVE</p><h1>{status === 'error' ? '档案暂时未能加载' : '未找到这份车型档案'}</h1><p role="status">{status === 'error' ? '请检查网络后重新加载，或先阅读同品牌的其他车型。' : '可以从品牌目录重新选择一台车型。'}</p>{status === 'error' && <button className="mg-model-retry" onClick={() => window.location.reload()}>重新加载</button>}<Link className="mg-brand-text-link" to={`/brands/${brandSlug}`}><ArrowLeft size={16} /> 返回品牌故事</Link></div>;
  const siblings = brand.modelStories.filter(story => story.slug && story.slug !== modelSlug);
  return <article className="mg-model-page">
    <header className="mg-model-heading"><Link className="mg-brand-back" to={`/brands/${brandSlug}`}><ArrowLeft size={16} /> {brand.name.replace(/\n/g, '')}</Link><p className="mg-brand-kicker">{model.status} · 车型档案</p><h1>{model.heroTitle || model.name}</h1><p className="mg-model-deck">{model.headline}</p></header>
    <figure className="mg-model-hero"><BrandPhoto key={requestKey} basename={model.heroImageBasename} alt={`${model.brandName} ${model.name}`} eager position={model.heroImagePosition} /><PhotoCredit credit={model.heroCredit} href={model.heroSourceHref} /></figure>
    <section className="mg-model-summary" aria-label="车型概览"><p>{model.summary}</p><dl className="mg-model-stats">{model.stats.map(stat => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd><small>{stat.note}</small></div>)}</dl><p className="mg-model-data-note">参数与历史成绩随车型版本及测试条件而异，出处见文末资料来源。<Link to="/lap-times">了解圈速计时口径 ↗</Link></p></section>
    <div className="mg-model-reading-layout"><aside className="mg-model-index"><p className="mg-brand-kicker">IN THIS STORY</p><h2>阅读这台车</h2><nav aria-label="车型文章目录">{model.storySections.map((section, index) => <a key={section.title} href={`#model-chapter-${index + 1}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.eyebrow || section.title}</a>)}<a href="#model-engineering"><span>＋</span>工程细节</a><a href="#model-sources"><span>↗</span>资料来源</a></nav>{model.readingGuide?.length > 0 && <div className="mg-model-reading-guide"><h3>阅读线索</h3><ol>{model.readingGuide.map(item => <li key={item}>{item}</li>)}</ol></div>}</aside><div className="mg-model-prose">{model.storySections.map((section, index) => <section id={`model-chapter-${index + 1}`} key={section.title}><p className="mg-brand-kicker">{String(index + 1).padStart(2, '0')} / {section.eyebrow}</p><h2>{section.title}</h2><p>{section.content}</p></section>)}</div></div>
    {(model.systems?.length > 0 || model.techDeck?.length > 0) && <section className="mg-model-engineering" id="model-engineering"><div className="mg-brand-section-heading"><p className="mg-brand-kicker">ENGINEERING NOTES</p><h2>把性能拆开来看。</h2></div>{model.systems?.length > 0 && <div className="mg-model-systems">{model.systems.map(system => <article key={system.label}><span>{system.label}</span><h3>{system.title}</h3><p>{system.content}</p></article>)}</div>}<div className="mg-model-tech">{model.techDeck?.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{item.title}</h3><p>{item.content}</p></div></article>)}</div></section>}
    {model.timeline?.length > 0 && <section className="mg-model-timeline"><div className="mg-brand-section-heading"><p className="mg-brand-kicker">A LINE THROUGH TIME</p><h2>{model.timelineTitle || '放回时间里理解。'}</h2></div><div>{model.timeline.map(event => <article key={`${event.year}-${event.title}`}><span>{event.year}</span><div><h3>{event.title}</h3><p>{event.content}</p></div></article>)}</div></section>}
    {model.closingPoints?.length > 0 && <div className="mg-model-closing" aria-label="车型理解关键词">{model.closingPoints.map(point => <span key={point}>{point}</span>)}</div>}
    <section className="mg-model-sources" id="model-sources"><div><p className="mg-brand-kicker">FURTHER READING</p><h2>资料来源</h2></div><ul>{model.sources.map(source => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title}<ExternalLink size={14} /></a></li>)}</ul></section>
    <nav className="mg-model-next" aria-label="同品牌其他车型"><p className="mg-brand-kicker">继续阅读 · {brand.name.replace(/\n/g, '')}</p>{siblings.map(story => <Link key={story.slug} to={`/brands/${brandSlug}/${story.slug}`}><span>{story.displayName || story.model}</span><ArrowRight size={18} /></Link>)}</nav>
  </article>;
}
