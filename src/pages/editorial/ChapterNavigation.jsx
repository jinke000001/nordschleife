import { useRef, useState } from 'react';
import { ArrowUp, List, X } from 'lucide-react';
import useReadingSteps from './useReadingSteps.js';
const chapters = [
  ['field-notes', '森林'], ['corner-journey', '影像'], 
  ['circuit', '赛道'], ['machines', '汽车'], ['time', '时间'],
];
export default function ChapterNavigation({ rootRef }) {
  const active = useReadingSteps(rootRef, '[data-guide-chapter]');
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);
  const close = () => { setOpen(false); toggle.current?.focus(); };
  return <nav className={`guide-navigation${active >= 0 ? ' is-visible' : ''}${open ? ' is-open' : ''}`} aria-label="导览章节" onKeyDown={event => { if (event.key === 'Escape') close(); }}>
    <button className="guide-nav-toggle" ref={toggle} type="button" aria-expanded={open} aria-controls="guide-nav-links" onClick={() => setOpen(!open)}>{open ? <X size={17} /> : <List size={17} />}<span>{active >= 0 ? `0${active + 1} ${chapters[active][1]}` : '章节'}</span></button>
    <div id="guide-nav-links">{chapters.map(([id, title], index) => <a key={id} href={`#${id}`} aria-label={`第 ${index + 1} 章：${title}`} aria-current={active === index ? 'location' : undefined} onClick={() => setOpen(false)}><span className="guide-nav-name">{title}</span><span className="guide-nav-number">0{index + 1}</span></a>)}<a href="#guide-start" aria-label="回到导览开头" onClick={() => setOpen(false)}><span className="guide-nav-name">回到开头</span><ArrowUp size={15} /></a></div>
  </nav>;
}
