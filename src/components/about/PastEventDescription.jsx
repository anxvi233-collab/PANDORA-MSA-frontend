export default function PastEventDescription({ event }) {
  return (
    <section className="pe-desc" data-reveal>
      <p className="pe-label">Past Event</p>
      <h2>{event.title}</h2>
      <div className="pe-desc__cols">
        {event.description.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </section>
  );
}
