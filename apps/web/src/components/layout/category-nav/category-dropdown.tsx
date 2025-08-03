import type { Category } from "#components/layout/mobile-sidebar/types";
import { useRouter } from "@tanstack/react-router";
import React, { useRef } from "react";
import { CategoryList } from "./category-list";
import { TopSellers } from "./top-sellers";

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

  if (!isVisible) return null;

  const handleProductClick = (productId: string) => {
    router.navigate({ to: `/products/${productId}` });
    onClose();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dropdownRef.current) return;
    
    const rect = dropdownRef.current.getBoundingClientRect();
    const mouseY = e.clientY;
    const dropdownBottom = rect.bottom;
    
    // Kutunun altına 20px yaklaşınca kapat
    if (mouseY > dropdownBottom + 20) {
      onClose();
    }
  };

  return (
    <>
      {/* Full Screen Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-30 transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Safe hover zone between nav and dropdown */}
      <div 
        className="absolute top-full left-0 right-0 h-4 bg-transparent z-40"
        onMouseEnter={() => {/* Keep dropdown open */}}
      />
      
      {/* Dropdown Content */}
      <div 
        ref={dropdownRef}
        className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-xl shadow-2xl z-50 mt-4 w-[750px] overflow-hidden transition-all duration-300"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {/* Keep dropdown open */}}
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sol kısım - Top Sellers */}
            <TopSellers 
              topSellers={category.top_sellers} 
              onProductClick={handleProductClick}
            />

            {/* Sağ kısım - Alt Kategoriler */}
            <CategoryList 
              children={category.children} 
              onProductClick={handleProductClick}
            />
          </div>
        </div>
      </div>
    </>
  );
};