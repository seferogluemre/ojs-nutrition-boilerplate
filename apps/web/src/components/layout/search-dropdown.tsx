import { SearchProps } from "#types/search.js";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React from "react";

interface SearchDropdownProps {
  items: SearchProps[];
  isLoading: boolean;
  isOpen: boolean;
  onItemClick: () => void;
  onClose: () => void;
}

export const SearchDropdown = React.forwardRef<
  HTMLDivElement,
  SearchDropdownProps
>(({ items, isLoading, isOpen, onItemClick, onClose }, ref) => {
  const navigate = useNavigate();

  const handleProductClick = (productId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    onItemClick();
    
    navigate({ to: `/products/${productId}` });
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute left-0 right-0 top-full z-[9999] mt-1 max-h-96 overflow-y-auto rounded-md border border-gray-100 bg-white shadow-lg"
      ref={ref}
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-3">
          <Loader2 className="h-5 w-5 animate-spin text-red-500" />
          <span className="ml-2 text-gray-500">Aranıyor....</span>
        </div>
      ) : items.length === 0 ? (
        <div className="p-4 text-center text-gray-500">Sonuç Bulunamadı |:</div>
      ) : (
        <div className="py-2">
          {items.map((product) => (
            <div
              key={product.id}
              className="flex cursor-pointer items-center border-b border-gray-100 p-3 last:border-b-0 hover:bg-gray-100 transition-colors duration-200"
              onClick={(event) => handleProductClick(product.id, event)}
              style={{ 
                pointerEvents: 'auto',
                zIndex: 999,
                position: 'relative'
              }}
            >
              <div className="flex-shrink-0">
                <img
                  src={product.primaryPhotoUrl || "/images/collagen.jpg"}
                  alt={product.name}
                  className="h-12 w-12 rounded object-cover"
                />
              </div>

              <div className="ml-3 flex-1">
                <h4 className="line-clamp-1 text-sm font-medium text-gray-900">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500">{product.slug}</p>
              </div>

              {/* Price Info */}
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-bold text-gray-900">
                  ₺{product.price.toFixed(0)}
                </div>
                {product.oldPrice && (
                  <div className="text-xs text-gray-500 line-through">
                    ₺{product.oldPrice}
                  </div>
                )}
                {product.discountPercentage && (
                  <div className="text-xs font-medium text-red-500">
                    %{product.discountPercentage} İndirim
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
