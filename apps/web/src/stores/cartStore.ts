import { create } from "zustand";

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
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],

  setItems: (items) => set({ items }),

  clearCart: () => set({ items: [] }),
}));
