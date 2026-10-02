import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import AboutMSA from "./components/about/AboutMSA.jsx";
import Registration from "./Registration.jsx";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const P =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium";

const tracks = [
  ["A", "Medi-medi-medi"],
  ["B", "Brampton"],
  ["C", "cAT-eATS-eVERYTHING"],
  ["D", "Sula"],
];

const milestones = [
  ["WEEK 01", "Registrations Open"],
  ["WEEK 02", "Problem Statements Revealed"],
  ["WEEK 03", "Submissions"],
  ["WEEK 04", "Shortlisting"],
  ["FINAL", "Showcase / Closing"],
];

function Corner({ className }) {
  return (
    <span className={`cn ${className}`}>
      <svg>
        <use href="#cr" />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* LANDING PAGE (everything that used to be the whole App)             */
/* ------------------------------------------------------------------ */
function Landing({ navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const trkRef = useRef(null);
  const barRef = useRef(null);

  /* opens another "page" without reloading */
  const goTo = (to) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(to);
  };

  /* navbar turns translucent once the page is scrolled */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const links = document.querySelectorAll("[data-go]");

      const go = (e) => {
        e.preventDefault();
        setMenuOpen(false);
        gsap.to(window, {
          scrollTo: { y: e.currentTarget.getAttribute("href"), autoKill: true },
          duration: 1.4,
          ease: "power3.inOut",
        });
      };

      links.forEach((a) => a.addEventListener("click", go));

      gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .from(".nav", { opacity: 0, duration: 0.8 })
        .from(".bgimg", { opacity: 0, duration: 1.2 }, 0)
        .from(".cn", { opacity: 0, duration: 0.8 }, 0.5)
        .from(
          ".pns i,.eb,#t,.ide>*",
          { opacity: 0, y: 10, duration: 0.8, stagger: 0.07 },
          0.4
        );

      gsap.utils.toArray("[data-r]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 20,
          duration: 0.9,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      const trk = trkRef.current;
      const bar = barRef.current;
      const d = () => Math.max(0, trk.scrollWidth - window.innerWidth);

      const mv = gsap.to(trk, {
        x: () => -d(),
        ease: "none",
        scrollTrigger: {
          trigger: "#journey",
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + (d() + window.innerHeight * 0.5),
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            gsap.set(bar, { scaleX: s.progress });
          },
        },
      });

      gsap.utils.toArray(".ms").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.2 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation: mv,
              start: "left 90%",
              end: "left 55%",
              scrub: true,
            },
          }
        );
        gsap.to(el, {
          opacity: 0.45,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            containerAnimation: mv,
            start: "left 25%",
            end: "left 0%",
            scrub: true,
          },
        });
      });

      /* Navbar turns white over the dark sections (About, Journey) */
      [".about", "#journey"].forEach((sel) => {
        ScrollTrigger.create({
          trigger: sel,
          start: "top 40px",
          end: sel === "#journey" ? "max" : "bottom 40px",
          onToggle: (self) => setOnDark(self.isActive),
        });
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);

      return () => {
        links.forEach((a) => a.removeEventListener("click", go));
        window.removeEventListener("load", refresh);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <symbol id="cr" viewBox="0 0 62 62">
          <path d="M60 2H2V44L16 60M60 14H14V34M14 34H26V26H38V20H48" />
        </symbol>
      </svg>

      {/* NAVBAR */}
      <header
        className={`nav ${onDark ? "on-dark" : ""} ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}
      >
        <a className="brand" href="#home" data-go>
          PANDORA
        </a>

        <button id="tg" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? "CLOSE" : "MENU"}
        </button>

        <nav className={`links ${menuOpen ? "open" : ""}`} id="lk">
          <a href="#home" data-go>
            MSA
          </a>
          <a href="#journey" data-go>
            Journey (The Present)
          </a>

          {/* REGISTRATION PAGE */}
          <a href="/register" onClick={goTo("/register")}>
            Register
          </a>

          {/* ABOUT MSA */}
          <a href="https://msasrm.in/" target="_blank" rel="noreferrer">
            About MSA
          </a>

          {/* PAST EVENT PAGE */}
          <a
  href="/past-events"
  onClick={(e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate("/past-events");
  }}
>
  Past Event
</a>


          <a className="off" href="#">
            Sponsors
          </a>
        </nav>
      </header>

      {/* LANDING */}
      <section className="land" id="home">
        <div className="bgimg" />

        <div className="card">
          <div className="pns">
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="tb">
            <Corner className="a" />
            <Corner className="b" />
            <Corner className="d" />
            <Corner className="e" />

            <p className="eb">Microsoft Student Ambassadors SRM</p>
            <h1 id="t">Pandora</h1>
          </div>

          <div className="ide">
            <h2>The Ideology</h2>

            <p>
              {P} totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
              et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
              ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia consequuntur magni dolores eos qui ratione voluptatem
              sequi nesciunt. Neque porro quisquam est?
            </p>

            <p>
              {P} totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
              et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
              ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
              sed quia cons
            </p>

            <p className="dm">◇◇◇◇◇◇◇◇◇◇◇◇◇◇</p>
          </div>
        </div>
      </section>

      {/* ABOUT EVENT */}
      <section className="about" id="about">
        <div className="ah">
          <h2 data-r>
            A Challenge
            <small>worth entering</small>
          </h2>

          <p data-r>
            Pandora is a space for
            <br />
            ideas that <em>refuse to stay ordinary</em>
          </p>
        </div>

        <div>
          <div className="gr" data-r>
            <div>
              <span>Date</span>
              <b>23rd October 2026</b>
            </div>

            <div>
              <span>Team</span>
              <b>3 to 4 members</b>
              <small>are allowed per team</small>
            </div>

            <div>
              <span>Venue</span>
              <b>TP Ganeshan Mini Hall 1</b>
              <small>
                SRM Institute of Science and Technology, Kattankulathur
              </small>
            </div>

            <div>
              <span>Eligibility</span>
              <b>Enrolled Students</b>
              <small>
                1st, 2nd, 3rd years in Engineering B.Tech, School of Computing,
                SRM IST
              </small>
            </div>

            <div>
              <span>Registration</span>
              <b>
                <sup>₹</sup>200
              </b>
              <small>as registration fee per team</small>
            </div>

            <div>
              <span>Prizes</span>
              <b>
                <sup>₹</sup>50,000
              </b>
              <small>
                in prize pool + Goodies and Internship Opportunities
              </small>
            </div>
          </div>

          <p className="sc" data-r>
            Show us what you're capable of
          </p>
        </div>
      </section>

      {/* THEMES */}
      <section className="themes" id="themes">
        <h2 data-r>
          Find the <b>One of 4 Tracks</b> that fit your vibe :)
        </h2>

        <div className="cs" id="cs">
          {tracks.map(([letter, name]) => (
            <article className="tc" data-r key={letter}>
              <i className="k k1" />
              <i className="k k2" />
              <i className="k k3" />
              <h3>Track {letter}</h3>
              <h4>{name}</h4>
              <p>{P}</p>
            </article>
          ))}
        </div>

        <div className="ed" data-r>
          <div>
            <h4>Problem</h4>
            <p>{P}</p>
          </div>
          <div>
            <h4>Statement</h4>
            <p>{P}</p>
          </div>
          <div>
            <h4>Expected Solution</h4>
            <p>{P}</p>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="jp" id="journey">
        <p className="e">The Journey</p>

        <div className="rail">
          <div className="bar" ref={barRef} />
        </div>

        <div className="trk" id="trk" ref={trkRef}>
          <h2>
            The path
            <br />
            to Pandora
          </h2>

          {milestones.map(([week, title]) => (
            <div className="ms" key={week}>
              <i />
              <span>{week}</span>
              <h3>{title}</h3>
            </div>
          ))}

          <div style={{ width: "10vw", flex: "none" }} />
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* APP: picks which page to show from the URL (no router needed)       */
/* ------------------------------------------------------------------ */
function App() {
  const [path, setPath] = useState(window.location.pathname);

  /* browser back / forward buttons */
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (to) => {
  window.history.pushState({}, "", to);
  setPath(window.location.pathname);
  window.scrollTo(0, 0);
};


  const page = path.replace(/\/$/, "") || "/";

  if (page === "/register") return <Registration navigate={navigate} />;
  if (page === "/past-events") return <AboutMSA navigate={navigate} />;
  return <Landing navigate={navigate} />;
}

export default App;