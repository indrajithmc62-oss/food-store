import { useState } from "react";

interface Props {
  onShop: () => void;
}

const FLOATERS = [
  { emoji: "🍎", pos: "left-[26%] top-[6%] text-4xl", delay: "0s" },
  { emoji: "🥕", pos: "right-[4%] top-[6%] text-5xl", delay: "-1.5s" },
  { emoji: "🍋", pos: "left-[2%] top-[48%] text-4xl", delay: "-3s" },
  { emoji: "🥦", pos: "right-[2%] top-[54%] text-5xl", delay: "-2s" },
];

export default function Hero({ onShop }: Props) {
  // If /hero.png is missing, we show an illustrated bag instead.
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d6a4f] via-[#2d6a4f] to-[#1b4332] text-white">
        {/* Soft dot pattern for texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative grid items-center md:grid-cols-2">
          {/* Left: message */}
          <div className="px-6 pb-4 pt-10 sm:px-10 md:py-16">
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Make healthy life with{" "}
              <span className="relative inline-block text-lime-300">
                fresh
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path d="M2 8 C 50 -2, 120 -2, 198 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              grocery
            </h2>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-green-50 sm:text-base">
              Get the best quality and most delicious grocery food in the world. Order now using our website.
            </p>

            <button
              onClick={onShop}
              className="mt-8 rounded-lg bg-orange-500 px-8 py-3 font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.45)] ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:bg-orange-600 active:scale-95"
            >
              Shop Now
            </button>
          </div>

          {/* Right: glowing circle, floating produce, photo */}
          <div className="relative flex h-96 items-end justify-center sm:h-[28rem] md:h-[32rem]">
            <div className="absolute bottom-0 left-1/2 h-[85%] w-[85%] max-w-md -translate-x-1/2 rounded-full bg-lime-300/25 blur-3xl" />
            <div className="absolute bottom-[-12%] left-1/2 aspect-square w-[80%] max-w-md -translate-x-1/2 rounded-full bg-gradient-to-b from-lime-300/40 to-lime-300/5 ring-1 ring-white/20" />

            <div className="pointer-events-none absolute inset-0 hidden sm:block">
              {FLOATERS.map((f) => (
                <span
                  key={f.emoji}
                  className={`float-emoji absolute drop-shadow-lg ${f.pos}`}
                  style={{ animationDelay: f.delay }}
                >
                  {f.emoji}
                </span>
              ))}
            </div>

            {photoOk ? (
              <img
                src="/hero.png"
                alt="Smiling woman holding a paper bag of fresh vegetables"
                onError={() => setPhotoOk(false)}
                className="relative h-[94%] w-auto max-w-full object-contain object-bottom drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
              />
            ) : (
              <span className="relative pb-6 text-[10rem] leading-none drop-shadow-2xl sm:text-[13rem]">🛍️</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}