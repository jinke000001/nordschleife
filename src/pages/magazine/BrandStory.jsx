import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getAdjacentBrands, getBrandBySlug } from '../../data/brands.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { BrandPhoto, BrandLogo, PhotoCredit } from './BrandVisual.jsx';
import './brands.css';

export default function BrandStory() {
  const { slug } = useParams();
  const brand = getBrandBySlug(slug);
  useDocumentTitle(brand ? `${brand.name.replace(/\n/g, '')} · 品牌故事` : '品牌故事');
  if (!brand) return <Navigate to="/brands" replace />;
  const { previous, next } = getAdjacentBrands(slug);
  const blocks = brand.detailBlocks ?? [{ title: '品牌与纽北', content: brand.relationship }, { title: '技术性格', content: brand.technology }, { title: '北环故事', content: brand.lapStory }];
  return <article className="mg-brand-page">
    <header className="mg-brand-story-head">
      <Link className="mg-brand-back" to="/brands"><ArrowLeft size={16} /> 所有品牌</Link>
      <div className="mg-brand-story-title"><div><p className="mg-brand-kicker">{brand.status}</p><h1>{brand.name.replace(/\n/g, '')}</h1></div><BrandLogo key={slug} brand={brand} /></div>
      <div className="mg-brand-story-intro"><p>{brand.focus}</p><div className="mg-brand-tags">{brand.keywords.map(tag => <span key={tag}>{tag}</span>)}</div></div>
    </header>
    <figure className="mg-brand-story-photo"><BrandPhoto key={brand.heroImageBasename} basename={brand.heroImageBasename} alt={`${brand.name.replace(/\n/g, '')} 代表车型`} eager /><PhotoCredit credit={brand.heroCredit} href={brand.heroSourceHref} /></figure>
    <section className="mg-brand-models" aria-labelledby="mg-brand-model-heading">
      <div className="mg-brand-section-heading"><p className="mg-brand-kicker">SELECTED MODELS</p><h2 id="mg-brand-model-heading">从这些车开始。</h2><p>{brand.archiveNote || brand.heroModel}</p></div>
      <div className="mg-brand-model-list">{brand.modelStories.map((story, index) => <article key={story.model} className="mg-brand-model-entry"><span className="mg-brand-model-number">{String(index + 1).padStart(2, '0')}</span><div><p className="mg-brand-kicker">{story.type}</p><h3>{story.slug ? <Link to={`/brands/${slug}/${story.slug}`}>{story.displayName || story.model}</Link> : (story.displayName || story.model)}</h3><strong>{story.hook}</strong><p>{story.story}</p><div className="mg-brand-tags">{story.tags.map(tag => <span key={tag}>{tag}</span>)}</div>{story.slug && <Link className="mg-brand-text-link" to={`/brands/${slug}/${story.slug}`}>阅读车型档案 <ArrowRight size={17} /></Link>}</div></article>)}</div>
    </section>
    <section className="mg-brand-essay" aria-label="品牌与纽北的故事"><div><p className="mg-brand-kicker">THE BIGGER PICTURE</p><h2>速度之外，<br />还有什么？</h2></div><div>{blocks.map(block => <section key={block.title}><h3>{block.title}</h3><p>{block.content}</p></section>)}</div></section>
    <nav className="mg-brand-adjacent" aria-label="相邻品牌">{previous ? <Link to={`/brands/${previous.slug}`}><ArrowLeft size={19} /><span>上一篇<strong>{previous.name.replace(/\n/g, '')}</strong></span></Link> : <span />}{next && <Link to={`/brands/${next.slug}`}><span>下一篇<strong>{next.name.replace(/\n/g, '')}</strong></span><ArrowRight size={19} /></Link>}</nav>
  </article>;
}
