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
          "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer relative overflow-hidden",
          // Flexible height instead of fixed heights
          "w-full min-h-[350px] flex flex-col md:h-[420px]",
          className
        )}
      >
        {/* Discount Badge - Half outside the card */}
        {product.discountPercentage && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
            %{product.discountPercentage}
            <div className="text-[10px] font-normal">İNDİRİM</div>
          </div>
        )}
        
        {/* Product Image - Fixed aspect ratio */}
        <div className="aspect-square w-full overflow-hidden rounded-t-lg flex-shrink-0">
          <img 
            src={product.image || "/images/collagen.jpg"} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        {/* Product Info - Flexible content area */}
        <div className="p-2 lg:p-3 flex flex-col flex-1 gap-1">
          {/* Product Name */}
          <h3 className="font-bold text-gray-900 text-xs lg:text-sm leading-tight line-clamp-2">
            {product.name}
          </h3>
            
          {/* Short Description */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
            {product.shortDescription}
          </p>
          
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center gap-0.5">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {product.reviewCount} Yorum
            </span>
          </div>
          
          {/* Price Section */}
          <div className="flex items-center gap-2 mt-auto pt-1">
            <span className="font-bold text-gray-900 text-sm lg:text-base">
              {product.price} TL
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}; 