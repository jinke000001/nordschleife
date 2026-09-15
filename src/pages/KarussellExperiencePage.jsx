import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import KarussellViewer from '../components/KarussellViewer.jsx';
import { KarussellSection } from '../components/KarussellDiagram.jsx';
import { exhibitChapters, karussellSources } from '../data/karussell-exhibit.js';
import photo from '../assets/karussell-wikimedia-1800.webp';
import useDocumentTitle from '../hooks/useDocumentTitle.js';
import '../styles/pages/karussell-experience.css';

export default function KarussellExperiencePage() {
  const [chapter, setChapter] = useState(1);
  const active = exhibitChapters[chapter];
  useDocumentTitle('Karussell · 三维弯道解读');
  return <article className="karussell-page">
    <Link className="back-link" to="/corners/karussell"><ArrowLeft size={16} /> 旋转木马弯角档案</Link>
    <header className="karussell-header">
      <div><p className="eyebrow">CORNER STUDY / 01</p><h1>Karussell<span>旋转木马 · 三维解读</span></h1></div>
      <p>平面地图上，它是一个回头弯。<br />转动视角，看看混凝土内槽如何塑造它的性格。</p>
    </header>
    <div className="karussell-exhibit">
      <KarussellViewer chapter={chapter} />
      <aside className="karussell-reading">
        <p className="karussell-small-label">读懂这个弯 / EXPLORE</p>
        <div className="karussell-chapters" aria-label="选择讲解章节">
          {exhibitChapters.map((item, index) => <button key={item.id} type="button" aria-pressed={chapter === index} onClick={() => setChapter(index)}><span>{item.number}</span>{item.label}</button>)}
        </div>
        <div className="karussell-chapter-copy" aria-live="polite" aria-atomic="true">
          <span className="karussell-chapter-number">{active.number}</span>
          <h2>{active.title}</h2><p>{active.text}</p>
        </div>
        <figure className="karussell-cross-section">
          <figcaption>路面横剖面 <span>槽内典型结构 · 示意</span></figcaption>
          <KarussellSection />
        </figure>
      </aside>
    </div>
    <p className="karussell-model-note">模型用于解释内倾与材质关系。曲率、坡度、尺寸及过渡段均为示意，不对应实测比例或推荐驾驶路线。</p>
    <section className="karussell-photo-story" aria-labelledby="karussell-photo-title">
      <figure>
        <img src={photo} alt="Karussell 实景：分块的浅色混凝土内槽与深色外侧沥青相接" width="1600" height="899" loading="lazy" />
        <figcaption><span>FIELD REFERENCE / 实景对照</span><a href={karussellSources[1].href} target="_blank" rel="noreferrer">Hejnjahns · CC0 1.0 ↗</a></figcaption>
      </figure>
      <div className="karussell-photo-copy">
        <p className="eyebrow">MATERIAL & FORM</p><h2 id="karussell-photo-title">把模型，放回真实路面。</h2>
        <p>照片里，混凝土板的接缝清晰可见，外侧沥青沿弯道展开。对照上方剖面，留意两种路面的衔接。</p>
        <p>这张照片拍摄于 2018 年。它提供实景参照，并不代表今天的路面状态。</p>
        <Link className="karussell-text-link" to="/corners/karussell">继续阅读弯角档案 <ArrowUpRight size={17} /></Link>
      </div>
    </section>
    <section className="karussell-sources" aria-labelledby="karussell-sources-title">
      <div><p className="eyebrow">SOURCES & METHOD</p><h2 id="karussell-sources-title">资料与模型说明</h2><p>资料复核：2026-09-12</p></div>
      <div>
        {karussellSources.map(source => <article key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.title} <ArrowUpRight size={14} /></a><p>{source.detail}</p></article>)}
        <p className="karussell-method-note">三维模型与二维图解为本站制作的结构示意，未使用第三方游戏模型或付费三维资产。</p>
      </div>
    </section>
  </article>;
}
