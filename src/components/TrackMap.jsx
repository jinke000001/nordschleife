import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCornerBySlug } from '../data/corners.js';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';

const TRACK_FULL_LENGTH = 1905.97;
// Path data adapted from JJYing/Nurburgring-Map, MIT License.
const FLOW_TRACK_PATH =
  'M246.6 482.9c-.8-.8-1.6-1.7-2.4-2.8l-1.7-2.3c-3.7-5.6-2.8-7-6.9-7.3-2-.1-4.3 0-6.9 4.7a23.2 23.2 0 0 1-5 6.4c-4.2 3.8-8.7 7-14.2 7-5.8 0-7.6-3-14.4-5.2a30.4 30.4 0 0 0-15.4-.6c-2 1-1.8 1.2-3.4 1.4-2.1.2-4-1-5.6-2.6-2.4-2.6-3.4-4.4-5.7-7.4-1.7-2.3-4.5-3.6-6-6.2-1-1.8-.6-2.7-3-4.5-1.6-1.2-8.7-1.1-13.4-2.8-3.7-1.2-3.3-6.1-5.8-9.9-2.4-3.7-14.7-11-21.7-16.9-8.4-8.8-8.7-9.6-12-13.4-3.4-3.8-6.4-6.7-9-10.4a15.6 15.6 0 0 1-3.1-10.9c1-9.8 6.7-17.6 6.8-28.7 0-7.7.6-11.2-1.2-23.8-.7-5-2.4-8.5-4.3-13.3a305 305 0 0 0-15-32.4c-2.2-4-5.3-7-9-9.2-4-2.3-8.8-4.3-13.3-6.6a5.6 5.6 0 0 1-3-6c1-4.4 7.3-4.7 14.7-8.2 9-4.2 13-6.7 18.2-11.2 6.3-5.5 12-9.3 18.1-15.3 4.3-4.2 8-6.8 11.5-13.7 1.9-3.8 3.2-7 4.3-11.4 1.5-6.5.1-12.2 1.1-15.7 1.2-4.2 6-5 6.6-8 .6-3-2.8-6.3-1.2-10.6 1-2.6 7.6-6 12.3-10.2 3.9-3.3 3.3-4.2 7-8.1 7.2-7.7 7.7-6.6 15.3-15.2a24 24 0 0 0 6.4-11.5c1.2-5.9-1.5-11.2-3.6-16-.7-1.5-1.9-2.4-3.8-3.2-1.7-.6-4.3.2-6.1-.5-3-1.2-5-2.1-7.8-4.4-3.6-2.8-5.1-5.3-5.3-7.4-.2-2.7 1.4-3.7 3.4-4.6a53 53 0 0 0 15.4-10.2c2.5-2.6 1.2-5.9 2.7-9.4A23 23 0 0 1 166 77c3.3-3.2 8-4.9 13.7-2.3a57.6 57.6 0 0 1 16.4 11c1.5 1.4 1 6 4.2 5.8 4.3-.1 2.1-3 6.6-5.1 7-3.4 16.7-3.8 23.8-2 3.4.8 7.2 2.8 10.6 2.3 4.4-.7 6-4.4 6.4-6.1.9-4-.1-9.7 2-12.5 2.3-2.9 3.4-4.4 17.5-9 13.4-4.3 18.2-1.8 25-4.5 8-3 14.2-13 20.4-12.6 3.2.2 6.3 2 6.9 5.7 1 6.8-.6 13.5-.7 19.7 0 14 4 21.7 6.7 24.8 5.5 6 11.4 9.5 18 12.6 5.1 2.4 9.2 4.7 16.2 4.8 13.2.2 23.3 0 33.4 2.4a53.4 53.4 0 0 1 18.7 6.9c4.2 2.9 6.6 5.6 10.6 8.1 7.6 4.7 13 6.8 19.2 6 5-.8 11.9-5.4 17.1-9.8 4.5-3.7 8.5-9.4 14.2-10.6 8.6-1.9 12.8-.8 18.5-3.1 5-2 7.6-2.1 9-.8 3.5 3.3.9 7-1.6 8.8-5.8 4.4-15.5 12.2-18.3 13-6.8 1.6-5.5 7.3-4 8.8 3.5 3.5 8.8 1 9.5-1.6.5-1.9 2-3 4.8-5.1a48 48 0 0 1 13-6.4c2.8-1 4.6-2 11.9-2.8 5.3-.6 10.7-7.5 15-13.6 5.4-8 .3-9.3 1.5-13.8 1-3.8 2-7.7 7-11 4.1-3 26.3 4.5 28 5.5 3.9 2.4 5.8 7 9.4 8.8 4.3 2 6 2 9.5 3.6a38 38 0 0 1 10.3 15.3c.2 5-8.4 18.5-3.3 23 4.5 4 5.9 2.8 11 5.3 3.4 1.8 3.4 7.5 3.7 11.4.2 3.8 0 8.9-3 10.5-6.2 3.3-14.6-1.7-21.6.2-3.7 1-2.4 5.9-7 11.8-5.5 6.8-8 14.4-8 18.7 0 6.3.6 14.3 0 20-.2 3-2 6.5-4.7 7.8-4.5 2.3-8.8 1.9-12.5 4.6-4 2.8-6.4 6-10.1 10-3.6 4-4.3 6.4-6.5 11.3-2 4.2-3.6 6-5.9 8.7-2 2.4-5.1 3.5-7.7 5.3-2.5 1.6-4.7 4.3-8.9 5.4-11.3 3-21.9 7.8-32.7 8.6-7 .5-9.5-8.4-16.5-8.3-2.9 0-5.7 1.7-8.2 3.4-4.3 3-8.6 5.1-8.3 8.7 1 11.5 22.4 10.7 28 19.6 2 3 4.7 7 4.2 14-.2 3.9-3.3 7-6.2 9.3-6.6 5.4-29.9 18.6-45.1 27.8L351.8 402c-13.8 8.7-35.7 21.7-41.6 26.1-14.2 10.8-26.5 31-29.7 35.7-2 2.9-8.9 7.7-9.6 9.9-1 2.5-.7 7.4-3.2 9.2-3 2.1-4.7 1.3-7.8 1.3-2.7 0-2 .7-4.9 1.3-1.8.4-5 .3-8.3-2.6';

