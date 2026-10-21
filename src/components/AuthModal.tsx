import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../auth/useAuth";

interface Props {
  message?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100";

export default function AuthModal({ message, onClose, onSuccess }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Esc closes the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const err = mode === "signin" ? await signIn(email, password) : await signUp(name, email, password);
    setBusy(false);
    if (err) setError(err);
    else onSuccess();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={mode === "signin" ? "Sign in" : "Create account"}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {message ?? (mode === "signin" ? "Sign in to track your orders." : "Join to save and track your orders.")}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-2xl text-gray-400 hover:text-black">
            ×
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-sm font-semibold">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`rounded-md py-2 transition ${
                mode === m ? "bg-white text-green-800 shadow" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="auth-name" className="mb-1 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className={`${inputClass} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            {mode === "signup" && <p className="mt-1 text-xs text-gray-400">At least 8 characters.</p>}
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 disabled:opacity-60"
          >
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        {mode === "signin" && (
          <p className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
            Demo admin: <span className="font-mono">admin@fresh.com</span> / <span className="font-mono">Admin@123</span>
          </p>
        )}
      </div>
    </div>
  );
}