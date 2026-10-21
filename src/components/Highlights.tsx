const ITEMS = [
  { icon: "🚚", title: "Free delivery", text: "On orders over ₹499" },
  { icon: "🥬", title: "Fresh every day", text: "Picked this morning" },
  { icon: "⚡", title: "Quick checkout", text: "Order in seconds" },
  { icon: "💚", title: "Easy returns", text: "Not happy? We'll fix it" },
];

export default function Highlights() {
  return (
    <section className="border-y border-gray-200 bg-white">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-5 md:grid-cols-4">
        {ITEMS.map((i) => (
          <li key={i.title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-50 text-2xl">
              {i.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{i.title}</p>
              <p className="text-xs text-gray-500">{i.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}