import { useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import EditorialHome from './EditorialHome.jsx';
import EditorialKarussell from './EditorialKarussell.jsx';
import useDocumentTitle from '../../hooks/useDocumentTitle.js';
import './editorial.css';

export const EDITORIAL_ROOT = '/preview/editorial';

export default function EditorialPreview() {
  const { pathname, hash } = useLocation();
  const isStudy = pathname === `${EDITORIAL_ROOT}/karussell`;
  useDocumentTitle(isStudy ? 'Karussell · 实景解读样稿' : '绿色地狱 · 杂志样稿');
  useLayoutEffect(() => {
    document.body.classList.add('editorial-preview-active');
    return () => document.body.classList.remove('editorial-preview-active');
  }, []);
  useLayoutEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); return; }
    const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'instant' }));
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return <div className="ed-site">
    <a className="ed-skip" href="#ed-content">跳到正文</a>
    <header className="ed-header">
      <Link className="ed-wordmark" to={EDITORIAL_ROOT} aria-label="Nordschleife 样稿首页">NORDSCHLEIFE<span>纽博格林北环中文指南</span></Link>
      <nav aria-label="样稿导航">
        <Link to={EDITORIAL_ROOT} aria-current={!isStudy ? 'page' : undefined}>认识纽北</Link>
        <Link to={`${EDITORIAL_ROOT}/karussell`} aria-current={isStudy ? 'page' : undefined}>读懂一个弯</Link>
      </nav>
      <Link className="ed-original" to={isStudy ? '/experience/karussell' : '/'}>现版对照 <ArrowUpRight size={16} /></Link>
    </header>
    <main id="ed-content" key={pathname} tabIndex={-1}>
      {isStudy ? <EditorialKarussell /> : <EditorialHome />}
    </main>
    <footer className="ed-footer">
      <Link to={EDITORIAL_ROOT}>NORDSCHLEIFE</Link>
      <p>Jinke 的纽北中文指南 · 非官方赛道文化项目</p>
      <span>视觉样稿 / 2026</span>
    </footer>
  </div>;
}
