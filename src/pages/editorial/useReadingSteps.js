import { useEffect, useState } from 'react';
import { readingStep } from './reading-position.js';

// Reading owns the clock: no timers advance the content while the reader pauses.
export default function useReadingSteps(rootRef, selector = '[data-reading-step]', boundaryRatio = .42) {
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      // Collapsed content (display:none) has no layout box and is not a step.
      const nodes = [...root.querySelectorAll(selector)].filter(node => node.getClientRects().length > 0);
      const index = readingStep(nodes.map(node => node.getBoundingClientRect().top), innerHeight * boundaryRatio);
      // Steps may carry a data-label-index when the consumer's label order
      // survives collapsing (the circuit chapter hides gap rows).
      const node = index < 0 ? null : nodes[index];
      setActive(node?.dataset.labelIndex ? Number(node.dataset.labelIndex) : index);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, [rootRef, selector, boundaryRatio]);
  return active;
}
