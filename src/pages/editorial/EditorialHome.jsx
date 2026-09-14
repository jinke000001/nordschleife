import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, ArrowUpRight } from 'lucide-react';
import forestRoad from '../../assets/corners/fuchsroehre-beginning.webp';
import historic from '../../assets/corners/hatzenbach-1963.webp';
import karussell from '../../assets/karussell-wikimedia-1800.webp';
import car from '../../assets/porsche-919-hybrid-evo.webp';
import { CircuitReading } from './GuidedChapters.jsx';
import ChapterNavigation from './ChapterNavigation.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import { lapTimes } from '../../data/lap-times.js';
import { lapTimeSources } from '../../data/lap-time-sources.js';
import { CornerJourney, MachineChapter, ImageCredit, PhotoAtlas } from './HomeChapters.jsx';
import { storyPhotos } from './story-photos.js';
import ChapterCursor from './ChapterCursor.jsx';
import useChapterMotion from './useChapterMotion.js';
import './home-story.css';
import './guided-story.css';

// Cover uses stable public URLs shared with the boot cover / preload in index.html,
// so the LCP image is fetched once and paints from the first HTML frame.
const coverSrcSet = '/brunnchen-cover-800.webp 800w, /brunnchen-cover-1200.webp 1200w, /brunnchen-cover-1920.webp 1920w';

const photoSource = 'https://commons.wikimedia.org/wiki/File:RCN_8._2023_5_(Br%C3%BCnnchen).jpg';
const readingPaths = [
  { href: '/corners', title: '森林里的每一个弯。', label: '弯道档案', image: karussell },
  { href: '/brands', title: '汽车留下的名字。', label: '品牌与车', image: car },
  { href: '/lap-times', title: '时间背后的故事。', label: '圈速档案', image: '/brunnchen-cover-1200.webp' },
];

function ReadingIndex() {
  const [active, setActive] = useState(0);
  return <nav className="story-reading" aria-label="继续探索"><div className="story-reading-heading"><p className="ed-kicker">06 / 继续探索</p><h2>下一页，<br /><em>从好奇开始。</em></h2></div><div className="story-reading-links">{readingPaths.map((item, index) => <Link to={item.href} key={item.href} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} data-cursor="翻页"><span>0{index + 1}</span><div><strong>{item.title}</strong><small>{item.label}</small></div><ArrowUpRight size={25} /></Link>)}</div><div className="story-reading-preview" aria-hidden="true">{readingPaths.map((item, index) => <img key={item.href} src={item.image} alt="" loading="lazy" fetchPriority="low" className={active === index ? 'is-active' : ''} width="480" height="360" />)}</div></nav>;
}

