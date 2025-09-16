import type { Category } from "#components/layout/mobile-sidebar/types";
import { useRouter } from "@tanstack/react-router";
import React, { useCallback, useEffect, useRef } from "react";
import { CategoryList } from "./category-list";
import { PopularProductsDropdown } from "./top-sellers";

interface CategoryDropdownProps {
  category: Category;
  isVisible: boolean;
  onClose: () => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ 
  category, 
  isVisible, 
  onClose 
}) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!isVisible) return null;

  const handleProductClick = (productId: string) => {
    router.navigate({ to: `/products/${productId}` });
    onClose();
  };

  const handleMouseEnter = useCallback(() => {
    // Mouse dropdown'ın içine girdiğinde timeout'u temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Mouse dropdown'dan ayrıldığında kısa bir delay ile kapat
    timeoutRef.current = setTimeout(() => {
      onClose();
    }, 300); // 300ms delay - biraz daha uzun
  }, [onClose]);

  // Scroll içinde mouse wheel olaylarını handle et
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation(); // Event propagation'u durdur
    // Scroll'u dropdown içinde tut, kapanmasına neden olmasın
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Full Screen Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-200"
        onClick={onClose}
        style={{ top: '100px' }} // Category nav'ın altından başlasın
      />
      
      {/* Safe hover zone between nav and dropdown */}
      <div 
        className="absolute top-full z-[-1] left-0 right-0 h-4 bg-transparent  opacity-0 pointer-events-auto"
        onMouseEnter={() => {/* Keep dropdown open */}}
      />
      
      {/* Dropdown Content - Responsive & Scrollable */}
      <div 
        ref={dropdownRef}
        className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-xl shadow-2xl z-50 mt-4 w-[90vw] max-w-[900px] min-w-[600px] max-h-[70vh] overflow-hidden transition-all duration-300"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onWheel={handleWheel}
      >
        <div className="flex h-full">
          {/* Sol kısım - Popular Products - Fixed Width */}
          <div className="flex-shrink-0 w-80 border-r border-gray-200">
            <PopularProductsDropdown />
          </div>

          {/* Sağ kısım - Alt Kategoriler - Scrollable */}
          <div className="flex-1 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-track-gray-100">
            <div className="p-6">
              <CategoryList 
                children={category.children} 
                onProductClick={handleProductClick}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};