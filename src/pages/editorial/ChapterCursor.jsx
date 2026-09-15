import { useEffect, useRef } from 'react';
import { trailPhotos } from './story-photos.js';

// Decorative only: native pointer, links, touch, and keyboard remain unchanged.
export default function ChapterCursor({ rootRef, staticMode = false }) {
  const trailRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    const stamps = [...trailRef.current.children];
    const media = matchMedia('(pointer: fine) and (hover: hover) and (prefers-reduced-motion: no-preference)');
    let lastX = -1000, lastY = -1000, index = 0;
    function hide() {
      stamps.forEach(stamp => stamp.getAnimations().forEach(animation => animation.cancel()));
      lastX = -1000;
    }
    function move(event) {
      if (staticMode || !media.matches || event.pointerType !== 'mouse') return;
      const area = event.target.closest('[data-photo-trail]');
      if (!area || event.target.closest('a, button, summary')) { hide(); return; }
      const targetX = event.clientX;
      const targetY = event.clientY;
      if (Math.hypot(targetX - lastX, targetY - lastY) > 130) {
        const stamp = stamps[index % stamps.length];
        index += 1;
        stamp.getAnimations().forEach(animation => animation.cancel());
        stamp.style.left = Math.min(innerWidth - 150, Math.max(8, targetX - 65)) + 'px';
        stamp.style.top = Math.min(innerHeight - 112, Math.max(8, targetY - 45)) + 'px';
        stamp.animate([{ opacity: 0, transform: 'translateY(10px) scale(.9)' }, { opacity: .9, offset: .18, transform: 'rotate(' + (index % 2 ? -5 : 5) + 'deg)' }, { opacity: 0, transform: 'translateY(-28px) scale(.94)' }], { duration: 850, easing: 'ease-out' });
        lastX = targetX; lastY = targetY;
      }
    }
    root.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', hide);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('blur', hide);
    window.addEventListener('keydown', hide);
    document.addEventListener('visibilitychange', hide);
    media.addEventListener('change', hide);
    return () => {
      hide();
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', hide);
      window.removeEventListener('scroll', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('keydown', hide);
      document.removeEventListener('visibilitychange', hide);
      media.removeEventListener('change', hide);
    };
  }, [rootRef, staticMode]);
  return <div className="story-pointer-layer" aria-hidden="true"><div ref={trailRef}>{trailPhotos.map(photo => <img className="story-pointer-photo" key={photo.thumb} src={photo.thumb} alt="" width="144" height="100" loading="lazy" decoding="async" />)}</div></div>;
}
