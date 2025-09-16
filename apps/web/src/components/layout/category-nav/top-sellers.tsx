import { SafeImage } from "#components/ui/safe-image.js";
import { api } from "#lib/api.js";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import React from "react";

// API'den gelen Product type'ını kullan
interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  short_explanation: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  primaryPhotoUrl: string;
  averageRating: number;
  comment_count: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  stock: number;
  isActive: boolean;
}

export const PopularProductsDropdown: React.FC = () => {
  const navigate = useNavigate();

  // Protein kategorisindeki ürünleri çek
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await (api as any).categories.get();
      return response.data;
    },
  });

  // Protein kategorisinin ID'sini bul
  const proteinCategory = categoriesData?.data?.find(
    (cat: any) => cat.name === "PROTEİN" || cat.name.toLowerCase().includes("protein")
  );

  // Protein kategorisindeki popüler ürünleri çek
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["popular-protein-products", proteinCategory?.id],
    queryFn: async () => {
      const response = await (api as any).products.get({
        query: { 
          main_category: proteinCategory?.id,
          limit: 6 // İlk 6 ürünü al
        },
      });
      return response.data;
    },
    enabled: !!proteinCategory?.id, // Protein kategorisi bulunduğunda çalıştır
  });

  const popularProducts: ApiProduct[] = productsData?.data || [];

  const handleProductClick = (productId: string, slug: string) => {
    navigate({ to: `/products/${productId}` });
  };

  // Scroll olaylarını handle et - dropdown kapanmasını engellemek için
  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation(); // Parent'a scroll event'i göndermemek için
  };

  return (
    <div 
      className="w-full h-[70vh] flex flex-col bg-white"
      onWheel={handleWheel}
    >
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Popüler Ürünler</h3>
            <p className="text-xs text-gray-500">
              {isLoading ? 'Yükleniyor...' : `${popularProducts.length} ürün`}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Product List */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent hover:scrollbar-track-orange-100">
        <div className="space-y-2">
          {/* Loading State */}
          {isLoading && (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-3 p-3">
                  <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product List */}
          {!isLoading && popularProducts.map((product: ApiProduct) => (
            <div 
              key={product.id} 
              className="group flex items-center space-x-3 p-3 hover:bg-orange-50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-orange-200 hover:shadow-sm"
              onClick={() => handleProductClick(product.id, product.slug)}
            >
              {/* Product Image */}
              <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex-shrink-0 overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                <SafeImage 
                  src={product.primaryPhotoUrl || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate group-hover:text-orange-600 transition-colors mb-1">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-500 truncate mb-2">
                  {product.short_explanation || product.shortDescription}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {/* Rating Stars */}
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">₺{product.price.toFixed(0)}</p>
                    <p className="text-xs text-orange-500 font-medium">{product.category.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {!isLoading && popularProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm">Protein ürünleri yükleniyor...</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Footer with Brand Info */}
      <div className="flex-shrink-0 px-3 py-2 bg-gradient-to-r from-orange-50 to-red-50 border-t border-orange-200">
        <p className="text-xs text-orange-600 text-center font-medium">
          🔥 En Çok Tercih Edilen Ürünler
        </p>
      </div>
    </div>
  );
};