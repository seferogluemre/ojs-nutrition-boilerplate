import { useCallback, useEffect, useState } from 'react';
import type { Product } from '../features/products/data/mock-products';

const RECENTLY_VIEWED_KEY = 'recentlyViewedProducts';
const MAX_RECENTLY_VIEWED = 12; // En fazla 12 ürün saklayacağız

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // localStorage'dan veriyi oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
        if (stored) {
          const products = JSON.parse(stored) as Product[];
          setRecentlyViewed(products);
        }
      } catch (error) {
        console.error('Error loading recently viewed products:', error);
      }
    }
  }, []);

  // Yeni ürün ekle
  const addToRecentlyViewed = useCallback((product: Product) => {
    if (typeof window === 'undefined') return;

    try {
      setRecentlyViewed(prevProducts => {
        // Eğer ürün zaten listede varsa, onu kaldır
        const filteredProducts = prevProducts.filter(p => p.id !== product.id);
        
        // Yeni ürünü listenin başına ekle
        const newProducts = [product, ...filteredProducts];
        
        // Maksimum sayıyı aşmasın
        const trimmedProducts = newProducts.slice(0, MAX_RECENTLY_VIEWED);
        
        // localStorage'a kaydet
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(trimmedProducts));
        
        return trimmedProducts;
      });
    } catch (error) {
      console.error('Error saving recently viewed product:', error);
    }
  }, []);

  // Belirli bir ürünü kaldır
  const removeFromRecentlyViewed = useCallback((productId: string) => {
    if (typeof window === 'undefined') return;

    try {
      setRecentlyViewed(prevProducts => {
        const filteredProducts = prevProducts.filter(p => p.id !== productId);
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(filteredProducts));
        return filteredProducts;
      });
    } catch (error) {
      console.error('Error removing recently viewed product:', error);
    }
  }, []);

  // Tüm listeyi temizle
  const clearRecentlyViewed = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      setRecentlyViewed([]);
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
    } catch (error) {
      console.error('Error clearing recently viewed products:', error);
    }
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    removeFromRecentlyViewed,
    clearRecentlyViewed,
  };
} 