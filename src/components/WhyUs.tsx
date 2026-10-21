import { useState } from "react";

const FEATURES = [
  { icon: "🚚", text: "We provide the fastest deliveries" },
  { icon: "🧾", text: "Free delivery on orders over ₹499" },
  { icon: "📦", text: "Safe and reliable deliveries" },
];

export default function WhyUs() {
  // If /chef.png is missing, we show an illustration instead.
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 md:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2">
        {/* Left: text and feature cards */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">Feature</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Why should you use our service?
          </h2>
          <p className="mt-4 max-w-sm text-gray-500">
            We always provide the best and fastest service for all customers.
          </p>

          <ul className="mt-6 space-y-4">
            {FEATURES.map((f) => (
              <li
                key={f.text}
                className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-md ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="text-3xl">{f.icon}</span>
                <span className="text-base text-gray-900 sm:text-lg">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: green panel with a person in front */}
        <div className="relative mx-auto h-96 w-full max-w-md md:h-[30rem]">
          <div className="absolute inset-x-4 bottom-0 top-14 rounded-3xl bg-gradient-to-br from-emerald-300/70 to-[#2d6a4f]" />
          {photoOk ? (
            <img
              src="/chef.png"
              alt="Smiling chef holding fresh vegetables"
              onError={() => setPhotoOk(false)}
              className="relative mx-auto h-full w-auto max-w-full object-contain object-bottom"
            />
          ) : (
            <div className="relative flex h-full items-end justify-center pb-4">
              <span className="text-[11rem] leading-none sm:text-[13rem]">👨‍🍳</span>
              <span className="float-emoji absolute left-[14%] top-[40%] text-6xl" style={{ animationDelay: "-1s" }}>🫑</span>
              <span className="float-emoji absolute right-[14%] top-[44%] text-6xl" style={{ animationDelay: "-2.5s" }}>🍎</span>
              <span className="float-emoji absolute right-[24%] top-[24%] text-5xl" style={{ animationDelay: "-3.5s" }}>🥬</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}