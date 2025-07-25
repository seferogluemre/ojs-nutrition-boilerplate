import Cookies from "js-cookie";
import { create } from "zustand";

const ACCESS_TOKEN = "Iyc0kTb8t3anRpXTjx3O9BE9psC3Lg8g.zEAppO4pKTqZgKYhRi%2F%2FJwDEdApXRb7jq7KSLHHPK4Q%3D";

interface AuthUser {
  accountNo: string;
  email: string;
  name: string; // Bu satırı ekle
  role: string[];
  exp: number;
}

interface AuthState {
  auth: {
    user: AuthUser | null;
    setUser: (user: AuthUser | null) => void;
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    resetAccessToken: () => void;
    reset: () => void;
    logout: () => void; // Bu satırı ekle
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN);
  const initToken = cookieState ? JSON.parse(cookieState) : "";
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken));
          return { ...state, auth: { ...state.auth, accessToken } };
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN);
          return { ...state, auth: { ...state.auth, accessToken: "" } };
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: "" },
          };
        }),
      // Bu logout fonksiyonunu ekle
      logout: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN);
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: "" },
          };
        }),
    },
  };
});

// export const useAuth = () => useAuthStore((state) => state.auth)