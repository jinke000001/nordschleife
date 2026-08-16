import { useEffect } from 'react';

/**
 * useTilt3D
 * Applies a subtle 3D perspective tilt effect to all elements matching `selector`
 * on mouse-move. Uses CSS custom properties for GPU-composited transforms.
 * Respects prefers-reduced-motion.
 *
 * @param {string} selector  – CSS selector for tiltable elements
 * @param {number} maxDeg    – Max rotation degrees (default 6)
 */
export default function useTilt3D(selector = '.corner-card, .brand-badge', maxDeg = 6) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const isTouchOnly = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouchOnly) return;

    const elements = Array.from(document.querySelectorAll(selector));
    if (!elements.length) return;

    const handlers = elements.map((el) => {
      let frameId = 0;
      let rect = null;
      let latestEvent = null;

      const applyTilt = () => {
        frameId = 0;
        if (!latestEvent || !rect) return;

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (latestEvent.clientX - cx) / (rect.width / 2);
        const dy = (latestEvent.clientY - cy) / (rect.height / 2);
        const rotX = -dy * maxDeg;
        const rotY = dx * maxDeg;
        el.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.03,1.03,1.03)`;
      };

      const onEnter = () => {
        rect = el.getBoundingClientRect();
        el.style.willChange = 'transform';
      };

      const onMove = (e) => {
        latestEvent = e;
        if (!rect) rect = el.getBoundingClientRect();
        if (!frameId) {
          frameId = window.requestAnimationFrame(applyTilt);
        }
      };

      const onLeave = () => {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = 0;
        }
        latestEvent = null;
        rect = null;
        el.style.transform = '';
        el.style.willChange = '';
      };

      const onResize = () => {
        rect = null;
      };

      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointermove', onMove, { passive: true });
      el.addEventListener('pointerleave', onLeave);
      window.addEventListener('resize', onResize, { passive: true });
      return {
        el,
        onEnter,
        onMove,
        onLeave,
        onResize,
        cancelFrame: () => {
          if (frameId) {
            window.cancelAnimationFrame(frameId);
            frameId = 0;
          }
        }
      };
    });

    return () => {
      handlers.forEach(({ el, onEnter, onMove, onLeave, onResize, cancelFrame }) => {
        cancelFrame();
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('resize', onResize);
        el.style.willChange = '';
        el.style.transform = '';
      });
    };
  }, [selector, maxDeg]);
}
