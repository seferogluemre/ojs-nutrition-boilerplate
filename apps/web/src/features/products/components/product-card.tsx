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
        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />,
      );
    }

    // Half star (if needed)
    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-3 w-3 fill-yellow-400 text-yellow-400 opacity-50"
        />,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />);
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
          "relative cursor-pointer overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800",
          "max-w-auto flex h-[420px] w-full flex-col ",
          className,
        )}
      >
        {product.discountPercentage && (
          <div className="absolute right-2 top-2 z-10 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-md">
            %{product.discountPercentage}
          </div>
        )}

        <div className="m-0 flex h-[180px] w-full flex-shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-gray-50 dark:bg-gray-700">
          <img
            src={product.photo_src}
            className="m-0 h-full w-full object-cover p-0 transition-transform duration-300 hover:scale-100"
          />
        </div>

        <div className="flex flex-1  flex-col justify-between bg-white pb-20 pt-2 px-2  dark:bg-gray-800">
          <div>
            <h3 className=" line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-tight text-gray-900 dark:text-white">
              {product.name}
            </h3>

            {/* Short Description */}
            <p className="mb-3 line-clamp-2 min-h-[2rem] text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              {product.shortDescription}
            </p>
          </div>

          {/* Bottom section with rating and price */}
          <div className="mt-auto">
            {/* Rating & Reviews */}
            <div className="mb-2 flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                {product.reviewCount} Yorum
              </span>
            </div>

            {/* Price Section - Prominent */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {product.price} TL
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-500 line-through dark:text-gray-400">
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
