import { cn } from "#lib/utils";
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
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 pb-9 cursor-pointer relative overflow-hidden",
        // Increased heights for better content display
        "w-full h-[380px] md:h-[420px] lg:h-[475px]",
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
      
      {/* Product Image */}
      <div className="h-40 md:h-48 lg:h-64 overflow-hidden rounded-t-lg">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
      
      {/* Product Info */}
      <div className="p-3 lg:p-4 flex flex-col h-[calc(100%-160px)] md:h-[calc(100%-192px)]  lg:h-[calc(100%-256px)]">
        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-sm lg:text-base mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Short Description */}
        <p className="text-xs lg:text-sm text-gray-600 mb-2 line-clamp-2">
          {product.shortDescription}
        </p>
        
        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            {product.reviewCount} Yorum
          </span>
        </div>
        
        {/* Price Section */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="font-bold text-gray-900 text-base lg:text-lg">
            {product.price} TL
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.oldPrice} TL
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 