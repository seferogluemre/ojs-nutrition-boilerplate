import { Main } from "#components/layout/main";
import { BestSellers } from "#features/home/components/best-sellers.js";
import { useRecentlyViewed } from "#hooks";
import { api } from "#lib/api.js";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Product, ProductVariant } from "../types";
import {
  ProductBenefits,
  ProductDetails,
  ProductImage,
  ProductInfo,
  ProductPricing,
  ProductReviews,
  ProductTags,
  ProductVariants,
  RecentlyViewedProducts,
} from "./components";

export default function ProductDetail() {
  const { productId } = useParams({ from: "/(public)/products/$productId" });
  const { addToRecentlyViewed } = useRecentlyViewed();

  const { data } = useQuery({
    queryKey: ["products", productId],
    queryFn:  () => api.products[productId].get()
  });

  const product = data?.data as Product;
  const [selectedFlavor, setSelectedFlavor] = useState<ProductVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product);
      window.scrollTo(0, 0);
    }
  }, [product, addToRecentlyViewed]);

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (!product) {
    return (
      <Main>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
            <p className="text-gray-600">Aradığınız ürün mevcut değil.</p>
          </div>
        </div>
      </Main>
    );
  }


  return (
    <Main>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <ProductImage 
            photos={product.photos}
            primaryPhotoUrl={product.primaryPhotoUrl}
            alt={product.name}
            selectedVariant={selectedFlavor || selectedSize}
          />

          {/* Right Column - Product Info */}
          <div className="flex flex-col space-y-4">
            <ProductInfo
              name={product.name}
              shortExplanation={product.short_explanation}
              averageRating={product.averageRating}
              commentCount={product.comment_count}
            />

            <ProductTags tags={product.tags} />

            <hr className="border-gray-200 dark:border-gray-700" />

            <ProductVariants
              variants={product.variants}
              selectedFlavor={selectedFlavor}
              selectedSize={selectedSize}
              onFlavorSelect={setSelectedFlavor}
              onSizeSelect={setSelectedSize}
            />

            <ProductPricing
              product={product}
              selectedSize={selectedSize}
              selectedFlavor={selectedFlavor}
              quantity={quantity}
              onQuantityIncrease={increaseQuantity}
              onQuantityDecrease={decreaseQuantity}
            />

            <ProductBenefits />

            <ProductDetails explanation={product.explanation} />
          </div>
        </div>
      </div>

      {/* Recently Viewed Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <RecentlyViewedProducts />
      </div>

      {/* Product Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductReviews productId={productId} />
      </div>

      {/* Best Sellers Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BestSellers />
      </div>
    </Main>
  );
} 