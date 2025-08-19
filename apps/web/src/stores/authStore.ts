import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export interface AuthState {
  user: AuthUser | null;
  accessToken: string;
  setUser: (user: AuthUser | null) => void;
  setAccessToken: (accessToken: string) => void;
  resetAccessToken: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: "",
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      resetAccessToken: () => set({ accessToken: "" }),
      reset: () => set({ user: null, accessToken: "" }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        accessToken: state.accessToken 
      }),
    }
  )
);