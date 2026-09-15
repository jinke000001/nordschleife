export const observations = [
  { label: '混凝土内槽', title: '弯道的性格，\n藏在浅色路面里。', text: '视线沿着浅色混凝土向弯内延伸。这部分路面向内侧降低，是旋转木马最容易辨认的结构。', detail: '观察重点：内侧低，外侧高。', x: 66, y: 64 },
  { label: '外侧沥青', title: '同一个弯，\n另一种路面。', text: '混凝土外侧是深色沥青。照片中的材质边界清楚可见；对照下方剖面，可以进一步理解两者如何衔接。', detail: '观察重点：两种材质的分界。', x: 88, y: 48 },
  { label: '板块接缝', title: '看见接缝，\n也就看见了构造。', text: '混凝土由一块块板面组成。接缝横向穿过内槽，让弯道的曲线有了可以辨认的节奏。', detail: '观察重点：横向贯穿板面的细线。', x: 57, y: 38 },
];

export function SectionDrawing({ active }) {
  return <svg viewBox="0 0 560 230" role="img" aria-label="结构示意：左侧混凝土内槽较低，向右上方升高，与外侧沥青相接；非实测比例">
    <path d="M35 155 L275 69 L525 69 L525 165 L35 165 Z" fill="#e1e1dc" />
    <path d="M35 155 L275 69" fill="none" stroke={active === 0 ? '#c93326' : '#72736c'} strokeWidth="8" />
    <path d="M275 69 L525 69" fill="none" stroke={active === 1 ? '#c93326' : '#313735'} strokeWidth="8" />
    <path d="M35 182 H525" fill="none" stroke="#b4b8b1" strokeDasharray="3 5" />
    <text x="50" y="79">混凝土内槽</text><text x="365" y="43">外侧沥青</text>
    <text x="35" y="215" className="ed-section-muted">内侧 / 低</text><text x="455" y="215" className="ed-section-muted">外侧 / 高</text>
  </svg>;
}

