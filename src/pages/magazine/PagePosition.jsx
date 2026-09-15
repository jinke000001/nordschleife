import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { restoreTop } from '../editorial/reading-position.js';

const positions = new Map();
let lastGuide = null;
try { lastGuide = JSON.parse(sessionStorage.getItem('nord-guide-position')); } catch { /* Storage can be unavailable. */ }

function capture(pathname) {
  const top = window.scrollY;
  const sections = [...document.querySelectorAll('[data-reading-position]')];
  const section = sections.filter(node => node.getClientRects().length > 0 && node.getBoundingClientRect().top <= 80).at(-1);
  const rect = section?.getBoundingClientRect();
  return { pathname, top, width: innerWidth, height: innerHeight, section: section?.id,
    progress: rect?.height ? -rect.top / rect.height : 0 };
}

export default function PagePosition() {
  const location = useLocation();
  const navigation = useNavigationType();
  useLayoutEffect(() => {
    const { key, pathname, hash, state } = location;
    const entryKey = `${key}:${hash}`;
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    let saved = navigation === 'POP' ? positions.get(entryKey) : null;
    if (state?.resumeGuide) saved = lastGuide;
    let id = hash.slice(1) || (state?.resumeGuide ? state.fallbackId : '');
    if (id === 'karussell-reading') id = 'circuit';
    try { id = decodeURIComponent(id); } catch { /* An invalid fragment stays harmless. */ }
    let frame = 0;
    let settling = true;
    let snapshot = null;
    const record = () => { if (!settling) snapshot = capture(pathname); };
    const remember = () => {
      if (!snapshot) return;
      positions.set(entryKey, snapshot);
      if (positions.size > 40) positions.delete(positions.keys().next().value);
      if (pathname === '/') {
        lastGuide = snapshot;
        try { sessionStorage.setItem('nord-guide-position', JSON.stringify(snapshot)); } catch { /* Keep in-memory restoration. */ }
      }
    };
    const restore = () => {
      frame = 0;
      if (!settling) return;
      if (saved?.pathname === pathname) {
        const node = document.getElementById(saved.section);
        const rect = node?.getBoundingClientRect();
        window.scrollTo({ top: restoreTop(saved, { width: innerWidth, height: innerHeight }, rect ? { top: rect.top + scrollY, height: rect.height } : null), behavior: 'instant' });
      } else if (id) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
      } else window.scrollTo({ top: 0, behavior: 'instant' });
      snapshot = capture(pathname);
    };
    const schedule = () => { if (!frame && settling) frame = requestAnimationFrame(restore); };
    const stop = () => { settling = false; cancelAnimationFrame(frame); observer.disconnect(); record(); };
    const onKey = event => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Tab'].includes(event.key)) stop(); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.getElementById('ed-content'));
    schedule();
    const timer = window.setTimeout(stop, 900);
    window.addEventListener('scroll', record, { passive: true });
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('pagehide', remember);
    return () => {
      remember();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      history.scrollRestoration = oldRestoration;
      window.removeEventListener('scroll', record);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pagehide', remember);
    };
  }, [location, navigation]);
  return null;
}
