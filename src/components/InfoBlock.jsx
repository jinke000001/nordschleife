export default function InfoBlock({ title, content, variant }) {
  return (
    <section className={`info-block${variant ? ` ${variant}` : ''}`}>
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
}
