import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  elevationPoints,
  MIN_ELEVATION,
  MAX_ELEVATION,
  TRACK_TOTAL_KM,
  ELEVATION_DROP
} from '../data/elevationData.js';

const PADDING_X = 40;
const WIDTH = 1000;
const CHART_WIDTH = WIDTH - PADDING_X * 2;
const HEIGHT = 220;
const BASELINE_Y = 190;
const TOP_Y = 35;
const CHART_HEIGHT = BASELINE_Y - TOP_Y;

function kmToX(km) {
  return PADDING_X + (km / TRACK_TOTAL_KM) * CHART_WIDTH;
}

function elevationToY(elev) {
  const ratio = (elev - MIN_ELEVATION) / (MAX_ELEVATION - MIN_ELEVATION);
  return BASELINE_Y - ratio * CHART_HEIGHT;
}

export default function TrackElevationRibbon({
  activeSlug = null,
  onSelectCorner = null,
  className = ''
}) {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  // 计算路径
  const { linePath, areaPath, coords } = useMemo(() => {
    const calculatedCoords = elevationPoints.map((pt) => ({
      ...pt,
      x: kmToX(pt.km),
      y: elevationToY(pt.elevation)
    }));

    const pathString = calculatedCoords.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaString = `${pathString} L ${calculatedCoords[calculatedCoords.length - 1].x},${BASELINE_Y} L ${calculatedCoords[0].x},${BASELINE_Y} Z`;

    return { linePath: pathString, areaPath: areaString, coords: calculatedCoords };
  }, []);

  // 当前激活或悬停的高亮数据点
  const activeIndex = useMemo(() => {
    if (hoverIndex !== null) return hoverIndex;
    if (activeSlug) {
      const found = coords.findIndex((pt) => pt.slug === activeSlug);
      if (found !== -1) return found;
    }
    // 默认高亮最具代表性的狐狸洞（Fuchsröhre）或首个特征点
    return 7;
  }, [hoverIndex, activeSlug, coords]);

  const activePoint = coords[activeIndex] ?? coords[7];

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * WIDTH;

    // 寻找最近的坐标点
    let nearestIdx = 0;
    let minDiff = Infinity;
    coords.forEach((pt, idx) => {
      const diff = Math.abs(pt.x - svgX);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIdx = idx;
      }
    });
    setHoverIndex(nearestIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const handlePointClick = (pt) => {
    if (onSelectCorner && pt.slug) {
      onSelectCorner(pt.slug);
    } else if (pt.slug) {
      navigate(`/corners/${pt.slug}`);
    }
  };

  // 特征关键节点
  const featurePoints = coords.filter((pt) => pt.feature && pt.feature !== 'start' && pt.feature !== 'finish');

  return (
    <div className={`elevation-ribbon ${className}`}>
      <div className="elevation-header">
        <div className="elevation-header-left">
          <span className="elevation-badge font-mono">VERTICAL RELIEF // SCHEMATIC</span>
          <h3 className="elevation-title">赛道纵向高低落差示意</h3>
        </div>
        <div className="elevation-stats font-mono">
          <span>PEAK: 614M (HOHE ACHT)</span>
          <span className="divider">/</span>
          <span>LOW: 320M (BREIDSCHEID)</span>
          <span className="divider">/</span>
          <span className="stat-highlight">DROP: {ELEVATION_DROP}M</span>
        </div>
      </div>

      <p className="elevation-source-note">示意数据 · 里程与海拔点尚未逐项核验，不用于测绘或驾驶判断。<a href="https://www.nuerburgring.de/info/nuerburgring/race-tracks/nordschleife" target="_blank" rel="noreferrer">查看官方赛道概况</a></p>
      <div className="elevation-stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="elevation-svg"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          aria-label="纽北赛道纵向高低落差图表"
        >
          <defs>
            {/* 面积渐变 */}
            <linearGradient id="elevationGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e5232e" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#e5232e" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#e5232e" stopOpacity="0" />
            </linearGradient>
            {/* 网格图案 */}
            <pattern id="gridPattern" width="100" height="40" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* 背景网格 */}
          <rect x={PADDING_X} y={TOP_Y} width={CHART_WIDTH} height={CHART_HEIGHT} fill="url(#gridPattern)" />

          {/* 标尺参考线 */}
          <line x1={PADDING_X} y1={TOP_Y} x2={WIDTH - PADDING_X} y2={TOP_Y} stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
          <line x1={PADDING_X} y1={BASELINE_Y} x2={WIDTH - PADDING_X} y2={BASELINE_Y} stroke="rgba(255, 255, 255, 0.1)" />

          {/* 标尺文字 */}
          <text x={PADDING_X - 8} y={TOP_Y + 4} textAnchor="end" className="elevation-axis-text font-mono">640m</text>
          <text x={PADDING_X - 8} y={elevationToY(470)} textAnchor="end" className="elevation-axis-text font-mono">470m</text>
          <text x={PADDING_X - 8} y={BASELINE_Y + 4} textAnchor="end" className="elevation-axis-text font-mono">300m</text>

          {/* 填充面积 */}
          <path d={areaPath} fill="url(#elevationGrad)" />

          {/* 剖面轮廓曲线 */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--red)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="elevation-line"
          />

          {/* 悬停光标指示竖线 */}
          {activePoint && (
            <g className="elevation-active-cursor">
              <line
                x1={activePoint.x}
                y1={TOP_Y - 10}
                x2={activePoint.x}
                y2={BASELINE_Y}
                stroke="rgba(255, 255, 255, 0.4)"
                strokeDasharray="2 2"
                strokeWidth="1.5"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="6"
                fill="#fff"
                stroke="var(--red)"
                strokeWidth="3"
                className="cursor-point"
              />
            </g>
          )}

          {/* 关键特征点打标 */}
          {featurePoints.map((pt) => {
            const isHighlighted = activePoint.name === pt.name;
            return (
              <g
                key={pt.name}
                className={`elevation-marker ${isHighlighted ? 'active' : ''}`}
                onClick={() => handlePointClick(pt)}
                style={{ cursor: pt.slug ? 'pointer' : 'default' }}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHighlighted ? 5 : 3.5}
                  fill={isHighlighted ? '#ffffff' : 'var(--red)'}
                  stroke="#0b0d11"
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className="elevation-marker-label font-mono"
                >
                  {pt.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* 动态遥测悬停卡片 (HUD Callout) */}
        {activePoint && (
          <div
            className="elevation-hud-callout"
            style={{
              left: `clamp(10px, ${(activePoint.x / WIDTH) * 100}%, calc(100% - 240px))`
            }}
          >
            <div className="hud-corner-title font-mono">
              <strong>{activePoint.name}</strong>
              <small>{activePoint.de}</small>
            </div>
            <div className="hud-data-row font-mono">
              <div>
                <span className="hud-label">DISTANCE</span>
                <span className="hud-val">{activePoint.km.toFixed(1)} km</span>
              </div>
              <div>
                <span className="hud-label">ALTITUDE</span>
                <span className="hud-val highlight">{activePoint.elevation} m</span>
              </div>
            </div>
            {activePoint.note && (
              <div className="hud-note font-mono">
                ⚡ {activePoint.note}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="elevation-footer-ticks font-mono">
        <span>0 KM (START)</span>
        <span>5 KM (FUCHSRÖHRE)</span>
        <span>10 KM (BREIDSCHEID)</span>
        <span>15 KM (HOHE ACHT)</span>
        <span>20.8 KM (DÖTTINGER)</span>
      </div>
    </div>
  );
}
