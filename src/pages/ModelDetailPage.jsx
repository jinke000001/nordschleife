import { ArrowLeft, ExternalLink, Gauge, Layers, TimerReset, Wind } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBrandBySlug } from '../data/brands.js';
import { getModelByBrandAndSlug } from '../data/models.js';
import OptimizedImage from '../components/OptimizedImage.jsx';
import useScrollReveal from '../hooks/useScrollReveal.js';
import useParallax from '../hooks/useParallax.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function ModelDetailPage() {
  useScrollReveal();
  const heroParallaxRef = useParallax(0.22);
  const { brandSlug, modelSlug } = useParams();
  const brand = getBrandBySlug(brandSlug);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    getModelByBrandAndSlug(brandSlug, modelSlug)
      .then((m) => {
        if (!isCurrent) return;
        setModel(m);
      })
      .catch(() => {
        if (!isCurrent) return;
        setModel(null);
      })
      .finally(() => {
        if (!isCurrent) return;
        setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [brandSlug, modelSlug]);

  useDocumentTitle(model ? `${model.name} - 车型档案` : '车型档案');
  const closingIcons = [Wind, Gauge, Layers, TimerReset];

  if (!brand) {
    return <Navigate to="/brands" replace />;
  }

  if (loading) {
    return <div className="detail-page model-detail-page"><div className="page-fallback" /></div>;
  }

  if (!model) {
    return <Navigate to={`/brands/${brandSlug}`} replace />;
  }

  const heroTitle = model.heroTitle || model.name;
  const isLongHeroTitle = heroTitle.length > 16;

  return (
    <article className="detail-page model-detail-page">
      <header className="model-hero" data-bg-text={brand.name}>
        <div className="model-hero-copy">
          <Link className="back-link" to={`/brands/${brand.slug}`}>
            <ArrowLeft size={17} /> 返回 {brand.name}
          </Link>
          <p className="eyebrow">{model.status}</p>
          <h1 className={isLongHeroTitle ? 'model-hero-title-long' : undefined}>{heroTitle}</h1>
          <p className="detail-subtitle">{model.headline}</p>
        </div>
        <figure ref={heroParallaxRef} className="model-hero-visual model-hero-parallax">
          <OptimizedImage
            basename={model.heroImageBasename}
            alt={`${model.brandName} ${model.name}`}
            width="1600"
            height="1000"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="parallax-img"
            style={model.heroImagePosition ? { objectPosition: model.heroImagePosition } : undefined}
          />
          <figcaption>
            {model.heroSourceHref ? (
              <a href={model.heroSourceHref} target="_blank" rel="noreferrer">
                {model.heroCredit}
              </a>
            ) : (
              model.heroCredit
            )}
          </figcaption>
        </figure>
      </header>

      <section className="model-summary-panel reveal-on-scroll" aria-label={`${model.name} 概览`}>
        <p>{model.summary}</p>
        <div className="model-stat-grid">
          {model.stats.map((stat, index) => (
            <div className={index === 0 ? 'model-stat-featured' : undefined} key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
              <small>{stat.note}</small>
            </div>
          ))}
        </div>
      </section>

      {model.systems ? (
        <section className="model-system-strip reveal-on-scroll" aria-label={`${model.name} 工程系统`}>
          {model.systems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <h2>{item.title}</h2>
              <p>{item.content}</p>
            </article>
          ))}
        </section>
      ) : null}

      <div className="model-detail-layout">
        <main className="model-main">
          {model.storySections.map((section) => (
            <section className="info-block model-story-block reveal-on-scroll" key={section.title}>
              <p className="eyebrow">{section.eyebrow}</p>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}

          <section className="model-tech-section reveal-on-scroll" aria-label="技术展柜">
            <div className="model-section-heading">
              <p className="eyebrow">Technical Gallery</p>
              <h2>技术展柜</h2>
            </div>
            <div className="model-tech-grid">
              {model.techDeck.map((item, index) => (
                <article key={item.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </article>
              ))}
            </div>
          </section>
        </main>

        <aside className="model-aside reveal-on-scroll">
          <section className="spec-card model-reading-card">
            <h2>工程索引</h2>
            <ol>
              {model.readingGuide.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>

          <section className="spec-card model-source-card">
            <h2>资料来源</h2>
            <ul>
              {model.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">
                    {source.title}
                    <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <section className="model-timeline-section reveal-on-scroll" aria-label={`${model.name} 时间线`}>
        <div className="model-section-heading">
          <p className="eyebrow">Timeline</p>
          <h2>{model.timelineTitle || '它站在一条 911 时间线上'}</h2>
        </div>
        <div className="model-timeline">
          {model.timeline.map((event) => (
            <article key={`${event.year}-${event.title}`}>
              <span>{event.year}</span>
              <h3>{event.title}</h3>
              <p>{event.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="model-closing-strip" aria-label="车型理解关键词">
        {(model.closingPoints || [
          '空气动力不是装饰',
          '圈速是系统结果',
          '911 传统被重新解释',
          '完整一圈才是考题'
        ]).map((point, index) => {
          const Icon = closingIcons[index % closingIcons.length];
          return (
            <div key={point}>
              <Icon size={22} />
              <span>{point}</span>
            </div>
          );
        })}
      </section>
    </article>
  );
}
