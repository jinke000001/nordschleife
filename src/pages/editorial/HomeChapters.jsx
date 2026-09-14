import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown, ArrowUpRight } from 'lucide-react';
import karussell from '../../assets/karussell-wikimedia-1800.webp';
import { storyPhotos, trailPhotos } from './story-photos.js';
import { journeyPhotos } from './journey-photos.js';

export const karussellSource = 'https://commons.wikimedia.org/wiki/File:Karussell.jpg';
const details = [
  { title: '混凝土内槽', english: 'THE CONCRETE', text: '浅色混凝土向弯内降低，构成旋转木马最容易辨认的内槽。', position: '56% 75%' },
  { title: '板块接缝', english: 'THE TEXTURE', text: '板面之间的一道道接缝，让连续的弯道显露出构造的节奏。', position: '70% 85%' },
  { title: '两种路面', english: 'THE CONTRAST', text: '向外看，浅色混凝土与深色沥青相接。同一个弯，有两种表情。', position: '92% 52%' },
];

export function ImageCredit({ children, href, light = false }) {
  return <p className={`story-credit${light ? ' is-light' : ''}`}><a href={href} target="_blank" rel="noreferrer">{children} <ArrowUpRight size={11} /></a></p>;
}

export function CornerJourney() {
  const [active, setActive] = useState(0);
  return <section className="journey-scene" id="corner-journey" data-reading-position data-guide-chapter aria-label="从路面细节走进旋转木马">
    <div className="journey-viewport">
      <header className="journey-topline"><span>02 / 读懂一个弯</span><span className="journey-desktop-hint">向下滚动，看见更多 <ArrowRight size={16} /></span><a href="#circuit">直接看地图 <ArrowDown size={14} /></a></header>
      <div className="journey-rail">
        <div className="journey-intro" data-journey-panel><p className="ed-kicker">LOOK A LITTLE CLOSER</p><h2>一个弯道，<br /><em>许多个瞬间。</em></h2><p>从黑白照片到彩色影像。<br />让不同年代，在同一个弯里相遇。</p><span className="journey-number">01—{String(journeyPhotos.length).padStart(2, '0')}</span></div>
        <div className="journey-detail-group" aria-label="旋转木马八张交错影像">{journeyPhotos.map(({ photo, title, english, text, x, y, w, h, position }, index) => <figure className={`journey-detail journey-detail-${index}`} style={{ '--photo-x': `${x}vw`, '--photo-y': `${y}%`, '--photo-w': `${w}vw`, '--photo-h': `${h}svh`, '--photo-position': position }} key={title} data-journey-panel>
          <div className="journey-detail-image"><img src={photo.src} srcSet={photo.srcSet} sizes={`(min-width: 1000px) ${w}vw, (min-width: 600px) 40vw, 78vw`} alt={`${title}：${text}`} loading="lazy" width={photo.width} height={photo.height} /></div>
          <figcaption><span>0{index + 1} / {english}</span><strong>{title}</strong><p>{text}</p><ImageCredit href={photo.source}>{photo.author} · {photo.license} · 展示裁切</ImageCredit></figcaption>
        </figure>)}</div>

        <div className="journey-finale" data-journey-panel>
          <img className="journey-finale-photo" src={karussell} alt="旋转木马全景，混凝土内槽与外侧沥青组成回头弯" width="1600" height="899" loading="lazy" />
          <div className="journey-finale-shade" />
          <div className="journey-finale-title"><span>CARACCIOLA-KARUSSELL</span><h2>一个回头弯，<br /><em>两种路面。</em></h2><a href="#circuit">把这个弯，放回整条赛道 <ArrowDown size={20} /></a></div>
          <div className="journey-observation"><div className="journey-tabs" aria-label="选择路面细节">{details.map((detail, index) => <button key={detail.title} onClick={() => setActive(index)} aria-pressed={active === index}>0{index + 1}<span>{detail.title}</span></button>)}</div><p aria-live="polite">{details[active].text}</p></div>
        </div>
      </div>
      <div className="journey-progress" aria-hidden="true"><span /></div>
    </div>
    <div className="journey-static-trail" aria-hidden="true">{journeyPhotos.map(({ photo, title, english, text, position }, index) => <figure className="journey-trail-item" key={title}>
      <img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 1000px) 38vw, 78vw" alt="" loading="lazy" width={photo.width} height={photo.height} style={{ objectPosition: position }} />
      <figcaption><span>0{index + 1} / {english}</span><strong>{title}</strong><p>{text}</p></figcaption>
    </figure>)}</div>
    <ImageCredit href={karussellSource}>全景 / Karussell · Hejnjahns · 2018 · CC0 1.0</ImageCredit>
  </section>;
}

