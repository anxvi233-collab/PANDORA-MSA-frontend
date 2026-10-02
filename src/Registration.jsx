import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./registration.css";

const YEARS = ["1st", "2nd", "3rd", "4th"];

const UPI = "msa.pandora@upi";

const FEE = "₹200";

const blank = () => ({
  first: "",
  last: "",
  phone: "",
  srm: "",
  email: "",
  year: "",
  degree: "",
  branch: "",
});

const fresh = () => ({
  name: "",
  size: 0,
  m: [
    blank(),
    blank(),
    blank(),
    blank(),
  ],
  pay: {
    txn: "",
    bank: "",
    file: "",
    url: "",
  },
  pos: 0,
  max: 0,
  err: "",
  bad: "",
  id: "",
  dir: "R",
});

const NOTES = {
  team: [
    "Team of 3 or 4 members only.",
    "The team leader is the main contact for all updates.",
    "Use the WhatsApp number you check daily.",
  ],

  member: [
    "Use each member's own SRM email.",
    "Every member needs a different email and number.",
  ],

  review: [
    "Check every detail. Tap Edit to change any section.",
    "Details can't be changed after payment.",
  ],

  pay: [
    "Scan the QR and pay the exact fee.",
    "Upload a clear screenshot showing the transaction ID.",
    "Entries are confirmed after payment is verified.",
  ],

  done: [
    "Keep your team ID safe.",
    "A confirmation goes to the leader's email.",
  ],
};

const V = {
  first: (v) => v.trim(),

  last: (v) => v.trim(),

  phone: (v) => /^\d{10}$/.test(v),

  srm: (v) => /^[\w.]+$/.test(v),

  email: (v) =>
    /^\S+@\S+\.\S+$/.test(v),

  degree: (v) => v.trim(),

  branch: (v) => v.trim(),

  name: (v) => v.trim(),

  txn: (v) => v.trim(),

  bank: (v) => v.trim(),
};

const MSG = {
  first: "Enter the first name.",

  last: "Enter the middle + last name.",

  phone: "Mobile number must be 10 digits.",

  srm: "Enter your SRM email username.",

  email: "Enter a valid personal email.",

  year: "Pick the year of study.",

  degree: "Type the degree (e.g. B.Tech).",

  branch: "Type the branch (e.g. CSE).",

  name: "Enter a team name.",

  size: "Choose 3 or 4 members.",

  txn: "Enter the transaction ID.",

  bank: "Enter your bank / UPI ID.",

  file: "Upload the payment screenshot.",
};

const LBL = {
  team: "Team",
  m1: "Member 2",
  m2: "Member 3",
  m3: "Member 4",
  review: "Review",
  pay: "Payment",
  done: "Done",
};

const MI = {
  team: 0,
  m1: 1,
  m2: 2,
  m3: 3,
};

const stepsFor = (size) => [
  "team",
  "m1",
  "m2",
  ...(size === 4 ? ["m3"] : []),
  "review",
  "pay",
  "done",
];

const Corner = ({ pos }) => (
  <svg
    className={`rg-corner rg-${pos}`}
    width="44"
    height="44"
    viewBox="0 0 50 50"
    fill="none"
    stroke="#e8b923"
    strokeWidth="1.5"
  >
    <path d="M1 49V1H49M1 1L49 49M12 12H24V24H12Z" />
  </svg>
);

function CopyBtn({ text }) {
  const [done, setDone] = useState(false);

  const click = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }

    setDone(true);

    setTimeout(() => {
      setDone(false);
    }, 1400);
  };

  return (
    <button
      type="button"
      className="rg-copy"
      onClick={click}
    >
      {done ? "Copied!" : "Copy"}
    </button>
  );
}

