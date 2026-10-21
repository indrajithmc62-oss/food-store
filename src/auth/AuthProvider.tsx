import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./useAuth";
import type { AuthContextValue, User } from "./useAuth";

interface StoredUser extends User {
  salt: string;
  hash: string;
}

const USERS_KEY = "food-store-users";
const SESSION_KEY = "food-store-session";

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSalt() {
  return toHex(crypto.getRandomValues(new Uint8Array(16)));
}

// PBKDF2 turns the password + salt into a hash that can't be reversed back into the password.
async function hashPassword(password: string, salt: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
    key,
    256
  );
  return toHex(new Uint8Array(bits));
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Never hand the salt or hash to the rest of the app.
function publicUser(u: StoredUser): User {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  // On first load: make sure the demo admin exists, then restore the saved session.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!readUsers().some((u) => u.role === "admin")) {
          const salt = randomSalt();
          const hash = await hashPassword("Admin@123", salt);
          const fresh = readUsers(); // re-read: another run may have added it meanwhile
          if (!fresh.some((u) => u.role === "admin")) {
            fresh.push({
              id: crypto.randomUUID(),
              name: "Store Admin",
              email: "admin@fresh.com",
              role: "admin",
              salt,
              hash,
            });
            writeUsers(fresh);
          }
        }
        const sessionId = localStorage.getItem(SESSION_KEY);
        const found = readUsers().find((u) => u.id === sessionId);
        if (!cancelled && found) setUser(publicUser(found));
      } catch {
        // storage or crypto unavailable: stay signed out
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length < 2) return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return "Please enter a valid email address.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    try {
      if (readUsers().some((u) => u.email === cleanEmail)) return "An account with this email already exists.";
      const salt = randomSalt();
      const created: StoredUser = {
        id: crypto.randomUUID(),
        name: cleanName,
        email: cleanEmail,
        role: "customer", // sign-up can only ever create customers
        salt,
        hash: await hashPassword(password, salt),
      };
      writeUsers([...readUsers(), created]);
      localStorage.setItem(SESSION_KEY, created.id);
      setUser(publicUser(created));
      return null;
    } catch {
      return "Something went wrong. Please try again.";
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const found = readUsers().find((u) => u.email === cleanEmail);
      const attempt = found ? await hashPassword(password, found.salt) : null;
      // Same message for "no such email" and "wrong password", so it doesn't reveal which emails exist.
      if (!found || attempt !== found.hash) return "Incorrect email or password.";
      localStorage.setItem(SESSION_KEY, found.id);
      setUser(publicUser(found));
      return null;
    } catch {
      return "Something went wrong. Please try again.";
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  // Authorization: only an admin gets the user list.
  const listUsers = useCallback(
    () => (user?.role === "admin" ? readUsers().map(publicUser) : []),
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, signUp, signIn, signOut, listUsers }),
    [user, ready, signUp, signIn, signOut, listUsers]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}