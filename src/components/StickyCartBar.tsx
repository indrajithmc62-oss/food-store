interface Props {
  count: number;
  total: number;
  onOpen: () => void;
}

export default function StickyCartBar({ count, total, onOpen }: Props) {
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-10 p-3 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-96 sm:p-0">
      <button
        onClick={onOpen}
        className="fade-up flex w-full items-center justify-between rounded-xl bg-green-700 px-5 py-3.5 text-white shadow-2xl transition hover:bg-green-800"
      >
        <span className="font-semibold">
          🛒 {count} {count === 1 ? "item" : "items"} · ₹{total}
        </span>
        <span className="font-bold">View cart & checkout →</span>
      </button>
    </div>
  );
}