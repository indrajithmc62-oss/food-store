import { createContext, useContext } from "react";

export type Role = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthContextValue {
  user: User | null;
  ready: boolean; // false until the saved session has been checked
  // These return an error message, or null on success.
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => void;
  listUsers: () => User[]; // admin only: returns [] for everyone else
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}