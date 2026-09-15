import { useState } from 'react';
import OptimizedImage, { jpgByBasename } from '../../components/OptimizedImage.jsx';

export function BrandPhoto({ basename, alt, eager = false, position }) {
  const [failed, setFailed] = useState(false);
  if (failed || !jpgByBasename[basename]) {
    return <div className="mg-brand-photo-fallback" role="img" aria-label={`${alt}，图片暂不可用`}><span>图片暂不可用</span><small>{alt}</small></div>;
  }
  return <OptimizedImage basename={basename} alt={alt} width="1600" height="1000" loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" style={position ? { objectPosition: position } : undefined} onError={() => setFailed(true)} />;
}

export function PhotoCredit({ credit, href }) {
  if (!credit) return null;
  return <figcaption className="mg-brand-photo-credit">{href ? <a href={href} target="_blank" rel="noreferrer">{credit} ↗</a> : credit}</figcaption>;
}

export function BrandLogo({ brand }) {
  const [failed, setFailed] = useState(false);
  return brand.logoBasename && !failed ? <img className="mg-brand-logo" src={`/logos/${brand.logoBasename}.svg`} alt="" width="80" height="80" onError={() => setFailed(true)} /> : null;
}
