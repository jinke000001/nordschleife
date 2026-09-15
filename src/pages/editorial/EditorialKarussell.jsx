import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowDown, ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import photo from '../../assets/karussell-wikimedia-1800.webp';

import { observations, SectionDrawing } from './KarussellStructure.jsx';

export default function EditorialKarussell() {
  useDocumentTitle('Karussell · 旋转木马实景解读');
  const [active, setActive] = useState(0);
  const [showPins, setShowPins] = useState(true);
  const current = observations[active];
  return <article className="ed-study">
    <header className="ed-study-header">
      <Link className="ed-back" to="/"><ArrowLeft size={15} /> 认识纽北</Link>
      <div className="ed-study-heading"><div><p className="ed-kicker">弯道解读 / 01</p><h1>Karussell<span>旋转木马</span></h1></div><p>一个回头弯，两种路面。<br />从实景出发，看清内倾结构。</p></div>
    </header>
    <section className="ed-photo-study" aria-label="旋转木马实景交互解读">
      <div className="ed-photo-main">
        <div className="ed-photo-toolbar"><span>实景观察 <small>2018 / KARUSSELL</small></span><button type="button" onClick={() => setShowPins(!showPins)} aria-pressed={showPins}>{showPins ? <EyeOff size={16} /> : <Eye size={16} />}{showPins ? '隐藏标注' : '显示标注'}</button></div>
        <div className="ed-annotated-photo">
          <img src={photo} width="1600" height="899" alt="Karussell 混凝土弯道实景，内侧为浅色分块混凝土，外侧为深色沥青" fetchPriority="high" />
          {showPins && observations.map((item, index) => <button key={item.label} type="button" className={`ed-photo-pin ${active === index ? 'is-active' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} onClick={() => setActive(index)} aria-label={`观察点 ${index + 1}：${item.label}`} aria-pressed={active === index}><span>{String(index + 1).padStart(2, '0')}</span></button>)}
        </div>
        <div className="ed-photo-caption"><span>摄影 / Hejnjahns · 2018</span><a href="https://commons.wikimedia.org/wiki/File:Karussell.jpg" target="_blank" rel="noreferrer">原图 / CC0 1.0 <ArrowUpRight size={13} /></a></div>
      </div>
      <aside className="ed-observation-panel">
        <p className="ed-kicker">选择一个观察点</p>
        <div className="ed-observation-tabs" aria-label="照片观察点">
          {observations.map((item, index) => <button type="button" key={item.label} onClick={() => setActive(index)} aria-pressed={active === index}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}<ArrowUpRight size={16} /></button>)}
        </div>
        <div className="ed-observation-copy" aria-live="polite" aria-atomic="true"><h2>{current.title}</h2><p>{current.text}</p><p className="ed-observation-detail">{current.detail}</p></div>
        <a className="ed-panel-link" href="#ed-section">对照路面剖面 <ArrowDown size={17} /></a>
      </aside>
    </section>
    <section className="ed-section-story" id="ed-section" aria-labelledby="ed-section-title"><div><p className="ed-kicker">换一个角度理解</p><h2 id="ed-section-title">平面图之外，<br /><em>还有一个剖面。</em></h2><p>照片让我们看见路面，剖面帮助我们理解高低。内侧混凝土向弯心降低，再与外侧沥青衔接。</p></div><figure><SectionDrawing active={active} /><figcaption>路面关系示意 · 非实测比例，不表示驾驶路线。</figcaption></figure></section>
    <section className="ed-study-sources" aria-labelledby="ed-sources-title"><h2 id="ed-sources-title">关于这次解读</h2><div><p>依据实景照片与 Porsche Newsroom 的结构介绍整理。照片拍摄于 2018 年，不代表当前路面状态；标注位置用于阅读引导。</p><a href="https://newsroom.porsche.com/en/2020/motorsports/porsche-nuerburgring-nordschleife-caracciola-karussell-22455.html" target="_blank" rel="noreferrer">阅读 Porsche Newsroom 原文 <ArrowUpRight size={15} /></a><span>资料复核 / 2026-09-12</span></div><Link className="ed-text-link" to="/corners/karussell">完整弯角档案 <ArrowUpRight size={18} /></Link></section>
  </article>;
}
