import Corner from "./Corner";

export default function PastEventCard({ event, innerRef }) {
  return (
    <article className="pe-card" ref={innerRef}>
      <figure className="pe-card__img">
        <img src={event.cardImage} alt="Microsoft Student Ambassadors SRM group photo" />
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
      </figure>
      <div className="pe-card__text">
        <p>{event.cardText}</p>
        <div className="pe-script" aria-hidden="true">
          <span>{event.script}</span>
        </div>
      </div>
    </article>
  );
}