// Coordinates and progress ranges follow the normalized map-space pattern from JJYing/Nurburgring-Map.
const trackLabels = [
  { st: 0.006, ed: 0.014, x: 0.357, y: 0.876, h: 'c', v: 'b', de: 'Sabine-Schmitz-Kurve', zh: '萨宾娜弯' },
  { st: 0.019, ed: 0.032, x: 0.32, y: 0.933, h: 'c', v: 't', de: 'Hatzenbach Bogen', zh: '哈岑巴赫弧线' },
  { st: 0.033, ed: 0.063, x: 0.262, y: 0.896, h: 'l', v: 'b', de: 'Hatzenbach', zh: '哈岑巴赫', slug: 'hatzenbach' },
  { st: 0.065, ed: 0.076, x: 0.203, y: 0.867, h: 'r', v: 't', de: 'Hoheichen', zh: '大橡树', slug: 'hocheichen' },
  { st: 0.08, ed: 0.116, x: 0.172, y: 0.78, h: 'l', v: 't', de: 'Quiddelbacher Höhe', zh: '奎德巴赫高地' },
  { st: 0.117, ed: 0.127, x: 0.133, y: 0.714, h: 'r', v: 'm', de: 'Flugplatz', zh: '飞机场', slug: 'flugplatz' },
  { st: 0.129, ed: 0.139, x: 0.159, y: 0.67, h: 'l', v: 'm', de: 'Kottenborn', zh: '科滕博恩' },
  { st: 0.163, ed: 0.172, x: 0.105, y: 0.57, h: 'r', v: 't', de: 'Schwedenkreuz', zh: '瑞典十字', slug: 'schwedenkreuz' },
  { st: 0.179, ed: 0.188, x: 0.092, y: 0.53, h: 'l', v: 'm', de: 'Aremberg', zh: '阿伦山' },
  { st: 0.205, ed: 0.237, x: 0.155, y: 0.44, h: 'r', v: 'b', de: 'Fuchsröhre', zh: '狐狸洞', slug: 'fuchsroehre' },
  { st: 0.237, ed: 0.256, x: 0.175, y: 0.362, h: 'r', v: 'm', de: 'Adenauer Forst', zh: '阿德瑙森林', slug: 'adenauer-forst' },
  { st: 0.277, ed: 0.296, x: 0.257, y: 0.277, h: 'l', v: 't', de: 'Metzgesfeld', zh: '屠宰场', slug: 'metzgesfeld' },
  { st: 0.305, ed: 0.313, x: 0.202, y: 0.21, h: 'r', v: 't', de: 'Kallenhard', zh: '卡伦哈特' },
  { st: 0.319, ed: 0.328, x: 0.232, y: 0.17, h: 'r', v: 'b', de: 'Spiegelkurve', zh: '镜像双子' },
  { st: 0.329, ed: 0.343, x: 0.261, y: 0.115, h: 'c', v: 't', de: 'Dreifach-Rechts', zh: '三连右' },
  { st: 0.347, ed: 0.359, x: 0.301, y: 0.184, h: 'c', v: 't', de: 'Wehrseifen', zh: '防御谷' },
  { st: 0.372, ed: 0.383, x: 0.37, y: 0.169, h: 'l', v: 't', de: 'Breidscheid', zh: '布赖德沙伊德' },
  { st: 0.385, ed: 0.392, x: 0.374, y: 0.109, h: 'r', v: 't', de: 'Ex-Mühle', zh: '旧磨坊' },
  { st: 0.408, ed: 0.417, x: 0.443, y: 0.09, h: 'r', v: 'b', de: 'Lauda-Links', zh: '劳达左弯' },
  { st: 0.42, ed: 0.432, x: 0.491, y: 0.078, h: 'l', v: 't', de: 'Bergwerk', zh: '矿山', slug: 'bergwerk' },
  { st: 0.466, ed: 0.48, x: 0.538, y: 0.219, h: 'c', v: 't', de: 'Kesselchen', zh: '小谷地', slug: 'kesselchen' },
  { st: 0.513, ed: 0.526, x: 0.665, y: 0.262, h: 'c', v: 't', de: 'Mutkurve', zh: '勇气弯' },
  { st: 0.531, ed: 0.544, x: 0.706, y: 0.208, h: 'r', v: 'b', de: 'Klostertal', zh: '修道谷' },
  { st: 0.552, ed: 0.56, x: 0.789, y: 0.195, h: 'r', v: 'b', de: 'Steilstrecke', zh: '陡坡段' },
  { st: 0.571, ed: 0.586, x: 0.73, y: 0.277, h: 'c', v: 't', de: 'Caracciola-Karussell', zh: '旋转木马', slug: 'karussell' },
  { st: 0.624, ed: 0.633, x: 0.811, y: 0.157, h: 'r', v: 'b', de: 'Hohe Acht', zh: '高八', slug: 'hohe-acht' },
  { st: 0.636, ed: 0.65, x: 0.851, y: 0.154, h: 'l', v: 'b', de: 'Hedwigshöhe', zh: '海德薇高地' },
  { st: 0.65, ed: 0.66, x: 0.898, y: 0.188, h: 'l', v: 'b', de: 'Wippermann', zh: '弹跳人' },
  { st: 0.662, ed: 0.681, x: 0.89, y: 0.242, h: 'r', v: 'm', de: 'Eschbach', zh: '埃施巴赫' },
  { st: 0.681, ed: 0.701, x: 0.901, y: 0.29, h: 'r', v: 'm', de: 'Brünnchen', zh: '小水井', slug: 'brunnchen' },
  { st: 0.692, ed: 0.701, x: 0.9, y: 0.327, h: 'l', v: 't', de: 'YouTube Corner', zh: '网红弯' },
  { st: 0.705, ed: 0.715, x: 0.867, y: 0.323, h: 'r', v: 'm', de: 'Eiskurve', zh: '冰弯' },
  { st: 0.721, ed: 0.745, x: 0.87, y: 0.415, h: 'l', v: 'm', de: 'Pflanzgarten I', zh: '植物园 I', slug: 'pflanzgarten' },
  { st: 0.746, ed: 0.762, x: 0.82, y: 0.444, h: 'r', v: 'b', de: 'Pflanzgarten II', zh: '植物园 II' },
  { st: 0.763, ed: 0.783, x: 0.794, y: 0.509, h: 'l', v: 't', de: 'Stefan-Bellof-S', zh: '贝洛夫 S' },
  { st: 0.793, ed: 0.81, x: 0.715, y: 0.503, h: 'c', v: 'b', de: 'Schwalbenschwanz', zh: '燕尾', slug: 'schwalbenschwanz' },
  { st: 0.815, ed: 0.824, x: 0.667, y: 0.539, h: 'r', v: 'm', de: 'Kleine Karussell', zh: '小旋转木马', slug: 'kleines-karussell' },
  { st: 0.834, ed: 0.85, x: 0.735, y: 0.59, h: 'l', v: 'm', de: 'Galgenkopf', zh: '断头台', slug: 'galgenkopf' },
  { st: 0.853, ed: 0.945, x: 0.601, y: 0.719, h: 'l', v: 't', de: 'Döttinger Höhe', zh: '多廷根高地', slug: 'doettinger-hoehe' },
  { st: 0.947, ed: 0.959, x: 0.458, y: 0.804, h: 'r', v: 'b', de: 'Antoniusbuche', zh: '安东尼榉木' },
  { st: 0.966, ed: 0.979, x: 0.445, y: 0.863, h: 'l', v: 't', de: 'Tiergarten', zh: '动物园' },
  { st: 0.981, ed: 0.994, x: 0.419, y: 0.91, h: 'l', v: 't', de: 'Hohenrain-Schikane', zh: '高雨组合弯' },
  { st: 0.994, ed: 0.999, x: 0.379, y: 0.926, h: 'l', v: 't', de: 'T13', zh: 'T13' }
];

