export default function SectionHeader({ eyebrow, title, children, titleTag = 'h2' }) {
  const TitleTag = titleTag;

  return (
    <div className="section-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <TitleTag>{title}</TitleTag>
      {children && <p>{children}</p>}
    </div>
  );
}
