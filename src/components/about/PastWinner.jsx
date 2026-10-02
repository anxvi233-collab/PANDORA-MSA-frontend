import Corner from "./Corner";

export default function PastWinner({ winner }) {
  return (
    <section className="pe-winner" data-reveal>
      <figure className="pe-winner__img" data-label="Winner photo">
        <img src={winner.image} alt={winner.team} onError={(e) => (e.currentTarget.style.display = "none")} />
        <Corner pos="tl" />
        <Corner pos="br" />
      </figure>
      <div className="pe-winner__text">
        <p className="pe-label">{winner.label}</p>
        <h2>{winner.team}</h2>
        <p className="pe-winner__event">{winner.event}</p>
        <p>{winner.description}</p>
        <ul>
          {winner.members.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