const guideLabels = trackLabels.filter((label) => label.slug);

function getActiveIndex(slug) {
  const index = trackLabels.findIndex((label) => label.slug === slug);
  return index >= 0 ? index : 5;
}

export default function TrackMap({ compact = false, activeSlug = null }) {
  const navigate = useNavigate();
  const pathId = `nord-flow-${useId().replace(/:/g, '')}`;
  const mapRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(() => getActiveIndex(activeSlug));
  const [mapLanguage, setMapLanguage] = useState('zh');
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

  const selectCorner = (index) => {
    setIsAutoPaused(true);
    setActiveIndex(index);
  };

  return (
    <section ref={mapRef} className={compact ? 'track-map compact' : 'track-map'} aria-label="纽北真实赛道图">
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
                    selectCorner(index);
                    if (label.slug) {
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
              <div className="mobile-map-tabs" role="list" aria-label="重点弯角切换">
                {guideLabels.map((label) => {
                  const index = trackLabels.indexOf(label);
                  const corner = getCornerBySlug(label.slug);
                  const labelName = mapLanguage === 'de' ? label.de : label.zh;

                  return (
                    <button
                      key={label.slug}
                      type="button"
                      className={index === activeIndex ? 'active' : undefined}
                      onClick={() => selectCorner(index)}
                      role="listitem"
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
      </div>
    </section>
  );
}
