import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { brands } from '../../data/brands.js';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { BrandPhoto, BrandLogo, PhotoCredit } from './BrandVisual.jsx';
import './brands.css';

export default function BrandsIndex() {
  useDocumentTitle('品牌故事');
  return <div className="mg-brand-page">
    <header className="mg-brand-index-head">
      <div><p className="mg-brand-kicker">THE MAKERS · 品牌故事</p><h1>同一条北环，<br /><em>不同的答案。</em></h1></div>
      <p>从耐力赛车到公路跑车，每个品牌都带着自己的问题来到这里。沿着代表车型，读懂数字背后的工程选择。</p>
    </header>
    <nav className="mg-brand-jump" aria-label="跳转到品牌"><span>{String(brands.length).padStart(2, '0')} 个品牌</span>{brands.map(brand => <a key={brand.slug} href={`#maker-${brand.slug}`}>{brand.name.replace(/\n/g, '')}</a>)}</nav>
    <section className="mg-brand-collection" aria-label="品牌目录">
      {brands.map((brand, index) => <article className="mg-brand-entry" id={`maker-${brand.slug}`} key={brand.slug}>
        <figure className="mg-brand-entry-figure"><Link className="mg-brand-entry-photo" to={`/brands/${brand.slug}`} aria-label={`阅读 ${brand.name.replace(/\n/g, '')} 品牌故事`}><BrandPhoto basename={brand.heroImageBasename} alt={`${brand.name.replace(/\n/g, '')} 代表车型`} eager={index === 0} /></Link><PhotoCredit credit={brand.heroCredit} href={brand.heroSourceHref} /></figure>
        <div className="mg-brand-entry-copy"><div className="mg-brand-entry-label"><span>{String(index + 1).padStart(2, '0')} / {brand.status}</span><BrandLogo brand={brand} /></div><h2><Link to={`/brands/${brand.slug}`}>{brand.name.replace(/\n/g, '')}</Link></h2><p>{brand.story || brand.focus}</p><div className="mg-brand-tags">{brand.keywords.map(tag => <span key={tag}>{tag}</span>)}</div><Link className="mg-brand-text-link" to={`/brands/${brand.slug}`}>阅读品牌故事 <ArrowRight size={18} /></Link></div>
      </article>)}
    </section>
    <aside className="mg-brand-outro"><p className="mg-brand-kicker">BEYOND THE NUMBERS</p><h2>理解一台车，再读一圈的时间。</h2><Link className="mg-brand-text-link" to="/lap-times">查看圈速档案 <ArrowRight size={18} /></Link></aside>
  </div>;
}
