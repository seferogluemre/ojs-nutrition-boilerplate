import { Button } from "#components/ui/button";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Product, ProductVariant } from "../../types";

interface ProductPricingProps {
  product: Product;
  selectedSize: ProductVariant | null;
  quantity: number;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
}

export function ProductPricing({ 
  product, 
  selectedSize, 
  quantity, 
  onQuantityIncrease, 
  onQuantityDecrease 
}: ProductPricingProps) {
  const getCurrentPrice = () => {
    return selectedSize?.price?.discounted_price || selectedSize?.price?.total_price || product.price;
  };

  const getOldPrice = () => {
    return selectedSize?.price?.discounted_price ? selectedSize?.price?.total_price : null;
  };

  const getServingPrice = () => {
    const price = getCurrentPrice();
    const servings = selectedSize?.size?.total_services || 16;
    return (price / servings).toFixed(2);
  };

  return (
    <div className="bg-white p-3 rounded-lg border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-bold text-gray-900">
          {getCurrentPrice()} TL
          {getOldPrice() && (
            <span className="text-lg text-gray-500 line-through ml-3">
              {getOldPrice()} TL
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Servis başına</div>
          <div className="text-lg font-semibold text-gray-900">
            {getServingPrice()} TL
          </div>
        </div>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={onQuantityDecrease}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 py-2 font-semibold min-w-[50px] text-center">
            {quantity}
          </span>
          <button
            onClick={onQuantityIncrease}
            className="p-2 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button className="flex-1 bg-black hover:bg-gray-800 text-white py-3 px-6 text-lg font-semibold">
          <ShoppingCart className="w-5 h-5 mr-2" />
          SEPETE EKLE
        </Button>
      </div>
    </div>
  );
} 