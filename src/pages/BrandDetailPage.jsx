import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Car, Gauge, TimerReset } from 'lucide-react';
import InfoBlock from '../components/InfoBlock.jsx';
import { getAdjacentBrands, getBrandBySlug } from '../data/brands.js';
import useScrollReveal from '../hooks/useScrollReveal.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function BrandDetailPage() {
  useScrollReveal();
  const { slug } = useParams();
  const brand = getBrandBySlug(slug);
  useDocumentTitle(brand ? `${brand.name} - 品牌故事` : '品牌故事');

  if (!brand) {
    return <Navigate to="/brands" replace />;
  }

  const { previous, next } = getAdjacentBrands(slug);
  const detailBlocks = brand.detailBlocks ?? [
    {
      title: '品牌与纽北的关系',
      content: brand.relationship
    },
    {
      title: '代表车型线索',
      content: `${brand.heroModel} 可以作为理解这个品牌的第一组入口：先看车型性格，再回到北环这条线索里理解它们为什么值得被放在一起。`
    },
    {
      title: '技术关键词',
      content: brand.technology
    },
    {
      title: '北环叙事线索',
      content: brand.lapStory
    }
  ];

  return (
    <article className="detail-page brand-detail-page">
      <header className="detail-hero brand-detail-hero">
        <Link className="back-link" to="/brands">
          <ArrowLeft size={17} /> 返回品牌陈列馆
        </Link>
        <div className="brand-detail-hero-grid">
          <div className="brand-detail-hero-text">
            <p className="eyebrow">{brand.status}</p>
            <h1>
              {brand.name.split('\n').map((line, i, arr) => (
                <span key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="detail-subtitle">{brand.focus}</p>
            <div className="tag-row">
              {brand.keywords.map((keyword) => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          </div>
          {brand.logoBasename && (
            <figure className="brand-hero-visual">
              <img
                className="brand-hero-logo"
                src={`/logos/${brand.logoBasename}.svg`}
                alt={brand.name}
              />
            </figure>
          )}
        </div>
      </header>

      <div className="detail-layout">
        <section className="detail-main">
          <ModelStoryGrid stories={brand.modelStories} brandSlug={brand.slug} />
          {detailBlocks.map((block) => (
            <InfoBlock key={block.title} title={block.title} content={block.content} variant="reveal-on-scroll" />
          ))}
        </section>

        <aside className="detail-aside reveal-on-scroll">
          <div className="spec-card">
            <h2>品牌档案</h2>
            <dl>
              <div>
                <dt>
                  <Car size={16} />
                  代表车型
                </dt>
                <dd>{brand.heroModel}</dd>
              </div>
              <div>
                <dt>
                  <Gauge size={16} />
                  技术方向
                </dt>
                <dd>{brand.keywords.join(' / ')}</dd>
              </div>
              <div>
                <dt>
                  <TimerReset size={16} />
                  阅读线索
                </dt>
                <dd>{brand.archiveNote ?? '先通过代表车型、技术方向和品牌关系进入故事，再把圈速放回具体背景里理解。'}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      <nav className="detail-nav" aria-label="相邻品牌">
        {previous ? (
          <Link to={`/brands/${previous.slug}`}>
            <ArrowLeft size={18} />
            <span>
              上一品牌
              <strong>{previous.name}</strong>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/brands/${next.slug}`}>
            <span>
              下一品牌
              <strong>{next.name}</strong>
            </span>
            <ArrowRight size={18} />
          </Link>
        )}
      </nav>
    </article>
  );
}

function ModelStoryGrid({ stories, brandSlug }) {
  return (
    <section className="model-story-section reveal-on-scroll" aria-label="代表车型故事">
      <div className="model-story-heading">
        <p className="eyebrow">Model Stories</p>
        <h2>代表车型故事</h2>
      </div>
      <div className="model-story-grid">
        {stories.map((story) => {
          const displayName = story.displayName || story.model;
          const isLongName = displayName.length > 15;

          return (
            <article className={`model-story-card${story.slug ? ' model-story-card-linked' : ''}`} key={story.model}>
              <span>{story.type}</span>
              <h3 className={isLongName ? 'model-story-title-long' : undefined} title={story.model}>
                {displayName}
              </h3>
              <strong>{story.hook}</strong>
              <p>{story.story}</p>
              <div className="brand-keywords" aria-label={`${story.model} 关键词`}>
                {story.tags.map((tag) => (
                  <small key={tag}>{tag}</small>
                ))}
              </div>
              {story.slug ? (
                <Link className="model-story-link" to={`/brands/${brandSlug}/${story.slug}`}>
                  进入车型展厅
                  <ArrowRight size={16} />
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
