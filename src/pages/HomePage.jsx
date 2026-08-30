import { Link } from 'react-router-dom';
import { ArrowRight, Flag, Route, TimerReset } from 'lucide-react';
import CornerCard from '../components/CornerCard.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import TrackMap from '../components/TrackMap.jsx';
import trackOutline from '../assets/nordschleife-map.svg';
import { brands } from '../data/brands.js';
import { beginnerRouteSlugs, corners, featuredCornerSlugs, getCornerBySlug } from '../data/corners.js';
import { lapTimes } from '../data/lap-times.js';
import useScrollReveal from '../hooks/useScrollReveal.js';
import useTilt3D from '../hooks/useTilt3D.js';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import '../styles/pages/home.css';

const featuredCorners = featuredCornerSlugs.map((slug) => corners.find((corner) => corner.slug === slug));
const beginnerRoute = beginnerRouteSlugs
  .slice(0, 4)
  .map((slug) => getCornerBySlug(slug))
  .filter(Boolean);
const recordHeadline =
  lapTimes.find((entry) => entry.category === 'prototype' && entry.isRecord) ??
  lapTimes[0];

export default function HomePage() {
  useDocumentTitle('首页');
  useScrollReveal();
  useTilt3D('.brand-badge', 5);
  useTilt3D('.corner-card', 5);
  useTilt3D('.pathway-card', 4);
  const scrollToMap = () => {
    document.getElementById('home-track-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <section className="home-hero">
        <div className="home-hero-map-visual" aria-hidden="true">
          <img src={trackOutline} alt="" />
        </div>

        <div className="home-hero-content">
          <p className="home-hero-label">纽博格林北环中文指南</p>
          <h1>绿色地狱</h1>
          <p className="home-hero-subtitle">Nürburgring Nordschleife</p>
          <div className="home-hero-actions">
            <button className="primary-button" type="button" onClick={scrollToMap}>
              进入赛道地图 <ArrowRight size={18} />
            </button>
            <Link className="ghost-button" to="/corners">
              查看弯角档案
            </Link>
          </div>
        </div>

        <div className="home-hero-factbar" aria-label="赛道关键数据">
          <article className="home-hero-fact">
            <strong>20.832</strong>
            <span>km 赛道长度</span>
          </article>
          <article className="home-hero-fact">
            <strong>73</strong>
            <span>已命名弯角</span>
          </article>
          <article className="home-hero-fact">
            <strong>300</strong>
            <span>m 海拔落差</span>
          </article>
          <Link className="home-hero-fact-link" to="/lap-times">
            圈速档案 <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="home-pathways page-section reveal-on-scroll">
        <SectionHeader eyebrow="Entry" title="先从这三处进入">
          地图负责空间顺序，弯角负责地形细节，圈速负责车型对比。
        </SectionHeader>

        <div className="home-pathway-grid">
          <button className="pathway-card" type="button" onClick={scrollToMap}>
            <div className="pathway-card-kicker">
              <Route size={18} />
              <span>01 · TRACK MAP</span>
            </div>
            <h3>先看整圈地图</h3>
            <p>建立从起点到长直道的基本顺序。</p>
            <div className="pathway-card-meta">
              <span>整圈空间感</span>
              <span>真实布局</span>
            </div>
          </button>

          <Link className="pathway-card" to="/corners">
            <div className="pathway-card-kicker">
              <Flag size={18} />
              <span>02 · CORNERS</span>
            </div>
            <h3>从经典弯角开始</h3>
            <p>用代表弯角理解坡度、压缩和路面变化。</p>
            <div className="pathway-card-chip-row">
              {beginnerRoute.map((corner) => (
                <span key={corner.slug}>{corner.name}</span>
              ))}
            </div>
          </Link>

          <Link className="pathway-card" to="/lap-times">
            <div className="pathway-card-kicker">
              <TimerReset size={18} />
              <span>03 · RECORDS</span>
            </div>
            <h3>从圈速理解极限</h3>
            <p>看不同车型在同一条赛道上的速度差异。</p>
            <div className="pathway-card-record">
              <strong>{recordHeadline.time}</strong>
              <span>{recordHeadline.name}</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="map-exhibit reveal-on-scroll" id="home-track-map">
        <div className="map-exhibit-copy">
          <p className="eyebrow">Track Map</p>
          <h2>先看清这条赛道，再决定从哪里读进去</h2>
          <p>
            先用地图建立整圈顺序，再进入弯角页查看每个路段的位置、中文说明和关联记录。
          </p>
        </div>
        <TrackMap />
      </section>

      <section className="page-section reveal-on-scroll">
        <SectionHeader eyebrow="Corner Gallery" title="这些名字，构成了很多人认识纽北的第一条路线">
          从坡顶、高速弯、压缩路段到内倾混凝土槽，北环的性格不是抽象的，它藏在一连串具体名字里。
        </SectionHeader>
        <div className="card-grid featured-grid">
          {featuredCorners.map((corner) => (
            <CornerCard key={corner.slug} corner={corner} compact />
          ))}
        </div>
      </section>

      <section className="page-section reveal-on-scroll">
        <SectionHeader eyebrow="Machines & Makers" title="弯角之外，还有把纽北写进产品里的品牌">
          赛道留下名字，品牌留下机器。有人来这里做工程验证，有人来这里写营销神话，也有人只是想证明一台车的性格足够硬。
        </SectionHeader>
        <div className="brand-badge-grid">
          {brands.map((brand) => (
            <Link className="brand-badge" to={`/brands/${brand.slug}`} key={brand.slug} aria-label={brand.name}>
              <img className="brand-badge-logo" src={`/logos/${brand.logoBasename}.svg`} alt={brand.name} />
            </Link>
          ))}
        </div>
        <Link className="primary-button brand-cta" to="/brands">
          查看全部品牌 <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