export default function EditorialHome() {
  useDocumentTitle('绿色地狱 · 从这里认识纽北');
  // The boot cover in index.html paints the LCP image before JS; retire it only
  // after the boot image has actually painted (decoded + a settled painted frame),
  // so the swap to the identical real cover is seamless. Timeout keeps hard stalls safe.
  useLayoutEffect(() => {
    const rootEl = document.documentElement;
    if (!rootEl.classList.contains('boot-home')) return;
    const startedAt = performance.now();
    const retire = () => rootEl.classList.remove('boot-home');
    const timer = window.setTimeout(retire, 2000);
    const finish = () => {
      // Hold the overlay long enough for a frame with the decoded boot image to
      // actually paint, even when React's mount task occupies the main thread.
      const wait = Math.max(0, 150 - (performance.now() - startedAt));
      window.setTimeout(() => {
        window.clearTimeout(timer);
        requestAnimationFrame(() => requestAnimationFrame(retire));
      }, wait);
    };
    const bootImg = document.querySelector('.boot-cover img');
    if (!bootImg || bootImg.complete) finish();
    else bootImg.decode().then(finish, finish);
  }, []);
  const rootRef = useRef(null);
  const [staticMode, setStaticMode] = useState(() => {
    try { return sessionStorage.getItem('nord-guide-static') === 'true'; } catch { return false; }
  });
  const toggleMotion = () => {
    const next = !staticMode;
    setStaticMode(next);
    try { sessionStorage.setItem('nord-guide-static', String(next)); } catch { /* Keep the current page preference. */ }
  };
  useChapterMotion(rootRef, staticMode);
  const benchmark = lapTimes.find(lap => lap.name === 'Porsche 919 Hybrid Evo');
  const benchmarkSource = lapTimeSources[benchmark.name];
  return <div className="story-home" ref={rootRef}>
    <section className="ed-cover story-cover" id="guide-start" data-reading-position aria-labelledby="ed-cover-title">
      <img className="ed-cover-photo" src="/brunnchen-cover-1920.webp" srcSet={coverSrcSet} sizes="100vw" alt="Brünnchen 实景：赛车穿过森林之间起伏的北环赛道" width="1920" height="1280" fetchPriority="high" />
      <div className="ed-cover-shade" />
      <div className="ed-cover-copy"><p className="ed-overline">德国 · 艾费尔山地</p><h1 id="ed-cover-title">绿色<br />地狱<span>。</span></h1><p className="ed-cover-english">The Green Hell.</p><p className="ed-cover-intro">20.832 公里，穿行于森林与起伏之间。<br />从一个弯道开始，读懂纽北。</p><a className="ed-cover-cta" href="#field-notes">沿着赛道，开始探索 <ArrowDown size={19} /></a></div>
      <div className="ed-cover-location"><span>BRÜNNCHEN</span><p>布伦兴 · 北环实景</p></div><a className="ed-cover-scroll" href="#field-notes" aria-label="继续了解纽北"><ArrowDown size={20} /></a>
      <div className="story-cover-bottom"><span>THE CIRCUIT / THE CARS / THE TIME</span><button className="story-motion-toggle" type="button" aria-pressed={staticMode} onClick={toggleMotion}>{staticMode ? '开启动态浏览' : '减少动态效果'}</button><Link to="/experience/karussell">直接走进旋转木马 <ArrowUpRight size={15} /></Link></div>
    </section>
    <ImageCredit href={photoSource}>摄影 / SunflowerYuri · 2023 · CC BY-SA 4.0 · 展示裁切</ImageCredit>
    <section className="field-notes" id="field-notes" data-reading-position data-guide-chapter aria-labelledby="field-title" data-photo-trail>
      <header className="field-heading"><p className="ed-kicker">01 / 森林里的线索</p><h2 id="field-title">速度之外，<br /><em>还有地形的故事。</em></h2><p>树木、路面、弯道和时间。<br />把一个个细节，慢慢连成纽北。</p><span className="field-mouse-note">移动鼠标，翻看沿途影像 <ArrowUpRight size={14} /></span></header>
      <figure className="field-road" data-drift><Link to="/corners/fuchsroehre" data-cursor="看弯"><img src={forestRoad} width="1920" height="1080" alt="Fuchsröhre 入口，路面沿森林向山谷延伸" loading="lazy" fetchPriority="low" /></Link><figcaption><span>01 / THE TERRAIN</span><strong>路面，随山势展开。</strong></figcaption><ImageCredit href="https://commons.wikimedia.org/wiki/File:Fuchsr%C3%B6hreBeginning.jpg">Fuchsröhre · Hejnjahns · CC0 · 裁切</ImageCredit></figure>
      <figure className="field-history" data-drift><Link to="/corners/hatzenbach" data-cursor="回看"><img src={historic} width="1920" height="1281" alt="1963 年赛车经过 Hatzenbach 弯道的黑白照片" loading="lazy" fetchPriority="low" /></Link><figcaption><span>02 / THE MEMORY</span><strong>同一片森林，不同的年代。</strong></figcaption><ImageCredit href="https://commons.wikimedia.org/wiki/File:1963-05-19_GTO_v._Noblet-Guichet_u._Lancia_v._Davis-Pryor.jpg">Hatzenbach · 1963 · Lothar Spurzem · CC BY-SA 2.0 DE · 裁切</ImageCredit></figure>
      <div className="field-quote"><span>20.832</span><small>KILOMETRES OF CHARACTER</small><p>先看见它，<br />再慢慢读懂它。</p></div>
      <figure className="field-race" data-drift><Link to="/corners/doettinger-hoehe" data-cursor="看弯"><img src={storyPhotos.endurance.src} width={storyPhotos.endurance.width} height={storyPhotos.endurance.height} alt="FALKEN 赛车在 Döttinger Höhe 直道参加纽北 24 小时耐力赛" loading="lazy" fetchPriority="low" /></Link><figcaption><span>03 / THE PRESENT</span><strong>故事，仍在弯道里继续。</strong></figcaption><ImageCredit href={storyPhotos.endurance.source}>Döttinger Höhe · {storyPhotos.endurance.author} · {storyPhotos.endurance.license} · 展示裁切</ImageCredit></figure>
      <a className="field-next" href="#corner-journey">从一个弯道开始 <ArrowDown size={20} /></a>
      <PhotoAtlas />
    </section>
    <CornerJourney />
    <CircuitReading />
    <MachineChapter />
    <section className="story-timing" id="time" data-reading-position data-guide-chapter aria-labelledby="timing-title"><div className="story-timing-heading"><p className="ed-kicker">05 / 留在计时器上的名字</p><h2 id="timing-title">最后，<em>让时间说话。</em></h2></div><div className="guide-timing-context"><article><span>01 / 类别</span><h3>原型赛车</h3><p>919 Hybrid Evo 为突破部分赛事限制而开发。读这个成绩时，先把它与公路量产车的类别分开。</p></article><article><span>02 / 距离</span><h3>{benchmark.circuit}</h3><p>计时距离是比较的前提。全长北环与其他计时口径，不能只凭一个数字直接排在一起。</p></article><article><span>03 / 这一圈</span><h3>2018.06.29</h3><p>{benchmark.driver} 驾驶它完成这次纪录圈。下面保留完整成绩，来源随数字一起呈现。</p></article></div><div className="story-lap-label"><span>{benchmark.name}</span><span>{benchmark.year} / {benchmark.circuit}</span></div><p className="story-lap-time">{benchmark.time}</p><div className="story-lap-footer"><p>{benchmark.driver} · 原型赛车成绩<br /><a href={benchmarkSource.href} target="_blank" rel="noreferrer">成绩来源 / {benchmarkSource.title} <ArrowUpRight size={12} /></a></p><p>距离、车型类别、计时规则。<br />比较快慢之前，先读懂它们。</p><Link className="ed-text-link" to="/lap-times">打开圈速档案 <ArrowRight size={18} /></Link></div></section>
    <ReadingIndex />
    <ChapterNavigation rootRef={rootRef} />
    <ChapterCursor rootRef={rootRef} staticMode={staticMode} />
  </div>;
}
