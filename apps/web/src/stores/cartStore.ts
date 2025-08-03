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
  updateItemQuantity: (itemId: string, newQuantity: number) => void;
  removeItem: (itemId: string) => void;
  optimisticUpdateQuantity: (itemId: string, quantityChange: number) => CartItem | null;
  revertOptimisticUpdate: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],

  setItems: (items) => set({ items }),

  clearCart: () => set({ items: [] }),

  updateItemQuantity: (itemId: string, newQuantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    })),

  removeItem: (itemId: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),

  optimisticUpdateQuantity: (itemId: string, quantityChange: number) => {
    const currentItems = get().items;
    const item = currentItems.find((item) => item.id === itemId);
    
    if (!item) return null;
    
    const newQuantity = Math.max(0, item.quantity + quantityChange);
    
    if (newQuantity === 0) {
      set((state) => ({
        items: state.items.filter((item) => item.id !== itemId),
      }));
    } else {
      set((state) => ({
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ),
      }));
    }
    
    return { ...item, quantity: newQuantity };
  },

  revertOptimisticUpdate: (items: CartItem[]) => set({ items }),
}));
