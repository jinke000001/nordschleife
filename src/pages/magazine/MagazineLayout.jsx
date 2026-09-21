import { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import '../../pages/editorial/editorial.css';
import './site.css';

import PagePosition from './PagePosition.jsx';

export default function MagazineLayout() {
  const { pathname } = useLocation();
  const chipRef = useRef(null);
  const navRef = useRef(null);
  useLayoutEffect(() => {
    document.body.classList.add('editorial-preview-active');
    return () => document.body.classList.remove('editorial-preview-active');
  }, []);
  // The single-row mobile nav can overflow on narrow screens: keep the active
  // section scrolled into view when the route changes.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !matchMedia('(max-width: 760px)').matches) return;
    const current = nav.querySelector('[aria-current]');
    if (!current || nav.scrollWidth <= nav.clientWidth) return;
    // Center the active item with a programmatic scroll: scrollIntoView would
    // move the sequential focus starting point and break Tab order.
    const navBox = nav.getBoundingClientRect();
    const itemBox = current.getBoundingClientRect();
    nav.scrollLeft += (itemBox.left + itemBox.width / 2) - (navBox.left + navBox.width / 2);
  }, [pathname]);
  // The floating return chip must never cover page controls: hide it while its
  // box intersects any interactive element inside <main>.
  useEffect(() => {
    const chip = chipRef.current;
    if (!chip) return undefined;
    let frame = 0;
    const check = () => {
      frame = 0;
      const box = chip.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const controls = document.querySelectorAll('main a, main button, main input, main select, main textarea, main summary, main label, main [role="button"]');
      let overlap = false;
      for (const control of controls) {
        if (control === chip || chip.contains(control)) continue;
        const rect = control.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        if (rect.left < box.right && rect.right > box.left && rect.top < box.bottom && rect.bottom > box.top) {
          overlap = true;
          break;
        }
      }
      chip.classList.toggle('is-overlapping', overlap);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(check); };
    const main = document.getElementById('ed-content');
    const observer = new ResizeObserver(schedule);
    if (main) observer.observe(main);
    check();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);
  return <div className="ed-site mg-site">
    <a className="ed-skip" href="#ed-content">跳到正文</a>
    <header className="ed-header mg-header">
      <Link className="ed-wordmark" to="/">NORDSCHLEIFE<span>纽博格林北环中文指南</span></Link>
      <nav ref={navRef} aria-label="主导航">
        <NavLink to="/" end>认识纽北</NavLink>
        <NavLink to="/corners">弯道档案</NavLink>
        <NavLink to="/brands">品牌与车</NavLink>
        <NavLink to="/lap-times">圈速档案</NavLink>
      </nav>
      <span className="mg-header-note">A FIELD GUIDE<br />BY JINKE</span>
    </header>
    <main id="ed-content" tabIndex={-1}>
      {pathname !== '/' && <Link ref={chipRef} className="return-to-guide" to="/" state={{ resumeGuide: true, fallbackId: pathname.startsWith('/brands') ? 'machines' : pathname.startsWith('/lap-times') ? 'time' : 'circuit' }}>← 返回导览</Link>}
      <Suspense fallback={<div className="mg-loading" role="status">正在展开这一页…</div>}>
        <PagePosition />
        <div key={pathname}><Outlet /></div>
      </Suspense>
    </main>
    <footer className="ed-footer mg-footer">
      <Link to="/">NORDSCHLEIFE</Link>
      <div><p>从弯道、汽车与时间，认识绿色地狱。</p><p>Jinke 的纽北中文指南 · 非官方赛道文化项目</p></div>
      <span>INDEPENDENT GUIDE<br />EIFEL · GERMANY</span>
    </footer>
  </div>;
}
