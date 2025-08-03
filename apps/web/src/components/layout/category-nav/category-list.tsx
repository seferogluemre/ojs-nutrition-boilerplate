import type { Category } from "#components/layout/mobile-sidebar/types";
import React from "react";

interface Product {
  id: string;
  name: string;
  price?: number;
}

interface CategoryChild extends Category {
  sub_children?: Array<{ id: string; name: string; order: number }>;
  products?: Product[];
}

interface CategoryListProps {
  children?: CategoryChild[];
  onProductClick: (productId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  children, 
  onProductClick 
}) => {
  if (!children || children.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold mb-5 text-gray-900 border-b border-gray-200 pb-2">
          KATEGORİLER
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-500 text-sm">
            Bu kategori için alt kategoriler bulunamadı.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-5 text-gray-900 border-b border-gray-200 pb-2">
        KATEGORİLER
      </h3>
      <div className="space-y-4">
        {children.map((child) => (
          <div key={child.id}>
            <h4 className="font-semibold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
              {child.name}
            </h4>
            
            {/* Sub_children varsa onları göster */}
            {child.sub_children && child.sub_children.length > 0 && (
              <ul className="space-y-1 ml-4">
                {child.sub_children.map((subChild, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors block py-1.5 px-2 rounded cursor-pointer hover:bg-gray-50"
                      onClick={(e) => {
                        e.preventDefault();
                        onProductClick(subChild.id);
                      }}
                    >
                      {subChild.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            
            {/* Sub_children yoksa products'ı göster */}
            {(!child.sub_children || child.sub_children.length === 0) && 
             child.products && child.products.length > 0 && (
              <ul className="space-y-1 ml-4">
                {child.products.map((product, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-sm text-gray-600 hover:text-blue-600 transition-colors py-1.5 px-2 rounded cursor-pointer hover:bg-gray-50 flex items-center space-x-2"
                      onClick={(e) => {
                        e.preventDefault();
                        onProductClick(product.id);
                      }}
                    >
                      <span>{product.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};