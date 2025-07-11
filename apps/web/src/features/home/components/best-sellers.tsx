import { cn } from "#lib/utils";
import { Star } from "lucide-react";
import React from "react";

interface BestSellersProps extends React.HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
}

const bestSellerProducts = [
  {
    id: 1,
    name: "WHEY PROTEIN",
    description: "EN ÇOK TERCİH EDİLEN PROTEIN TAKVİYESİ",
    image: "/images/collagen.jpg",
    rating: 5,
    reviewCount: 10869,
    price: 549,
    originalPrice: null,
    discountPercentage: null
  },
  {
    id: 2,
    name: "FITNESS PAKETİ",
    description: "EN POPÜLER ÜRÜNLER BİR ARADA",
    image: "/images/collagen.jpg",
    rating: 5,
    reviewCount: 7650,
    price: 799,
    originalPrice: 1126,
    discountPercentage: 29
  },
  {
    id: 3,
    name: "GÜNLÜK VİTAMİN PAKETİ",
    description: "EN SİK TÜKETİLEN TAKVİYELER",
    image: "/images/collagen.jpg",
    rating: 5,
    reviewCount: 5013,
    price: 549,
    originalPrice: 717,
    discountPercentage: 23
  },
  {
    id: 4,
    name: "PRE-WORKOUT SUPREME",
    description: "ANTİDOPİNG ÖNCESİ TAKVİYESİ",
    image: "/images/collagen.jpg",
    rating: 5,
    reviewCount: 6738,
    price: 399,
    originalPrice: null,
    discountPercentage: null
  },
  {
    id: 5,
    name: "CREAM OF RICE",
    description: "EN LEZZETLİ PİRİNÇ KREMASI",
    image: "/images/collagen.jpg",
    rating: 5,
    reviewCount: 5216,
    price: 239,
    originalPrice: null,
    discountPercentage: null
  },
  {
    id: 6,
    name: "CREATINE",
    description: "EN POPÜLER SPORCU TAKVİYESİ",
    image: "/images/collagen.jpg",
    rating: 5,
    reviewCount: 8558,
    price: 239,
    originalPrice: null,
    discountPercentage: null
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export const BestSellers = ({
  className,
  ...props
}: BestSellersProps) => {
  return (
    <section
      className={cn(
        "py-12 bg-gray-50",
        className,
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 mb-8">
          ÇOK SATANLAR
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 justify-items-center max-w-7xl mx-auto">
          {bestSellerProducts.map((product) => (
            <div
              key={product.id}
              className="relative w-[200px] h-[365px] bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
              {/* Discount Badge */}
              {product.discountPercentage && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
                  %{product.discountPercentage} İNDİRİM
                </div>
              )}

              {/* Product Image */}
              <div className="w-full flex justify-center pt-4">
                <div className="w-[168px] h-[168px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 pt-3">
                {/* Product Name */}
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-tight">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-600 mb-2 leading-tight">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-1">
                  <StarRating rating={product.rating} />
                </div>

                {/* Review Count */}
                <p className="text-xs text-gray-500 mb-3">
                  {product.reviewCount} Yorum
                </p>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                  {product.originalPrice ? (
                    <>
                      <span className="text-lg font-bold text-gray-900">
                        {product.price} TL
                      </span>
                      <span className="text-sm text-red-500 line-through">
                        {product.originalPrice} TL
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {product.price} TL
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

BestSellers.displayName = "BestSellers"; 