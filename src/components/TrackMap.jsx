import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCornerBySlug } from '../data/corners.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import { trackLabels } from '../data/track-labels.js';
import TrackElevationRibbon from './TrackElevationRibbon.jsx';

const TRACK_FULL_LENGTH = 1905.97;
// Path data adapted from JJYing/Nurburgring-Map, MIT License.
const FLOW_TRACK_PATH =
  'M246.6 482.9c-.8-.8-1.6-1.7-2.4-2.8l-1.7-2.3c-3.7-5.6-2.8-7-6.9-7.3-2-.1-4.3 0-6.9 4.7a23.2 23.2 0 0 1-5 6.4c-4.2 3.8-8.7 7-14.2 7-5.8 0-7.6-3-14.4-5.2a30.4 30.4 0 0 0-15.4-.6c-2 1-1.8 1.2-3.4 1.4-2.1.2-4-1-5.6-2.6-2.4-2.6-3.4-4.4-5.7-7.4-1.7-2.3-4.5-3.6-6-6.2-1-1.8-.6-2.7-3-4.5-1.6-1.2-8.7-1.1-13.4-2.8-3.7-1.2-3.3-6.1-5.8-9.9-2.4-3.7-14.7-11-21.7-16.9-8.4-8.8-8.7-9.6-12-13.4-3.4-3.8-6.4-6.7-9-10.4a15.6 15.6 0 0 1-3.1-10.9c1-9.8 6.7-17.6 6.8-28.7 0-7.7.6-11.2-1.2-23.8-.7-5-2.4-8.5-4.3-13.3a305 305 0 0 0-15-32.4c-2.2-4-5.3-7-9-9.2-4-2.3-8.8-4.3-13.3-6.6a5.6 5.6 0 0 1-3-6c1-4.4 7.3-4.7 14.7-8.2 9-4.2 13-6.7 18.2-11.2 6.3-5.5 12-9.3 18.1-15.3 4.3-4.2 8-6.8 11.5-13.7 1.9-3.8 3.2-7 4.3-11.4 1.5-6.5.1-12.2 1.1-15.7 1.2-4.2 6-5 6.6-8 .6-3-2.8-6.3-1.2-10.6 1-2.6 7.6-6 12.3-10.2 3.9-3.3 3.3-4.2 7-8.1 7.2-7.7 7.7-6.6 15.3-15.2a24 24 0 0 0 6.4-11.5c1.2-5.9-1.5-11.2-3.6-16-.7-1.5-1.9-2.4-3.8-3.2-1.7-.6-4.3.2-6.1-.5-3-1.2-5-2.1-7.8-4.4-3.6-2.8-5.1-5.3-5.3-7.4-.2-2.7 1.4-3.7 3.4-4.6a53 53 0 0 0 15.4-10.2c2.5-2.6 1.2-5.9 2.7-9.4A23 23 0 0 1 166 77c3.3-3.2 8-4.9 13.7-2.3a57.6 57.6 0 0 1 16.4 11c1.5 1.4 1 6 4.2 5.8 4.3-.1 2.1-3 6.6-5.1 7-3.4 16.7-3.8 23.8-2 3.4.8 7.2 2.8 10.6 2.3 4.4-.7 6-4.4 6.4-6.1.9-4-.1-9.7 2-12.5 2.3-2.9 3.4-4.4 17.5-9 13.4-4.3 18.2-1.8 25-4.5 8-3 14.2-13 20.4-12.6 3.2.2 6.3 2 6.9 5.7 1 6.8-.6 13.5-.7 19.7 0 14 4 21.7 6.7 24.8 5.5 6 11.4 9.5 18 12.6 5.1 2.4 9.2 4.7 16.2 4.8 13.2.2 23.3 0 33.4 2.4a53.4 53.4 0 0 1 18.7 6.9c4.2 2.9 6.6 5.6 10.6 8.1 7.6 4.7 13 6.8 19.2 6 5-.8 11.9-5.4 17.1-9.8 4.5-3.7 8.5-9.4 14.2-10.6 8.6-1.9 12.8-.8 18.5-3.1 5-2 7.6-2.1 9-.8 3.5 3.3.9 7-1.6 8.8-5.8 4.4-15.5 12.2-18.3 13-6.8 1.6-5.5 7.3-4 8.8 3.5 3.5 8.8 1 9.5-1.6.5-1.9 2-3 4.8-5.1a48 48 0 0 1 13-6.4c2.8-1 4.6-2 11.9-2.8 5.3-.6 10.7-7.5 15-13.6 5.4-8 .3-9.3 1.5-13.8 1-3.8 2-7.7 7-11 4.1-3 26.3 4.5 28 5.5 3.9 2.4 5.8 7 9.4 8.8 4.3 2 6 2 9.5 3.6a38 38 0 0 1 10.3 15.3c.2 5-8.4 18.5-3.3 23 4.5 4 5.9 2.8 11 5.3 3.4 1.8 3.4 7.5 3.7 11.4.2 3.8 0 8.9-3 10.5-6.2 3.3-14.6-1.7-21.6.2-3.7 1-2.4 5.9-7 11.8-5.5 6.8-8 14.4-8 18.7 0 6.3.6 14.3 0 20-.2 3-2 6.5-4.7 7.8-4.5 2.3-8.8 1.9-12.5 4.6-4 2.8-6.4 6-10.1 10-3.6 4-4.3 6.4-6.5 11.3-2 4.2-3.6 6-5.9 8.7-2 2.4-5.1 3.5-7.7 5.3-2.5 1.6-4.7 4.3-8.9 5.4-11.3 3-21.9 7.8-32.7 8.6-7 .5-9.5-8.4-16.5-8.3-2.9 0-5.7 1.7-8.2 3.4-4.3 3-8.6 5.1-8.3 8.7 1 11.5 22.4 10.7 28 19.6 2 3 4.7 7 4.2 14-.2 3.9-3.3 7-6.2 9.3-6.6 5.4-29.9 18.6-45.1 27.8L351.8 402c-13.8 8.7-35.7 21.7-41.6 26.1-14.2 10.8-26.5 31-29.7 35.7-2 2.9-8.9 7.7-9.6 9.9-1 2.5-.7 7.4-3.2 9.2-3 2.1-4.7 1.3-7.8 1.3-2.7 0-2 .7-4.9 1.3-1.8.4-5 .3-8.3-2.6';