export default function Registration() {
  const [S, setS] = useState(fresh);

  const [over, setOver] = useState(false);

  const rootRef = useRef(null);

  const panelRef = useRef(null);

  const steps = useMemo(
    () => stepsFor(S.size),
    [S.size]
  );

  const current = steps[S.pos];

  const mi = MI[current];

  const isDone = current === "done";

  const act = S.m.slice(
    0,
    S.size || 3
  );

  const up = (fn) =>
    setS((p) => {
      const n = structuredClone(p);

      fn(n);

      return n;
    });

  /* Mouse parallax */

  useEffect(() => {
    const mv = (e) => {
      const r = rootRef.current;

      if (!r) return;

      r.style.setProperty(
        "--mx",
        (e.clientX / innerWidth - 0.5).toFixed(3)
      );

      r.style.setProperty(
        "--my",
        (e.clientY / innerHeight - 0.5).toFixed(3)
      );
    };

    window.addEventListener(
      "mousemove",
      mv
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        mv
      );
  }, []);

  const confetti = useMemo(() => {
    if (!isDone) return [];

    const cols = [
      "#1fbfa6",
      "#e8b923",
      "#1a9fb8",
      "#f08a5d",
      "#7a6cf0",
    ];

    return Array.from(
      { length: 60 },
      (_, i) => ({
        left: Math.random() * 100,
        c: cols[i % 5],
        d: 1.6 + Math.random() * 1.6,
        dl: Math.random() * 0.5,
      })
    );
  }, [isDone]);

  const check = () => {
    if (current === "team") {
      if (!V.name(S.name))
        return "name";

      if (!S.size)
        return "size";
    }

    if (mi !== undefined) {
      const m = S.m[mi];

      for (const k of [
        "first",
        "last",
        "phone",
        "srm",
        "email",
      ]) {
        if (!V[k](m[k]))
          return k;
      }

      if (!m.year)
        return "year";

      if (!V.degree(m.degree))
        return "degree";

      if (!V.branch(m.branch))
        return "branch";
    }

    if (current === "pay") {
      if (!V.txn(S.pay.txn))
        return "txn";

      if (!V.bank(S.pay.bank))
        return "bank";

      if (!S.pay.file)
        return "file";
    }

    return "";
  };

  const go = (n, dir) => {
    up((x) => {
      x.dir = dir;
      x.pos = n;
      x.max = Math.max(x.max, n);
      x.err = "";
      x.bad = "";
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const next = () => {
    const k = check();

    if (k) {
      up((x) => {
        x.err = MSG[k];
        x.bad = k;
      });

      const p = panelRef.current;

      if (p) {
        p.classList.remove("rg-shake");

        void p.offsetWidth;

        p.classList.add("rg-shake");

        setTimeout(() => {
          const t = p.querySelector(
            `[data-f="${k}"]`
          );

          if (t) {
            if (t.tagName === "INPUT") {
              t.focus();
            }

            t.scrollIntoView({
              block: "center",
              behavior: "smooth",
            });
          }
        }, 0);
      }

      return;
    }

    if (current === "pay") {
      const id =
        "PAN-" +
        Math.random()
          .toString(36)
          .slice(2, 7)
          .toUpperCase();

      console.log({
        id,
        teamName: S.name,
        size: S.size,
        members: act,
        pay: S.pay,
      });

      up((x) => {
        x.id = id;
      });
    }

    go(S.pos + 1, "R");
  };

  const setFile = (f) => {
    if (!f) return;

    up((x) => {
      x.pay.file = f.name;

      x.pay.url =
        URL.createObjectURL(f);

      x.err = "";

      x.bad = "";
    });
  };

  const cls = (k, ok) =>
    `${ok ? "rg-ok" : ""}${
      S.bad === k ? " rg-bad" : ""
    }`;

  const member = (i) => {
    const m = S.m[i];

    const set = (k, v) =>
      up((x) => {
        x.m[i][k] = v;
        x.bad = "";
      });

    const inp = (
      k,
      extra = {}
    ) => (
      <input
        data-f={k}
        className={cls(
          k,
          m[k] && V[k](m[k])
        )}
        value={m[k]}
        onChange={(e) =>
          set(
            k,
            k === "phone"
              ? e.target.value.replace(
                  /\D/g,
                  ""
                )
              : e.target.value
          )
        }
        {...extra}
      />
    );

    return (
      <div className="rg-g">
        <label className="rg-field">
          <span>First Name</span>
          {inp("first")}
        </label>

        <label className="rg-field">
          <span>
            Middle + Last Name
          </span>

          {inp("last")}
        </label>

        <label className="rg-field rg-full">
          <span>
            Mobile Number (Whatsapp)
          </span>

          {inp("phone", {
            inputMode: "numeric",
            maxLength: 10,
          })}
        </label>

        <label className="rg-field rg-full">
          <span>
            SRM email address
          </span>

          <div className="rg-srm">
            {inp("srm", {
              autoCapitalize: "none",
            })}

            <em>
              @srmist.edu.in
            </em>
          </div>
        </label>

        <label className="rg-field rg-full">
          <span>
            Personal email
          </span>

          {inp("email", {
            type: "email",
          })}
        </label>

        <div className="rg-field rg-full">
          <span>
            Year of study
          </span>

          <div
            className={`rg-seg ${
              S.bad === "year"
                ? "rg-bad"
                : ""
            }`}
            data-f="year"
          >
            {YEARS.map((y) => (
              <button
                type="button"
                key={y}
                className={
                  m.year === y
                    ? "rg-on"
                    : ""
                }
                onClick={() =>
                  up((x) => {
                    x.m[i].year = y;
                    x.err = "";
                    x.bad = "";
                  })
                }
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <label className="rg-field">
          <span>Degree</span>

          {inp("degree", {
            placeholder:
              "e.g. B.Tech",
          })}
        </label>

        <label className="rg-field">
          <span>Branch</span>

          {inp("branch", {
            placeholder: "e.g. CSE",
          })}
        </label>
      </div>
    );
  };

  const title =
    current === "team"
      ? "Team Leader (Team Member 1)"
      : mi > 0
      ? `Team Member ${mi + 1}`
      : current === "review"
      ? "Review your details"
      : current === "pay"
      ? "Registration fee"
      : "";

  const noteKey =
    mi > 0 ? "member" : current;

  let body = null;

  if (current === "team") {
    body = (
      <>
        <div className="rg-g">
          <label className="rg-field rg-full">
            <span>Team name</span>

            <input
              data-f="name"
              className={cls(
                "name",
                S.name.trim()
              )}
              value={S.name}
              onChange={(e) =>
                up((x) => {
                  x.name =
                    e.target.value;

                  x.bad = "";
                })
              }
            />
          </label>

          <div className="rg-full rg-field">
            <span>
              Number of team members
            </span>

            <div
              className={`rg-sizes ${
                S.bad === "size"
                  ? "rg-bad"
                  : ""
              }`}
              data-f="size"
            >
              {[3, 4].map((n) => (
                <button
                  type="button"
                  key={n}
                  className={`rg-sz${
                    S.size === n
                      ? " rg-on"
                      : ""
                  }`}
                  onClick={() =>
                    up((x) => {
                      x.size = n;

                      x.max = Math.min(
                        x.max,
                        stepsFor(n).length -
                          1
                      );

                      x.err = "";
                      x.bad = "";
                    })
                  }
                >
                  <b>{n}</b>
                  members
                </button>
              ))}
            </div>
          </div>

          {S.size === 4 && (
            <p className="rg-hint rg-full">
              A page for Team Member 4
              will open too.
            </p>
          )}
        </div>

        <p className="rg-sub">
          Team leader details
        </p>

        <div
          style={{
            height: 10,
          }}
        />

        {member(0)}
      </>
    );
  } else if (mi > 0) {
    body = member(mi);
  } else if (current === "review") {
    const keys = [
      "team",
      "m1",
      "m2",
      "m3",
    ];

    body = (
      <div className="rg-review">
        <div className="rg-rbox">
          <div>
            <b>{S.name}</b>

            <span>
              {S.size} members
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              go(0, "L")
            }
          >
            Edit
          </button>
        </div>

        {act.map((m, i) => (
          <div
            className="rg-rbox"
            key={i}
          >
            <div className="rg-av">
              {(
                m.first[0] || "?"
              ).toUpperCase()}
            </div>

            <div>
              <b>
                {i ? "" : "Leader: "}
                {m.first} {m.last}
              </b>

              <span>
                {m.phone} ·{" "}
                {m.srm}
                @srmist.edu.in
              </span>

              <span>
                {m.year} year ·{" "}
                {m.degree} ·{" "}
                {m.branch}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                go(
                  steps.indexOf(
                    keys[i]
                  ),
                  "L"
                )
              }
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    );
  } else if (current === "pay") {
    body = (
      <>
        <div className="rg-pay">
          <div className="rg-qrbox">
            <span>
              Your QR here
            </span>
          </div>

          <div>
            <div className="rg-amt">
              {FEE}
            </div>

            <div className="rg-upi">
              UPI ID:{" "}
              <b>{UPI}</b>

              <CopyBtn
                text={UPI}
              />
            </div>
          </div>
        </div>

        <div
          className="rg-g"
          style={{
            marginTop: 14,
          }}
        >
          <label className="rg-field">
            <span>
              Transaction ID
            </span>

            <input
              data-f="txn"
              className={cls(
                "txn",
                S.pay.txn.trim()
              )}
              value={S.pay.txn}
              onChange={(e) =>
                up((x) => {
                  x.pay.txn =
                    e.target.value;

                  x.bad = "";
                })
              }
            />
          </label>

          <label className="rg-field">
            <span>
              Your bank / UPI ID
            </span>

            <input
              data-f="bank"
              className={cls(
                "bank",
                S.pay.bank.trim()
              )}
              value={S.pay.bank}
              onChange={(e) =>
                up((x) => {
                  x.pay.bank =
                    e.target.value;

                  x.bad = "";
                })
              }
            />
          </label>

          <div className="rg-field rg-full">
            <span>
              Payment screenshot
            </span>

            <label
              data-f="file"
              className={`rg-drop${
                over
                  ? " rg-over"
                  : ""
              }${
                S.bad === "file"
                  ? " rg-bad"
                  : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() =>
                setOver(false)
              }
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                setFile(
                  e.dataTransfer.files[0]
                );
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(
                    e.target.files[0]
                  )
                }
              />

              {S.pay.url ? (
                <img
                  src={S.pay.url}
                  alt="Payment screenshot"
                />
              ) : (
                "📎"
              )}

              <div>
                {S.pay.file ||
                  "Drop an image here or click to choose"}
              </div>
            </label>
          </div>
        </div>
      </>
    );
  } else {
    body = (
      <div className="rg-done">
        <svg
          className="rg-tick"
          viewBox="0 0 84 84"
        >
          <circle
            cx="42"
            cy="42"
            r="40"
          />

          <path d="M26 43l11 11 21-23" />
        </svg>

        <h2
          style={{
            fontSize: 20,
            margin: 0,
          }}
        >
          You've registered!
        </h2>

        <p
          style={{
            marginTop: 6,
          }}
        >
          Team <b>{S.name}</b> is in.
        </p>

        <div className="rg-idp">
          Team ID: {S.id}

          <CopyBtn
            text={S.id}
          />
        </div>

        <div
          style={{
            marginTop: 18,
          }}
        >
          <button
            type="button"
            className="rg-btn rg-o"
            onClick={() =>
              setS(fresh())
            }
          >
            Register another team
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rg-root"
      ref={rootRef}
      onKeyDown={(e) => {
        if (
          e.key === "Enter" &&
          e.target.tagName === "INPUT" &&
          e.target.type !== "file"
        ) {
          next();
        }
      }}
    >
      <div className="rg-bgfx" />

      <div className="rg-fade" />

      <main className="rg-page">
        <header className="rg-head">
          <small>
            let’s get you geared up:
          </small>

          <h1>
            Register your team for{" "}
            <u>MSA Pandora</u>
          </h1>
        </header>

        <div className="rg-card">
          <div className="rg-fc">
            {[
              "tl",
              "tr",
              "bl",
              "br",
            ].map((p) => (
              <Corner
                key={p}
                pos={p}
              />
            ))}

            {!isDone && (
              <div className="rg-stp">
                {steps
                  .slice(0, -1)
                  .map((k, j) => (
                    <span
                      key={k}
                      style={{
                        display:
                          "contents",
                      }}
                    >
                      {j > 0 && (
                        <span
                          className={`rg-l${
                            j <= S.pos
                              ? " rg-f"
                              : ""
                          }`}
                        >
                          <i />
                        </span>
                      )}

                      <button
                        type="button"
                        title={LBL[k]}
                        className={`rg-s ${
                          j < S.pos
                            ? "rg-d"
                            : j === S.pos
                            ? "rg-c"
                            : j <= S.max
                            ? "rg-v"
                            : ""
                        }`}
                        onClick={() => {
                          if (
                            j <= S.max &&
                            j !== S.pos
                          ) {
                            go(
                              j,
                              j < S.pos
                                ? "L"
                                : "R"
                            );
                          }
                        }}
                      >
                        {j < S.pos
                          ? "✓"
                          : j + 1}
                      </button>
                    </span>
                  ))}
              </div>
            )}

            {title && (
              <h2>{title}</h2>
            )}

            <div
              className={`rg-panel rg-${S.dir}`}
              key={current}
              ref={panelRef}
            >
              {body}

              <p className="rg-err">
                {S.err}
              </p>
            </div>

            {!isDone && (
              <div className="rg-act">
                {S.pos > 0 && (
                  <button
                    type="button"
                    className="rg-btn rg-o"
                    onClick={() =>
                      go(
                        S.pos - 1,
                        "L"
                      )
                    }
                  >
                    Back
                  </button>
                )}

                <button
                  type="button"
                  className="rg-btn rg-p"
                  onClick={next}
                >
                  {current === "pay"
                    ? "Submit registration"
                    : current === "review"
                    ? "Looks good"
                    : "Continue"}
                </button>
              </div>
            )}
          </div>

          <aside className="rg-side">
            <div className="rg-nav">
              <button
                type="button"
                disabled={
                  S.pos === 0 ||
                  isDone
                }
                onClick={() =>
                  go(
                    S.pos - 1,
                    "L"
                  )
                }
              >
                &lt;
              </button>

              <button
                type="button"
                disabled={isDone}
                onClick={next}
              >
                &gt;
              </button>
            </div>

            <div className="rg-box">
              <h3>
                Things to note while
                registering
              </h3>

              <ul>
                {NOTES[noteKey].map(
                  (n) => (
                    <li key={n}>
                      {n}
                    </li>
                  )
                )}
              </ul>

              {!isDone && (
                <div className="rg-prog">
                  Step {S.pos + 1} of{" "}
                  {steps.length - 1}

                  <div className="rg-bar">
                    <i
                      style={{
                        width: `${
                          ((S.pos + 1) /
                            (steps.length -
                              1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>

          {confetti.map(
            (c, i) => (
              <i
                key={i}
                className="rg-cf"
                style={{
                  left: `${c.left}%`,
                  background: c.c,
                  animationDuration: `${c.d}s`,
                  animationDelay: `${c.dl}s`,
                }}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}