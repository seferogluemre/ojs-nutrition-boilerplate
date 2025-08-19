import { create } from "zustand";
import { persist } from "zustand/middleware";

const ACCESS_TOKEN_KEY = "access_token";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  rolesSlugs: string[];
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthSlice {
  user: AuthUser | null;
  accessToken: string;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (accessToken: string) => void;
  resetAccessToken: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthSlice>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      setUser: (user) => set(() => ({ user })),
      setAccessToken: (accessToken) => set(() => ({ accessToken })),
      resetAccessToken: () => set(() => ({ accessToken: "" })),
      reset: () => set(() => ({ user: null, accessToken: "" })),
    }),
    {
      name: ACCESS_TOKEN_KEY,
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);
