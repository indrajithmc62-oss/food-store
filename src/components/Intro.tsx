import { useEffect, useState } from "react";

const LINES = [
  "Initializing Fresh AI...",
  "Scanning today's harvest...",
  "Matching freshness scores...",
  "Your store is ready.",
];

const SEEN_KEY = "food-store-intro-seen";

export default function Intro() {
  // Decide once, on first load, whether to show the intro.
  const [show, setShow] = useState(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return false;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    } catch {
      // storage unavailable: just show the intro
    }
    return true;
  });
  const [step, setStep] = useState(1); // how many lines are visible
  const [leaving, setLeaving] = useState(false);

  // Reveal one more line every 0.9s, then finish.
  useEffect(() => {
    if (!show || leaving) return;

    const finish = () => {
      setLeaving(true);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // ignore
      }
      setTimeout(() => setShow(false), 900);
    };

    const timer = setTimeout(
      () => (step < LINES.length ? setStep((s) => s + 1) : finish()),
      step < LINES.length ? 900 : 800
    );
    return () => clearTimeout(timer);
  }, [show, step, leaving]);

  // Stop the page scrolling behind the intro.
  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const skip = () => {
    setLeaving(true);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // ignore
    }
    setTimeout(() => setShow(false), 600);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black transition-all duration-700 ease-in ${
        leaving ? "scale-110 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      {/* Glowing background */}
      <div className="orb -left-20 -top-20 h-96 w-96 bg-green-600/60" />
      <div className="orb -bottom-24 -right-10 h-96 w-96 bg-emerald-400/40 [animation-delay:-3s]" />
      <div className="orb left-1/2 top-1/3 h-72 w-72 bg-yellow-300/20 [animation-delay:-5s]" />

      <div className="relative z-10 px-6 text-center">
        {/* Logo with radar pulse */}
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          <span className="pulse-ring absolute inset-0 rounded-full border-2 border-green-400" />
          <span className="pulse-ring absolute inset-0 rounded-full border-2 border-green-400 [animation-delay:1s]" />
          <span className="text-6xl">🛒</span>
        </div>

        <h1 className="shimmer-text text-4xl font-extrabold tracking-tight sm:text-6xl">
          Fresh AI Store
        </h1>

        {/* Status lines, one more appears at each step */}
        <ul className="mx-auto mt-8 h-28 max-w-sm space-y-2 text-left font-mono text-sm text-green-300">
          {LINES.slice(0, step).map((line, i) => (
            <li key={line} className="fade-up">
              <span className="text-green-500">{i === LINES.length - 1 ? "✓" : "›"}</span> {line}
            </li>
          ))}
        </ul>

        {/* Progress bar */}
        <div className="mx-auto mt-4 h-1 max-w-sm overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-yellow-300 transition-all duration-700 ease-out"
            style={{ width: `${(step / LINES.length) * 100}%` }}
          />
        </div>
      </div>

      <button
        onClick={skip}
        className="absolute bottom-6 right-6 z-10 rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
      >
        Skip
      </button>
    </div>
  );
}