import { useLayoutEffect } from 'react';
import { horizontalPosition } from './chapter-motion.js';

// Progressive enhancement: ordinary document flow is the default and fallback.
export default function useChapterMotion(rootRef, staticMode = false) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const desktop = matchMedia('(min-width: 1000px) and (min-height: 600px) and (pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const scene = root.querySelector('.journey-scene');
    const viewport = scene.querySelector('.journey-viewport');
    const rail = scene.querySelector('.journey-rail');
    const cover = root.querySelector('.ed-cover');
    const drifting = [...root.querySelectorAll('[data-drift]')];
    let frame = 0;
    let travel = 0;
    let enhanced = false;
    // Full-page capture tools resize the viewport to the entire document height;
    // viewport-relative (svh) layouts would explode, so present the static fallback there.
    const captureViewport = () => innerHeight > innerWidth * 2;
    let staticView = false;

    function draw() {
      frame = 0;
      if (document.hidden || reduced.matches || staticMode || staticView) return;
      if (enhanced) {
        const { offset, progress } = horizontalPosition(scene.getBoundingClientRect().top, rail.scrollWidth, viewport.clientWidth);
        rail.style.transform = `translate3d(${-offset}px,0,0)`;
        scene.style.setProperty('--journey-progress', progress);
      }
      const rect = cover.getBoundingClientRect();
      cover.style.setProperty('--cover-progress', Math.min(1, Math.max(0, -rect.top / rect.height)));
      for (const element of drifting) {
        const box = element.getBoundingClientRect();
        if (box.bottom > -100 && box.top < innerHeight + 100) {
          element.style.setProperty('--drift', Math.max(-1, Math.min(1, (innerHeight / 2 - box.top) / innerHeight)));
        }
      }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
    function measure() {
      staticView = captureViewport();
      enhanced = desktop.matches && !reduced.matches && !staticMode && !staticView;
      root.classList.toggle('story-motion', !reduced.matches && !staticMode && !staticView);
      root.classList.toggle('story-static', reduced.matches || staticMode || staticView);
      scene.style.setProperty('--scene-width', viewport.clientWidth + 'px');
      scene.classList.toggle('is-horizontal', enhanced);
      travel = enhanced ? Math.max(0, rail.scrollWidth - viewport.clientWidth) : 0;
      if (enhanced) scene.style.height = `${viewport.clientHeight + travel + 160}px`;
      else {
        scene.style.removeProperty('height');
        rail.style.removeProperty('transform');
        scene.style.removeProperty('--journey-progress');
      }
      if (reduced.matches || staticMode || staticView) {
        cover.style.removeProperty('--cover-progress');
        drifting.forEach(element => element.style.removeProperty('--drift'));
      }
      schedule();
    }
    // Bring offscreen panels into view when reached with Tab (no hidden focus).
    function revealFocus(event) {
      if (!enhanced) return;
      const panel = event.target.closest('[data-journey-panel]');
      if (!panel) return;
      const top = scene.getBoundingClientRect().top + scrollY;
      const panelOffset = panel.getBoundingClientRect().left - rail.getBoundingClientRect().left;
      const inset = panel.classList.contains('journey-detail') ? 24 : 0;
      window.scrollTo({ top: top + Math.min(travel, Math.max(0, panelOffset - inset)), behavior: 'instant' });
    }
    const reveals = [...root.querySelectorAll('.field-heading, .field-notes figure, .machine-heading, .machine-contact-sheet figure, .machine-wide, .story-timing-heading')];
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    reveals.forEach(element => { element.classList.add('story-reveal'); revealObserver.observe(element); });
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(rail);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', schedule);
    desktop.addEventListener('change', measure);
    reduced.addEventListener('change', measure);
    rail.addEventListener('focusin', revealFocus);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      revealObserver.disconnect();
      reveals.forEach(element => element.classList.remove('story-reveal', 'is-revealed'));
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', schedule);
      desktop.removeEventListener('change', measure);
      reduced.removeEventListener('change', measure);
      rail.removeEventListener('focusin', revealFocus);
      root.classList.remove('story-motion');
    };
  }, [rootRef, staticMode]);
}
