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
  // localStorage'dan token'ı al
  const initToken = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
  console.log("localStorage'dan gelen token:", initToken);
  
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          console.log("Token localStorage'a kaydediliyor:", accessToken);
          localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
          console.log("localStorage'a kaydedildi");
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
        const { accessToken } = get().auth;
        console.log("checkAuth - gelen token:", accessToken);
        
        if (!accessToken) {
          console.log("Token yok, auth check atlanıyor");
          return;
        }

        try {
          const response = await fetch("http://localhost:3000/api/auth/me", {
            headers: {
              "Content-Type": "application/json",
              "Cookie": `onlyjs-session-token=${accessToken}`
            },
            credentials: 'include',
          });

          console.log("API response status:", response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log("User data alındı:", userData);
            set((state) => ({
              ...state,
              auth: { ...state.auth, user: userData as AuthUser },
            }));
          } else {
            console.log("Token geçersiz, logout yapılıyor");
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