export function MachineChapter() {
  const { gt3, porscheSide, porscheFront } = storyPhotos;
  return <section className="machine-chapter" id="machines" data-reading-position data-guide-chapter aria-labelledby="machine-title">
    <div className="machine-heading"><p className="ed-kicker">04 / 车与工程</p><h2 id="machine-title">同一条赛道，<br /><em>不同的答案。</em></h2><p>从可以上路的跑车，到突破赛事规则的原型车。<br />速度背后，是不同的工程选择。</p></div>
    <div className="machine-contact-sheet">
      <figure className="machine-road" data-drift><Link to="/brands/porsche/911-gt3-rs" data-cursor="读车"><img src={gt3.src} alt="车展上的 Porsche 911 GT3 RS" width="1600" height="1156" loading="lazy" /><span>01 / ROAD CAR <ArrowUpRight size={18} /></span></Link><figcaption>911 GT3 RS / 车展实拍</figcaption><ImageCredit href={gt3.source}>{gt3.author} · {gt3.license} · 裁切</ImageCredit></figure>
      <div className="machine-note"><span>FORM FOLLOWS<br /><em>the circuit.</em></span><p>尾翼、轮胎、车身。<br />看懂它们，再读计时器。</p></div>
      <figure className="machine-detail" data-drift><div><img src={porscheSide.src} srcSet={porscheSide.srcSet} sizes="(min-width: 760px) 33vw, 55vw" alt="Rennsport Reunion VI 活动现场，919 Hybrid Evo 的低矮车身与尾翼" width={porscheSide.width} height={porscheSide.height} loading="lazy" /></div><figcaption>02 / THE SILHOUETTE<br /><span>低矮座舱与高耸尾翼 · 2018 活动现场</span></figcaption><ImageCredit href={porscheSide.source}>{porscheSide.author} · {porscheSide.license} · 展示裁切</ImageCredit></figure>
    </div>
    <div className="guide-engineering" id="machine-road-reading" data-reading-position><header><span>01 / ROAD-LEGAL · 992 GT3 RS</span><h3>让空气，<br /><em>参与每一个弯。</em></h3><Link className="ed-text-link" to="/brands/porsche/911-gt3-rs">完整车型档案 <ArrowUpRight size={16} /></Link></header><div><article><h4>散热，也决定车身如何呼吸。</h4><p>中央散热器占据了其他 911 的前行李厢位置，让车头两侧腾出空间，容纳主动空气动力学部件。冷却与气流管理，在这里是一套互相配合的设计。</p></article><article><h4>尾翼会改变自己的任务。</h4><p>前后可调翼面共同管理下压力；在允许的工作范围内，DRS 可以降低阻力。高速紧急制动时，翼面还会形成空气制动效果。</p></article><ImageCredit href="https://newsroom.porsche.com/en/2022/products/porsche-911-gt3-rs-world-premiere-29177.html">工程资料 / Porsche Newsroom · 2022 · 992 代 GT3 RS</ImageCredit></div></div>
    <div className="machine-wide" data-drift><img src={porscheFront.src} srcSet={porscheFront.srcSet} sizes="95vw" alt="919 Hybrid Evo 的前侧视角，前轮拱、座舱和空气动力学车身" width={porscheFront.width} height={porscheFront.height} loading="lazy" /><div className="machine-wide-caption"><span>PORSCHE / ENGINEERING STORIES</span><h3>919 Hybrid Evo</h3><Link to="/brands/porsche/919-hybrid-evo" data-cursor="读车">读它的工程故事 <ArrowUpRight size={20} /></Link></div></div>
    <ImageCredit href={porscheFront.source}>{porscheFront.author} · {porscheFront.license} · 2018 Rennsport Reunion VI 活动现场 · 展示裁切</ImageCredit>
    <div className="guide-engineering" id="machine-evo-reading" data-reading-position><header><span>02 / PROTOTYPE · 919 HYBRID EVO</span><h3>当规则松开，<br /><em>工程走向哪里。</em></h3><Link className="ed-text-link" to="/brands/porsche/919-hybrid-evo">完整工程故事 <ArrowUpRight size={16} /></Link></header><div><article><h4>一次制动，也在收集下一次加速。</h4><p>两升涡轮增压 V4 发动机之外，919 还从前轴制动和排气中回收能量。电能被储存，再参与驱动；速度来自多种能量的共同工作。</p></article><article><h4>脱离部分赛事限制，重新安排潜力。</h4><p>Evo 以耐力赛车为基础，释放部分规则限制下的动力与空气动力学潜力。更大的前扩散器、尾翼和主动空气动力学部件，为纪录挑战服务。</p></article><ImageCredit href="https://newsroom.porsche.com/en/motorsports/919-hybrid-evo-spa-francorchamps-track-record-drive-neel-jani-15184.html">工程资料 / Porsche Newsroom · 2018</ImageCredit></div></div>
    <a className="guide-next-chapter ed-text-link" href="#time">工程的答案，最后写进计时器 <ArrowDown size={18} /></a>
  </section>;
}

export function PhotoAtlas() {
  return <details className="story-photo-index">
    <summary>沿途影像 · {trailPhotos.length} 张 <span>查看照片与来源</span></summary>
    <p>森林、比赛与工程。鼠标经过时浮现的影像，也可以在这里慢慢翻看；每张照片都链接到原始来源与许可。</p>
    <div className="story-photo-grid">{trailPhotos.map(photo => <figure key={photo.thumb}>
      <a href={photo.source} target="_blank" rel="noreferrer"><img src={photo.thumb} alt={photo.title} loading="lazy" width="320" height="220" /><strong>{photo.title} <ArrowUpRight size={12} /></strong></a>
      <figcaption>{photo.author} · <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> · 缩略裁切</figcaption>
    </figure>)}</div>
  </details>;
}
