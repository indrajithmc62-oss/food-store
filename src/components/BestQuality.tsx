import { useState } from "react";

const POINTS = ["The best service", "Experienced staff", "User-friendly app"];

interface Props {
  onReadMore: () => void;
}

export default function BestQuality({ onReadMore }: Props) {
  // If /veggies.png is missing, we show an illustrated bag instead.
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* Left: bag of vegetables */}
        <div className="relative mx-auto flex h-80 w-full max-w-md items-end justify-center sm:h-96">
          {photoOk ? (
            <img
              src="/veggies.png"
              alt="Paper bag full of fresh vegetables"
              onError={() => setPhotoOk(false)}
              className="h-full w-auto max-w-full object-contain object-bottom"
            />
          ) : (
            <div className="relative h-full w-full">
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10rem] leading-none sm:text-[12rem]">🛍️</span>
              <span className="float-emoji absolute left-[12%] top-[10%] text-5xl" style={{ animationDelay: "-0.5s" }}>🍋</span>
              <span className="float-emoji absolute left-[34%] top-[2%] text-5xl" style={{ animationDelay: "-2s" }}>🧅</span>
              <span className="float-emoji absolute right-[30%] top-[6%] text-5xl" style={{ animationDelay: "-3.5s" }}>🥔</span>
              <span className="float-emoji absolute right-[10%] top-[22%] text-5xl" style={{ animationDelay: "-1.5s" }}>🍅</span>
              <span className="float-emoji absolute left-[6%] top-[40%] text-5xl" style={{ animationDelay: "-4s" }}>🥬</span>
              <span className="float-emoji absolute right-[6%] top-[44%] text-5xl" style={{ animationDelay: "-2.8s" }}>🍌</span>
              <span className="float-emoji absolute left-[28%] top-[30%] text-5xl" style={{ animationDelay: "-1s" }}>🍆</span>
              <span className="float-emoji absolute right-[28%] top-[34%] text-5xl" style={{ animationDelay: "-3s" }}>🥦</span>
            </div>
          )}
        </div>

        {/* Right: text */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Best quality grocery just for you.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-gray-500 md:mx-0">
            We prioritize quality in each of our products, below are the benefits of buying from us.
          </p>

          <ul className="mx-auto mt-6 w-fit space-y-4 md:mx-0">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-gray-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>

          <button
            onClick={onReadMore}
            className="mt-8 rounded-xl bg-orange-500 px-10 py-3.5 font-semibold text-white shadow-[0_10px_25px_rgba(249,115,22,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-600 active:scale-95"
          >
            Read more
          </button>
        </div>
      </div>
    </section>
  );
}