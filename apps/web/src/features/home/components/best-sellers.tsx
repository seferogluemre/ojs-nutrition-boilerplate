import { api } from "#lib/api.js";
import { cn } from "#lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import React from "react";
import { BestSellerProduct } from "../types/index";

interface BestSellersProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export const BestSellers = ({ className, ...props }: BestSellersProps) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () => api.products["best-sellers"].get(),
  });

  return (
    <section className={cn("py-12 bg-white dark:bg-[#010819]", className)} {...props}>
      <div className="container mx-auto px-4">


        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6">
          {data?.data?.slice(0, 6).map((product: BestSellerProduct,index:number) => (
            <Link
              key={index}
              to="/products/$productId" 
              params={{ productId: product.id }}
              className="relative w-full max-w-[200px] mx-auto cursor-pointer rounded-lg bg-white dark:bg-gray-800 shadow-lg transition-shadow duration-300 hover:shadow-xl"
              style={{
                aspectRatio: "200/375", // Sabit aspect ratio
                minHeight: "320px",
                maxHeight: "380px"
              }}
          >
              {product.discountPercentage && (
                <div className="absolute -right-2 -top-2 z-10 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  %{product.discountPercentage} İNDİRİM
                </div>
              )}

              <div className="flex w-full justify-center">
                <div className="flex h-[168px] w-[168px] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-200">
                    <img
                      src={product.image || "/images/collagen.jpg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 pt-3">
                {/* Product Name */}
                <h3 className="mb-1 text-sm font-bold leading-tight text-gray-900 dark:text-white">
                  {product.name}
                </h3>

                <p className="mb-2 text-xs leading-tight text-gray-600 dark:text-gray-300">
                  {product.short_explanation}
                </p>

                {/* Rating */}
                <div className="mb-1 flex items-center">
                  <StarRating rating={product.rating} />
                </div>

                {/* Review Count */}
                <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                  {product.comment_count} Yorum
                </p>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  {product.price_info ? (
                    <>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {product.price_info.total_price} TL
                      </span>
                      <span className="text-sm text-red-500 dark:text-red-400 line-through">
                        {product.price_info.price_per_servings} TL
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {product.total_price} TL
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

BestSellers.displayName = "BestSellers";
