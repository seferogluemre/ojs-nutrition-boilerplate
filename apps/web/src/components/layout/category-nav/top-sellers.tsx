import { SafeImage } from "#components/ui/safe-image.js";
import React from "react";

interface Product {
  id: string;
  name: string;
  description?: string;
  picture_src?: string;
}

interface TopSellersProps {
  topSellers?: Product[];
  onProductClick: (productId: string) => void;
}

export const TopSellers: React.FC<TopSellersProps> = ({ 
  topSellers, 
  onProductClick 
}) => {
  if (!topSellers || topSellers.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-5 text-gray-900 border-b border-gray-200 pb-2">
        EN ÇOK SATANLAR
      </h3>
      <div className="space-y-3">
        {topSellers.map((product, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm border border-transparent hover:border-gray-200"
            onClick={() => onProductClick(product.id)}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
              <SafeImage 
                src={product.picture_src ? `/images/${product.picture_src}` : product.picture_src}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};