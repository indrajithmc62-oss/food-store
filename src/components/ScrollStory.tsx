import { useEffect, useRef, useState } from "react";

const HEADER_HEIGHT = 72; // height of the sticky navbar in px

const CHAPTERS = [
  { tag: "01 · Pick", title: "Picked fresh every morning", text: "Fruits, vegetables, bakery and dairy are chosen at their best." },
  { tag: "02 · Check", title: "Quality-checked, every item", text: "Each item gets a freshness score before it goes in your bag." },
  { tag: "03 · Pack", title: "Packed with care", text: "Your groceries are packed cold and sealed in minutes." },
  { tag: "04 · Deliver", title: "At your door, fast", text: "Free delivery over ₹499. Fresh, on time, every time." },
];

// sx/sy = where an item starts (above the bag), ex/ey = where it lands, relative to the bag's top-centre.
const ITEMS = [
  { emoji: "🍎", sx: -170, sy: -250, rot: -40, ex: -62, ey: -8, start: 0.04 },
  { emoji: "🥕", sx: 140, sy: -270, rot: 35, ex: 36, ey: -22, start: 0.10 },
  { emoji: "🥦", sx: -50, sy: -260, rot: -20, ex: -8, ey: -16, start: 0.17 },
  { emoji: "🍞", sx: 180, sy: -230, rot: 50, ex: 70, ey: -4, start: 0.24 },
  { emoji: "🥛", sx: -190, sy: -240, rot: -30, ex: -90, ey: 2, start: 0.31 },
  { emoji: "🍅", sx: 80, sy: -270, rot: 25, ex: 14, ey: 6, start: 0.38 },
  { emoji: "🧀", sx: -100, sy: -250, rot: 40, ex: -34, ey: 8, start: 0.45 },
  { emoji: "🍌", sx: 160, sy: -240, rot: -45, ex: 52, ey: -26, start: 0.52 },
];
const FALL = 0.18; // how much of the scroll each item takes to drop

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Props {
  onShop: () => void;
}

