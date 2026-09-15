import { roadPoint } from '../three/karussell-shape.js';

export function KarussellPlan({ progress = .5 }) {
  const point = (t, r) => { const [x, , z] = roadPoint(t, r); return [250 + x * 7, 230 - z * 7]; };
  const strip = (inner, outer) => {
    const points = Array.from({ length: 81 }, (_, i) => point(i / 80, outer))
      .concat(Array.from({ length: 81 }, (_, i) => point(1 - i / 80, inner)));
    return `M${points.map(p => p.join(',')).join(' L')} Z`;
  };
  const current = point(progress, 14.5);
  return <svg viewBox="0 0 500 350" className="karussell-plan" role="img" aria-label="弯道俯视示意：浅色内圈为混凝土，深色外圈为沥青，红点为当前讲解位置">
    <circle cx="250" cy="185" r="175" fill="#303e39" stroke="#52625a" />
    <path d={strip(17, 23)} fill="#474e53" stroke="#94a1a5" />
    <path d={strip(12, 17)} fill="#c0bfb1" stroke="#d6d2be" />
    {Array.from({ length: 35 }, (_, i) => { const a = point(i / 34, 12); const b = point(i / 34, 17); return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#7f847a" strokeWidth="1" />; })}
    <circle cx={current[0]} cy={current[1]} r="8" fill="#f04438" stroke="#ffdbbe" strokeWidth="3" />
    <text x="250" y="190" textAnchor="middle" fill="#c9d3c8" fontSize="12" letterSpacing="3">KARUSSELL</text>
    <text x="90" y="319" fill="#d4d8d4" fontSize="13">01 入槽</text>
    <text x="346" y="319" fill="#d4d8d4" fontSize="13">03 出槽</text>
  </svg>;
}

export function KarussellSection() {
  return <svg className="karussell-section" viewBox="0 0 400 205" role="img" aria-label="路面横剖面示意：左侧是较低的内侧，混凝土向右上方倾斜，衔接外侧较平缓的沥青；非测量比例">
    <path d="M25 146 L185 78 L375 78 L375 158 L25 158 Z" fill="#283333" />
    <path d="M25 146 L185 78" stroke="#c4c1af" strokeWidth="9" />
    <path d="M185 78 L375 78" stroke="#6a767a" strokeWidth="9" />
    <path d="M25 161 L375 161" stroke="#55625f" strokeDasharray="3 5" />
    <text x="42" y="94" fill="#d8d3bf" fontSize="13">混凝土内倾槽</text>
    <text x="242" y="52" fill="#c8d0d3" fontSize="13">外侧沥青</text>
    <text x="25" y="190" fill="#a8b4b0" fontSize="12">内侧 / 低</text>
    <text x="290" y="190" fill="#a8b4b0" fontSize="12">外侧 / 高</text>
  </svg>;
}
