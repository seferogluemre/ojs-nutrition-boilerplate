import { SearchProps } from "#types/search.js";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import React from "react";

interface SearchDropdownProps {
    items: SearchProps[];
    isLoading: boolean;
    isOpen: boolean;
    onItemClick: () => void;
    onClose: () => void;
}

export const SearchDropdown = React.forwardRef<HTMLDivElement, SearchDropdownProps>(({ items, isLoading, isOpen, onItemClick, onClose }, ref) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-md shadow-lg z-[9999] max-h-96 overflow-y-auto" ref={ref}>

            {
                isLoading ? (
                    <div className="flex items-center justify-center p-3">
                        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                        <span className="ml-2 text-gray-500">Aranıyor....</span>
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        Sonuç Bulunamadı |:
                    </div>
                ) : (
                    <div className="py-2">
                        {
                            items.map((product) => (
                                <Link 
                                    key={product.id} 
                                    to="/products/$productId" 
                                    params={{ productId: product.id }} 
                                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={(e) => {
                                        // Navigation'ı engellemeden önce dropdown'ı kapat
                                        setTimeout(() => {
                                            onItemClick();
                                        }, 100);
                                    }}
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.primaryPhotoUrl || "/images/collagen.jpg"}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded"

                                        />
                                    </div>

                                    <div className="flex-1 ml-3">
                                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-gray-500">{product.slug}</p>
                                    </div>

                                    {/* Price Info */}
                                    <div className="text-right flex-shrink-0">
                                        <div className="font-bold text-gray-900 text-sm">
                                            {product.price} TL
                                        </div>
                                        {product.oldPrice && (
                                            <div className="text-xs text-gray-500 line-through">
                                                {product.oldPrice} TL
                                            </div>
                                        )}
                                        {product.discountPercentage && (
                                            <div className="text-xs text-red-500 font-medium">
                                                %{product.discountPercentage} İndirim
                                            </div>
                                        )}
                                    </div>

                                </Link>
                            ))
                        }
                    </div>
                )
            }

        </div>
    )
})