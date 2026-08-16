import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, Gauge, MapPin, Play, ShieldAlert } from 'lucide-react';
import InfoBlock from '../components/InfoBlock.jsx';
import TrackMap from '../components/TrackMap.jsx';
import OptimizedImage from '../components/OptimizedImage.jsx';
import { getAdjacentCorners, getCornerBySlug } from '../data/corners.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

export default function CornerDetailPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const corner = getCornerBySlug(slug);
  useDocumentTitle(corner ? `${corner.name} - 弯角详情` : '弯角详情');

  if (!corner) {
    return <Navigate to="/corners" replace />;
  }

  const isEnhanced = corner.storySections && corner.storySections.length > 0;
  const { previous, next } = getAdjacentCorners(slug);

  return (
    <article className="detail-page">
      <header className="detail-hero" data-bg-text={corner.name}>
        <button
          className="back-link"
          type="button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={17} /> 返回
        </button>
        <p className="eyebrow">Corner #{String(corner.order).padStart(2, '0')} · {corner.section}</p>
        <h1>{corner.name}</h1>
        <p className="detail-subtitle">{corner.chineseName} · {corner.explanation}</p>
        <div className="tag-row">
          {corner.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </header>

      <div className="detail-layout">
        <section className="detail-main">
          <MediaBay corner={corner} />

          {isEnhanced ? (
            <>
              {corner.storySections.map((section) => (
                <section className="info-block model-story-block" key={section.title}>
                  <p className="eyebrow">{section.eyebrow}</p>
                  <h2>{section.title}</h2>
                  <p>{section.content}</p>
                </section>
              ))}

              {corner.systems && (
                <section className="model-system-strip" aria-label={`${corner.name} 地形特征`}>
                  {corner.systems.map((item) => (
                    <article key={item.label}>
                      <span>{item.label}</span>
                      <h2>{item.title}</h2>
                      <p>{item.content}</p>
                    </article>
                  ))}
                </section>
              )}
            </>
          ) : (
            <>
              <InfoBlock
                title="中文解释与所在赛段"
                content={`${corner.chineseName}，位于 ${corner.section}。${corner.location}`}
              />
              <InfoBlock title="名字来源" content={corner.origin} />
              <InfoBlock title="历史背景" content={corner.history} />
              <InfoBlock title="驾驶特点" content={corner.driving} />
              <InfoBlock title="为什么这个弯角有名" content={corner.fame} />
            </>
          )}

          {corner.techDeck && (
            <section className="model-tech-section" aria-label="驾驶技术要点">
              <div className="model-section-heading">
                <p className="eyebrow">Driving Technique</p>
                <h2>驾驶技术要点</h2>
              </div>
              <div className="model-tech-grid">
                {corner.techDeck.map((item, index) => (
                  <article key={item.title}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </section>

        <aside className="detail-aside">
          <div className="spec-card">
            <h2>弯角档案</h2>
            <dl>
              <div>
                <dt><MapPin size={16} /> 位置</dt>
                <dd>{corner.location}</dd>
              </div>
              <div>
                <dt><ShieldAlert size={16} /> 危险等级</dt>
                <dd>{corner.dangerLevel}</dd>
              </div>
              <div>
                <dt><Gauge size={16} /> 驾驶难度</dt>
                <dd>{corner.difficulty}</dd>
              </div>
              <div>
                <dt>关键词</dt>
                <dd>{corner.tags.join(' / ')}</dd>
              </div>
              <div>
                <dt>阅读重点</dt>
                <dd>{corner.readingFocus}</dd>
              </div>
            </dl>
          </div>
          <TrackMap compact activeSlug={corner.slug} />

          {corner.readingGuide && (
            <section className="spec-card model-reading-card">
              <h2>阅读导览</h2>
              <ol>
                {corner.readingGuide.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          )}
        </aside>
      </div>

      {corner.timeline && (
        <section className="model-timeline-section" aria-label={`${corner.name} 时间线`}>
          <div className="model-section-heading">
            <p className="eyebrow">Timeline</p>
            <h2>弯角时间线</h2>
          </div>
          <div className="model-timeline">
            {corner.timeline.map((event) => (
              <article key={`${event.year}-${event.title}`}>
                <span>{event.year}</span>
                <h3>{event.title}</h3>
                <p>{event.content}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <nav className="detail-nav" aria-label="相邻弯角">
        {previous ? (
          <Link to={`/corners/${previous.slug}`}>
            <ArrowLeft size={18} />
            <span>
              上一弯
              <strong>{previous.name}</strong>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/corners/${next.slug}`}>
            <span>
              下一弯
              <strong>{next.name}</strong>
            </span>
            <ArrowRight size={18} />
          </Link>
        )}
      </nav>
    </article>
  );
}

function MediaBay({ corner }) {
  const media = corner.media;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="media-bay" aria-label={`${corner.name} 赛段印象`}>
      <div className={media.image ? 'media-frame has-photo' : 'media-frame'}>
        {media.image ? (
          <>
            {!imageLoaded && <div className="media-skeleton" />}
            <OptimizedImage
              basename={media.basename}
              alt={`${corner.name} 赛段照片`}
              className={`media-photo ${imageLoaded ? 'is-loaded' : ''}`}
              loading="lazy"
              decoding="async"
              width="1200"
              height="750"
              style={media.objectPosition ? { objectPosition: media.objectPosition } : undefined}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : null}
        {!media.image && <div className="media-grid" aria-hidden="true" />}
        {!media.image && (
          <div className="media-visual" aria-hidden="true">
            <span className="media-corner-index">{String(corner.order).padStart(2, '0')}</span>
            <span className="media-track-line" />
            <span className="media-track-line secondary" />
            <span className="media-apex-dot" />
          </div>
        )}
        <div className="media-overlay">
          <p className="eyebrow">Stage Impression</p>
          <h2>{media.title}</h2>
          <p>{media.caption}</p>
          <div className="media-actions" aria-label="影像资料类型">
            <span><Camera size={16} /> Still</span>
            {!media.image && (
              <span><Play size={16} /> Clip</span>
            )}
          </div>
        </div>
      </div>
      <p className="media-credit">
        {media.sourceHref ? (
          <a href={media.sourceHref} target="_blank" rel="noreferrer">
            {media.credit}
          </a>
        ) : (
          media.credit
        )}
      </p>
    </section>
  );
}
