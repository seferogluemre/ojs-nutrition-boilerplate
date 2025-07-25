import { create } from "zustand";

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

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
  };  
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const initToken = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
  
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
          return { ...state, auth: { ...state.auth, accessToken } };
        }),
      resetAccessToken: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          return { ...state, auth: { ...state.auth, accessToken: "" } };
        }),
      reset: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: "" },
          };
        }),
      logout: () =>
        set((state) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: "" },
          };
        }),
      checkAuth: async () => {
        try {
          const response = await fetch("http://localhost:3000/api/auth/me", {
            credentials: 'include', 
          });
          if (response.ok) {
            const userData = await response.json();
            set((state) => ({
              ...state,
              auth: { ...state.auth, user: userData as AuthUser },
            }));
          } else {
            get().auth.logout();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          get().auth.logout();
        }
      },
    },
  };
});

// export const useAuth = () => useAuthStore((state) => state.auth)