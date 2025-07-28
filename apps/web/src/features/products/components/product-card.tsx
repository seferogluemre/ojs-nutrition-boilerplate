import { cn } from "#lib/utils";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { Product } from "../data/mock-products";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Half star (if needed)
    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-3 h-3 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }
    
    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />
      );
    }
    
    return stars;
  };

  return (
    <Link 
      to="/products/$productId" 
      params={{ productId: product.id }}
      className="block"
    >
      <div 
        className={cn(
          "bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden border border-gray-100 dark:border-gray-700",
          // Responsive heights - matching görsel design  
          "w-full max-w-[280px] h-[420px] flex flex-col",
          className
        )}
      >
        {/* Discount Badge */}
        {product.discountPercentage && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10 shadow-md">
            %{product.discountPercentage}
          </div>
        )}
        
        {/* Product Image - Taking more space */}
        <div className="h-[180px] w-full overflow-hidden rounded-t-lg flex-shrink-0 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
          <img 
            src={product.image || "/images/collagen.jpg"} 
            alt={product.name}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300 p-2"
          />
        </div>
        
        {/* Product Info */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-gray-800">
          <div>
            {/* Product Name - Bold and prominent */}
            <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
              {product.name}
            </h3>
              
            {/* Short Description */}
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3 min-h-[2rem]">
              {product.shortDescription}
            </p>
          </div>
          
          {/* Bottom section with rating and price */}
          <div className="mt-auto">
            {/* Rating & Reviews */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                {product.reviewCount} Yorum
              </span>
            </div>
            
            {/* Price Section - Prominent */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                {product.price} TL
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {product.oldPrice} TL
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}; 