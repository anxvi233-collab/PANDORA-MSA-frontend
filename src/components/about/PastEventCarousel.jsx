import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PastEventCarousel({ images }) {
  const [idx, setIdx] = useState(0);
  const cur = useRef(0);
  const track = useRef(null);
  const drag = useRef({ on: false, x: 0, dx: 0 });

  const focusSlides = (n, d) =>
    gsap.to(track.current.children, {
      opacity: (k) => (k === n ? 1 : 0.3),
      scale: (k) => (k === n ? 1 : 0.92),
      duration: d,
      ease: "power3.out",
    });

  useLayoutEffect(() => {
    focusSlides(0, 0);
  }, []);

  const go = (n) => {
    n = Math.max(0, Math.min(images.length - 1, n));
    cur.current = n;
    setIdx(n);
    const d = reduce() ? 0 : 0.8;
    gsap.to(track.current, { xPercent: -100 * n, x: 0, duration: d, ease: "power3.out" });
    focusSlides(n, d);
  };

  const down = (e) => {
    drag.current = { on: true, x: e.clientX, dx: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d.on) return;
    d.dx = e.clientX - d.x;
    gsap.set(track.current, { x: d.dx });
  };
  const up = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    go(cur.current + (d.dx < -60 ? 1 : d.dx > 60 ? -1 : 0));
  };

  return (
    <section className="pe-carousel" data-reveal aria-label="Past event photographs">
      <div className="pe-carousel__view" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className="pe-carousel__track" ref={track}>
          {images.map((src, i) => (
            <div className="pe-slide" key={src} aria-hidden={i !== idx}>
              <div className="pe-slide__frame" data-label={`Photo ${i + 1}`}>
                <img src={src} alt={`Past event photo ${i + 1}`} draggable="false" loading={i ? "lazy" : "eager"} onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pe-carousel__bar">
        <div className="pe-dots">
          {images.map((_, i) => (
            <button key={i} className={i === idx ? "on" : ""} onClick={() => go(i)} aria-label={`Go to photo ${i + 1}`} />
          ))}
        </div>
        <div className="pe-arrows">
          <button onClick={() => go(idx - 1)} disabled={idx === 0} aria-label="Previous photo">&lt;</button>
          <button onClick={() => go(idx + 1)} disabled={idx === images.length - 1} aria-label="Next photo">&gt;</button>
        </div>
      </div>
    </section>
  );
}