// Coordinates and progress ranges follow the normalized map-space pattern from JJYing/Nurburgring-Map.


const guideLabels = trackLabels.filter((label) => label.slug);

function getActiveIndex(slug) {
  const index = trackLabels.findIndex((label) => (label.slug === slug || label.de === slug));
  return index >= 0 ? index : 5;
}

export default function TrackMap({ compact = false, activeSlug = null, onSelectCorner = null, selectionOnly = false, showElevation = true, guideMode = false }) {
  const navigate = useNavigate();
  const pathId = `nord-flow-${useId().replace(/:/g, '')}`;
  const mapRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(() => getActiveIndex(activeSlug));
  const [mapLanguage, setMapLanguage] = useState('zh');
  const [allLabels, setAllLabels] = useState(false);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [isPageVisible, setIsPageVisible] = useState(() => !document.hidden);
  const prefersReducedMotion = usePrefersReducedMotion();
  const activeCorner = trackLabels[activeIndex] ?? trackLabels[0];
  const normalizedProgress = activeCorner.ed;
  const segmentLength = Math.max(0.004, activeCorner.ed - activeCorner.st);
  const activeName = mapLanguage === 'de' ? activeCorner.de : activeCorner.zh;
  const activeCornerRecord = activeCorner.slug ? getCornerBySlug(activeCorner.slug) : null;
  const activeNumber = activeCornerRecord ? activeCornerRecord.order : activeIndex + 1;

  useEffect(() => {
    setActiveIndex(getActiveIndex(activeSlug));
  }, [activeSlug]);

  useEffect(() => {
    const onVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(() => {
    const node = mapRef.current;
    if (!node || !('IntersectionObserver' in window)) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsMapVisible(entry.isIntersecting),
      { root: null, rootMargin: '120px 0px', threshold: 0.05 }
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (compact || activeSlug || isAutoPaused || !isMapVisible || !isPageVisible || prefersReducedMotion) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const currentGuideIndex = guideLabels.findIndex((label) => trackLabels.indexOf(label) === currentIndex);
        const nextGuide = guideLabels[(currentGuideIndex + 1 + guideLabels.length) % guideLabels.length];
        return trackLabels.indexOf(nextGuide);
      });
    }, 2600);

    return () => window.clearInterval(interval);
  }, [activeSlug, compact, isAutoPaused, isMapVisible, isPageVisible, prefersReducedMotion]);

  const selectCorner = (index, interaction = 'preview') => {
    setIsAutoPaused(true);
    setActiveIndex(index);
    onSelectCorner?.(trackLabels[index], interaction);
  };

  return (
    <section ref={mapRef} className={`track-map${compact ? ' compact' : ''}${guideMode ? ' track-map-guided' : ''}`} aria-label="纽北真实赛道图">
      {guideMode && <button className="guide-map-label-toggle" type="button" aria-pressed={allLabels} onClick={() => setAllLabels(!allLabels)}>{allLabels ? '只看导览三站' : '显示全部地名'}</button>}
      <div className="map-stage">
        <div className="map-grid" aria-hidden="true" />
        <div className="official-map-frame">
          <svg
            className="flow-track-svg"
            viewBox="0 0 660 530"
            aria-hidden="true"
            style={{
              '--track-full': TRACK_FULL_LENGTH,
              '--progress-length': prefersReducedMotion
                ? TRACK_FULL_LENGTH
                : TRACK_FULL_LENGTH * normalizedProgress,
              '--segment-length': TRACK_FULL_LENGTH * segmentLength,
              '--segment-offset': -TRACK_FULL_LENGTH * activeCorner.st
            }}
          >
            <defs>
              <path id={pathId} d={FLOW_TRACK_PATH} />
            </defs>
            <use href={`#${pathId}`} className="flow-track-shadow" />
            <use href={`#${pathId}`} className="flow-track-base-wide" />
            <use href={`#${pathId}`} className="flow-track-base" />
            <use href={`#${pathId}`} className="flow-track-progress-glow-outer" />
            <use href={`#${pathId}`} className="flow-track-progress-glow-inner" />
            <use href={`#${pathId}`} className="flow-track-progress" />
            <use href={`#${pathId}`} className="flow-track-segment-glow-outer" />
            <use href={`#${pathId}`} className="flow-track-segment-glow-inner" />
            <use href={`#${pathId}`} className="flow-track-segment" />
          </svg>
          <div className="track-label-layer" aria-label="纽北弯角名称图层">
            {trackLabels.map((label, index) => {
              if (guideMode && !allLabels && !['fuchsroehre', 'karussell', 'doettinger-hoehe'].includes(label.slug)) return null;
              const labelClass = `track-label ${label.h} ${label.v}${label.slug ? ' has-page' : ''}${
                index === activeIndex ? ' active' : ''
              }`;
              const style = { '--x': label.x, '--y': label.y };
              const labelName = mapLanguage === 'de' ? label.de : label.zh;

              return (
                <button
                  key={label.de}
                  type="button"
                  className={labelClass}
                  style={style}
                  aria-label={`${label.zh} / ${label.de}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => {
                    selectCorner(index, 'activate');
                    if (label.slug && !selectionOnly) {
                      navigate(`/corners/${label.slug}`);
                    }
                  }}
                  onFocus={() => selectCorner(index)}
                  onMouseEnter={() => selectCorner(index)}
                >
                  {labelName}
                </button>
              );
            })}
          </div>
          <div className="map-language-toggle" aria-label="地图语言切换">
            <button
              type="button"
              className={mapLanguage === 'zh' ? 'active' : undefined}
              onClick={() => setMapLanguage('zh')}
            >
              中
            </button>
            <button
              type="button"
              className={mapLanguage === 'de' ? 'active' : undefined}
              onClick={() => setMapLanguage('de')}
            >
              DE
            </button>
          </div>
          <div className="map-active-callout">
            <span>{String(activeNumber).padStart(2, '0')}</span>
            <strong>{activeName}</strong>
          </div>
          {!compact ? (
            <div className="mobile-map-guide" aria-label="手机端弯角巡游导览">
              <article>
                <span>{String(activeNumber).padStart(2, '0')}</span>
                <div>
                  <strong>{activeName}</strong>
                  <p>{activeCornerRecord?.explanation ?? '红色进度会沿赛道巡游，帮助你建立整圈空间感。'}</p>
                </div>
                {activeCorner.slug ? (
                  <button type="button" onClick={() => navigate(`/corners/${activeCorner.slug}`)}>
                    进入
                  </button>
                ) : null}
              </article>
              <div className="mobile-map-tabs" aria-label="重点弯角切换">
                {(selectionOnly ? trackLabels : guideLabels).map((label) => {
                  const index = trackLabels.indexOf(label);
                  const corner = getCornerBySlug(label.slug);
                  const labelName = mapLanguage === 'de' ? label.de : label.zh;

                  return (
                    <button
                      key={label.de}
                      type="button"
                      className={index === activeIndex ? 'active' : undefined}
                      onClick={() => selectCorner(index, 'activate')}
                      aria-pressed={index === activeIndex}
                    >
                      <span>{String(corner?.order ?? index + 1).padStart(2, '0')}</span>
                      {labelName}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
        {!compact && showElevation ? (
          <TrackElevationRibbon
            activeSlug={activeCorner?.slug}
            onSelectCorner={(slug) => {
              const idx = trackLabels.findIndex((l) => l.slug === slug);
              if (idx >= 0) selectCorner(idx);
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