export default function ScrollStory({ onShop }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const truckRef = useRef<HTMLSpanElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const scoreBarRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    // Runs on every scroll. It edits styles directly, so React doesn't re-render 60 times a second.
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const max = rect.height - (window.innerHeight - HEADER_HEIGHT);
      const p = max > 0 ? clamp((HEADER_HEIGHT - rect.top) / max) : 0; // 0 → 1 through the section

      ITEMS.forEach((it, i) => {
        const node = itemRefs.current[i];
        if (!node) return;
        const t = clamp((p - it.start) / FALL);
        const e = ease(t);
        const x = it.sx + (it.ex - it.sx) * e;
        const y = it.sy + (it.ey - it.sy) * e;
        node.style.transform = `translate(${x}px, ${y}px) rotate(${it.rot * (1 - e)}deg)`;
        node.style.opacity = String(Math.min(1, t * 8));
      });

      const drive = clamp((p - 0.74) / 0.26);
      if (truckRef.current) {
        truckRef.current.style.left = `${-25 + drive * 140}%`;
        truckRef.current.style.opacity = drive > 0 ? "1" : "0";
      }
      const score = clamp(p / 0.7);
      if (scoreRef.current) scoreRef.current.textContent = `${Math.round(score * 98)}%`;
      if (scoreBarRef.current) scoreBarRef.current.style.width = `${score * 100}%`;
      if (badgeRef.current) {
        badgeRef.current.style.opacity = p > 0.93 ? "1" : "0";
        badgeRef.current.style.transform = p > 0.93 ? "scale(1)" : "scale(0.8)";
      }
      if (progressRef.current) progressRef.current.style.width = `${p * 100}%`;
      setActive(Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[300vh]">
      {/* The stage stays on screen while the section scrolls past */}
      <div
        className="sticky flex items-center overflow-hidden bg-gradient-to-b from-green-50 via-white to-lime-50"
        style={{ top: HEADER_HEIGHT, height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
      >
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-green-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-yellow-200/50 blur-3xl" />

        <button
          onClick={onShop}
          className="absolute right-4 top-4 z-30 rounded-full border border-gray-300 bg-white/80 px-4 py-1.5 text-sm text-gray-600 backdrop-blur hover:bg-white"
        >
          Skip to products ↓
        </button>

        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-2 px-4 md:grid-cols-2 md:gap-10">
          {/* Left: chapter text */}
          <div className="relative h-52 md:h-80">
            {CHAPTERS.map((c, i) => (
              <div
                key={c.tag}
                className={`absolute inset-0 flex flex-col justify-center text-center transition-all duration-700 ease-out md:text-left ${
                  active === i ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
                }`}
              >
                <p className="mb-2 font-mono text-sm font-semibold uppercase tracking-widest text-orange-500">{c.tag}</p>
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">{c.title}</h2>
                <p className="mx-auto mt-3 max-w-md text-gray-600 md:mx-0">{c.text}</p>
                {i === CHAPTERS.length - 1 && (
                  <button
                    onClick={onShop}
                    className="mx-auto mt-5 w-fit rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-600 md:mx-0"
                  >
                    Start shopping →
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Right: the bag scene (scaled down on phones) */}
          <div className="flex h-[330px] justify-center md:h-[520px]">
            <div className="relative h-[520px] w-[360px] shrink-0 origin-top scale-[0.62] md:scale-100">
              <div className="absolute inset-x-0 bottom-0 h-72 rounded-full bg-lime-200/60 blur-3xl" />

              {/* AI freshness score card */}
              <div className="absolute -right-2 top-8 z-30 rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/5">
                <p className="text-xs font-semibold text-green-700">✨ Freshness AI</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  <span ref={scoreRef}>0%</span>
                </p>
                <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-green-100">
                  <div ref={scoreBarRef} className="h-full rounded-full bg-green-600" style={{ width: "0%" }} />
                </div>
              </div>

              {/* Delivered badge */}
              <div
                ref={badgeRef}
                className="absolute -left-4 top-28 z-30 rounded-full bg-green-700 px-4 py-2 text-sm font-bold text-white shadow-xl transition-all duration-500"
                style={{ opacity: 0, transform: "scale(0.8)" }}
              >
                ✅ Delivered fresh
              </div>

              {/* The bag: back rim, falling items, then the front on top */}
              <div className="absolute bottom-8 left-1/2 h-52 w-60 -translate-x-1/2">
                <div className="absolute inset-x-2 -top-2 z-0 h-8 rounded-t-full bg-[#8a6a45]" />
                <div className="absolute left-1/2 top-0 z-10">
                  {ITEMS.map((it, i) => (
                    <span
                      key={it.emoji}
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      className="absolute -ml-6 -mt-6 select-none text-5xl leading-none opacity-0 will-change-transform"
                      style={{ left: 0, top: 0 }}
                    >
                      {it.emoji}
                    </span>
                  ))}
                </div>
                <div className="absolute inset-0 z-20 flex items-end justify-center rounded-b-3xl rounded-t-md bg-gradient-to-b from-[#d9b88f] to-[#b98d5e] pb-6 shadow-2xl">
                  <div className="absolute inset-x-0 top-0 h-3 rounded-t-md bg-black/10" />
                  <span className="rounded-md bg-white/70 px-3 py-1 text-sm font-extrabold tracking-widest text-green-800">
                    🍃 FRESH
                  </span>
                </div>
              </div>

              {/* Delivery truck driving past */}
              <span
                ref={truckRef}
                className="absolute bottom-0 z-30 text-6xl"
                style={{ left: "-25%", opacity: 0 }}
              >
                🚚
              </span>
            </div>
          </div>
        </div>

        {/* Scroll hint, chapter dots and progress bar */}
        <div
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500 transition-opacity duration-500 ${
            active === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          Scroll to explore ↓
        </div>
        <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
          {CHAPTERS.map((c, i) => (
            <span
              key={c.tag}
              className={`h-2.5 w-2.5 rounded-full transition-all ${active === i ? "scale-125 bg-orange-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-green-100">
          <div ref={progressRef} className="h-full bg-gradient-to-r from-green-500 to-orange-400" style={{ width: "0%" }} />
        </div>
      </div>
    </section>
  );
}