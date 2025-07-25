import { create } from "zustand";
import { useAuthStore } from "./authStore";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    primary_photo_url: string | null;
  };
  variant: {
    id: string;
    name: string;
  };
  added_at: string;
}

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  fetchCartItems: () => Promise<void>;
  clearCart: () => void;
}
const token=useAuthStore.getState().auth.accessToken;

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  
  setItems: (items) => set({ items }),
  
  fetchCartItems: async () => {
    try {
      const response = await fetch("http://localhost:3000/api/cart-items", {
        credentials: 'include',
        headers: {
          "Authorization": `onlyjs-session-token=${token}`
        }
      });
      console.log("response",response)
      if (response.ok) {
        const result = await response.json() as any;
        console.log("Cart items loaded:", result.items || []);
        set({ items: result.items || [] });
      } else {
        console.log("Cart fetch failed, clearing items");
        set({ items: [] });
      }
    } catch (error) {
      console.error("Cart fetch failed:", error);
      set({ items: [] });
    }
  },
  
  clearCart: () => set({ items: [] }),
}));