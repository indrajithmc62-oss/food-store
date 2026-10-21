import { lazy, Suspense, useEffect, useRef, useState } from "react";

// Loaded only when needed, so three.js doesn't slow down the first page load.
const CinematicScene = lazy(() => import("./CinematicScene"));

const CHAPTERS = [
  { tag: "01 · Scan", title: "We scan the harvest", text: "Every morning, fresh produce is checked for ripeness and quality." },
  { tag: "02 · Match", title: "Freshness, scored", text: "Only the best picks make it into your store, ranked by freshness." },
  { tag: "03 · Pack", title: "Packed in minutes", text: "Fruits, veggies, bakery and dairy are packed cold and sealed fast." },
  { tag: "04 · Deliver", title: "At your door, fast", text: "Free delivery over ₹499. Your groceries arrive fresh and on time." },
];

export default function CinematicScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const max = rect.height - window.innerHeight;
      // 0 when the section top reaches the screen top, 1 when we've scrolled through it
      const p = Math.min(1, Math.max(0, -rect.top / max));
      progress.current = p;
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;
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

  const goToProducts = () =>
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section ref={sectionRef} className="relative h-[400vh] shrink-0 bg-[#020a05]">
      {/* The stage stays fixed on screen while the section scrolls past */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <CinematicScene progress={progress} />
          </Suspense>
        </div>

        {/* Dark edges make the center glow like a film frame */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(2,10,5,0.85)_100%)]" />

        {/* Text chapters: only the active one is visible */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.tag}
              className={`absolute max-w-2xl transition-all duration-700 ease-out ${
                active === i ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <p className="mb-3 font-mono text-sm uppercase tracking-widest text-green-400">{c.tag}</p>
              <h2 className="shimmer-text text-4xl font-extrabold tracking-tight sm:text-6xl">{c.title}</h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-green-100/90">{c.text}</p>
              {i === CHAPTERS.length - 1 && (
                <button
                  onClick={goToProducts}
                  className="pointer-events-auto mt-8 rounded-full bg-yellow-300 px-7 py-3 font-semibold text-green-950 shadow-lg transition hover:bg-yellow-200"
                >
                  Start shopping ↓
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Scroll hint on the first chapter */}
        <div
          className={`absolute bottom-16 left-1/2 -translate-x-1/2 text-sm text-white/60 transition-opacity duration-500 ${
            active === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          Scroll to explore ↓
        </div>

        {/* Chapter dots */}
        <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-3">
          {CHAPTERS.map((c, i) => (
            <span
              key={c.tag}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                active === i ? "scale-125 bg-yellow-300" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Progress bar along the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
          <div ref={barRef} className="h-full bg-gradient-to-r from-green-400 to-yellow-300" />
        </div>
      </div>
    </section>
  );
}