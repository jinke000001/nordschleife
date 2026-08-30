import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion.js';

export default function useParallax(speed = 0.3) {
  const ref = useRef(null);
  const rafId = useRef(null);
  const isVisible = useRef(false);
  const elTop = useRef(0);
  const elHeight = useRef(0);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return undefined;

    let viewH = window.innerHeight;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      elTop.current = rect.top + window.scrollY;
      elHeight.current = rect.height;
      viewH = window.innerHeight;
    };
    measure();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (entry.isIntersecting && !rafId.current) {
          rafId.current = requestAnimationFrame(updateParallax);
        } else if (!entry.isIntersecting && rafId.current) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
      },
      { rootMargin: '10% 0px' }
    );
    observer.observe(el);

    const updateParallax = () => {
      if (!isVisible.current) return;

      const scrollY = window.scrollY;
      const midpoint = (elTop.current - scrollY) + elHeight.current / 2 - viewH / 2;
      const offset = -(midpoint * speed);

      el.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
      rafId.current = requestAnimationFrame(updateParallax);
    };

    const onScroll = () => {
      if (isVisible.current && !rafId.current) {
        rafId.current = requestAnimationFrame(updateParallax);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      measure();
      if (isVisible.current && !rafId.current) {
        rafId.current = requestAnimationFrame(updateParallax);
      }
    };
    window.addEventListener('resize', onResize, { passive: true });

    if (el.getBoundingClientRect().top < viewH) {
      isVisible.current = true;
      rafId.current = requestAnimationFrame(updateParallax);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [speed, prefersReduced]);

  return ref;
}
