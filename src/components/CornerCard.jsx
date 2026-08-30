import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CornerCard({ corner, compact = false, priority = false }) {
  const hasPhoto = corner.media?.type === 'photo';
  const mediaImage = corner.media?.image;

  if (hasPhoto && mediaImage) {
    return (
      <article className={compact ? 'corner-card corner-card-photo compact' : 'corner-card corner-card-photo'}>
        <img
          className="corner-card-bg"
          src={mediaImage}
          alt={corner.name}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
        />
        <div className="corner-card-photo-overlay" />
        <div className="corner-card-photo-content">
          <div className="card-kicker">
            <span>#{String(corner.order).padStart(2, '0')}</span>
            <span>{corner.section}</span>
          </div>
          <h2>
            <Link to={`/corners/${corner.slug}`}>{corner.name}</Link>
          </h2>
          <p className="corner-cn">{corner.chineseName} · {corner.explanation}</p>
          {!compact && <p className="corner-story">{corner.story}</p>}
          <Link className="text-link corner-card-photo-link" to={`/corners/${corner.slug}`}>
            进入详情 <ArrowUpRight size={16} />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className={compact ? 'corner-card compact' : 'corner-card'}>
      <div className="card-kicker">
        <span>#{String(corner.order).padStart(2, '0')}</span>
        <span>{corner.section}</span>
      </div>
      <h2>
        <Link to={`/corners/${corner.slug}`}>{corner.name}</Link>
      </h2>
      <p className="corner-cn">{corner.chineseName} · {corner.explanation}</p>
      {!compact && (
        <>
          <p className="corner-story">{corner.story}</p>
          <dl className="corner-facts">
            <div>
              <dt>位置</dt>
              <dd>
                <MapPin size={14} />
                {corner.location}
              </dd>
            </div>
            <div>
              <dt>名字来源</dt>
              <dd>{corner.origin}</dd>
            </div>
            <div>
              <dt>历史背景</dt>
              <dd>{corner.history}</dd>
            </div>
            <div>
              <dt>驾驶特点</dt>
              <dd>{corner.driving}</dd>
            </div>
            <div>
              <dt>为什么有名</dt>
              <dd>{corner.fame}</dd>
            </div>
          </dl>
        </>
      )}
      <div className="tag-row">
        {corner.tags.slice(0, compact ? 3 : 5).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <Link className="text-link" to={`/corners/${corner.slug}`}>
        进入详情 <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
