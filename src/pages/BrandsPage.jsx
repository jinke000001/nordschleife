import { Flag, Gauge, TimerReset } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import { brands } from '../data/brands.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import '../styles/pages/brands.css';

export default function BrandsPage() {
  useDocumentTitle('品牌故事');
  return (
    <section className="page-section brand-page">
      <SectionHeader eyebrow="Brand Stories" title="纽北品牌陈列馆" titleTag="h1">
        这里不做单纯的圈速榜。每个品牌都会被放回工程路线、代表车型、赛事表现和车迷记忆里，看它为什么要来北环证明自己。
      </SectionHeader>

      <div className="brand-stage">
        <div className="brand-manifesto">
          <TimerReset size={28} />
          <h2>先看故事，再看数字</h2>
          <p>
            纽北成绩之所以迷人，不只是因为一串时间，而是因为每个品牌都把自己的性格压进了这 20 多公里：
            有的讲耐力赛工程，有的讲性能轿车，有的讲超跑戏剧性，也有的把玩家记忆和真实赛道连在一起。
          </p>
          <div className="brand-principles" aria-label="品牌故事策展方向">
            <span>
              <Flag size={18} />
              代表车型
            </span>
            <span>
              <Gauge size={18} />
              技术关键词
            </span>
            <span>
              <TimerReset size={18} />
              圈速背景
            </span>
          </div>
        </div>

        <div className="brand-grid">
          {brands.map((brand) => {
            const logoPath = brand.logoBasename ? `/logos/${brand.logoBasename}.svg` : null;
            return (
              <article className="brand-card brand-card-logo" key={brand.name}>
                {logoPath && (
                  <>
                    <img className="brand-card-logo-bg" src={logoPath} alt="" loading="lazy" />
                    <div className="brand-card-photo-overlay" />
                  </>
                )}
                <div className="brand-card-photo-content">
                  <span>{brand.status}</span>
                  <h3>{brand.name}</h3>
                  <p className="brand-model">{brand.heroModel}</p>
                  <p className="brand-focus">{brand.focus}</p>
                  <div className="brand-keywords" aria-label={`${brand.name} 关键词`}>
                    {brand.keywords.map((keyword) => (
                      <small key={keyword}>{keyword}</small>
                    ))}
                  </div>
                  <Link className="brand-card-link" to={`/brands/${brand.slug}`} aria-label={`查看品牌故事：${brand.name}`}>
                    查看品牌故事
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
