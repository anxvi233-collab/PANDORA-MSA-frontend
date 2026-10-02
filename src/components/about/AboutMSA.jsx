import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { pastEvents, pastWinner } from "../../data/aboutData";
import PastEventCard from "./PastEventCard";
import PastEventCarousel from "./PastEventCarousel";
import PastEventDescription from "./PastEventDescription";
import PastWinner from "./PastWinner";
import "./about.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutMSA({ navigate }) 
 {
  const [i, setI] = useState(0);
  const root = useRef(null);
  const card = useRef(null);
  const event = pastEvents[i];

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".about__eyebrow, .about__title", { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.2)
        .from(".about__nav", { opacity: 0, duration: 0.6 }, 0.6)
        .from(".pe-card", { y: 50, opacity: 0, duration: 1 }, 0.5)
        .from(".pe-card__img", { x: -30, opacity: 0, duration: 1 }, 0.7)
        .from(".pe-card__text", { x: 30, opacity: 0, duration: 1 }, 0.85);
      gsap.utils.toArray("[data-reveal]").forEach((el) =>
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const change = (d) => {
    const n = (i + d + pastEvents.length) % pastEvents.length;
    if (n === i) return;
    gsap.to(card.current, {
      opacity: 0, duration: 0.25,
      onComplete: () => { setI(n); gsap.to(card.current, { opacity: 1, duration: 0.5 }); },
    });
  };

  return (
    <main className="past-events-page" ref={root}>
  <div className="past-events-bg" />

      <div className="about__inner">
        <header className="about__head">
          <div>
            <p className="about__eyebrow">by the way, some stuff...</p>
            <h1 className="about__title">
              <span className="t-bright">About us</span> <span className="t-muted">and our <span className="t-ul">Past Events</span></span>
            </h1>
          </div>
          <div className="about__nav" role="group" aria-label="Switch past event">
            <button onClick={() => change(-1)} aria-label="Previous event">&lt;</button>
            <button onClick={() => change(1)} aria-label="Next event">&gt;</button>
          </div>
        </header>

        <PastEventCard event={event} innerRef={card} />
        <PastEventCarousel key={i} images={event.images} />
        <PastEventDescription event={event} />
        <PastWinner winner={pastWinner} />
      </div>
    </main>
  );
}
