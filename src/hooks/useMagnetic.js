import { useCallback, useRef, useEffect } from 'react';

/**
 * useMagnetic Hook
 * Adds a subtle magnetic pull effect to an element based on mouse proximity.
 * @param {number} strength - How strongly the element is pulled (default: 0.3)
 * @param {number} radius - Proximity radius in pixels (default: 80)
 */
export default function useMagnetic(strength = 0.3, radius = 80) {
  const ref = useRef(null);
  const frameRef = useRef(0);
  const lastPointerRef = useRef(null);

  const applyMagneticPull = useCallback(() => {
    frameRef.current = 0;
    const pointer = lastPointerRef.current;
    if (!ref.current || !pointer) return;

    const { clientX, clientY } = pointer;
    const { left, top, width, height } = ref.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < radius) {
      const pullX = deltaX * strength;
      const pullY = deltaY * strength;
      ref.current.style.transform = `translate(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px)`;
    } else {
      ref.current.style.transform = 'translate(0px, 0px)';
    }
  }, [strength, radius]);

  const handleMouseMove = useCallback(
    (event) => {
      if (!ref.current) return;
      lastPointerRef.current = event;
      if (!frameRef.current) {
        frameRef.current = window.requestAnimationFrame(applyMagneticPull);
      }
    },
    [applyMagneticPull]
  );

  const handleMouseLeave = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    lastPointerRef.current = null;
    if (ref.current) {
      ref.current.style.transform = 'translate(0px, 0px)';
    }
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReduced || !canHover) return undefined;

    window.addEventListener('pointermove', handleMouseMove, { passive: true });
    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      window.removeEventListener('pointermove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return {
    ref,
    onMouseLeave: handleMouseLeave,
    style: {
      transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      display: 'inline-block', // Ensure transform works
    },
  };
}
