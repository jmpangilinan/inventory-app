import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/api/model";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem("auth_token", token);
        // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not yet widely supported
        document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem("auth_token");
        // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API not yet widely supported
        document.cookie = "auth_token=; path=/; max-age=0";
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
