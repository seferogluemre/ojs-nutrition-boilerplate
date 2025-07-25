import { Button } from "#components/ui/button";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { useAuthStore } from "#stores/authStore.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Product, ProductVariant } from "../../types";

interface ProductPricingProps {
  product: Product;
  selectedSize: ProductVariant | null;
  selectedFlavor: ProductVariant | null;
  quantity: number;
  onQuantityIncrease: () => void;
  onQuantityDecrease: () => void;
}

export function ProductPricing({ 
  product, 
  selectedSize, 
  selectedFlavor,
  quantity, 
  onQuantityIncrease, 
  onQuantityDecrease 
}: ProductPricingProps) {
  const { auth } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, variantId, quantity }: { productId: string; variantId: string; quantity: number }) => {
      return await api["cart-items"].post({
        product_id: productId,
        product_variant_id: variantId,
        quantity,
      }, {
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      toast({
        title: "Başarılı ✅",
        description: "Ürün sepete eklendi!",
      });
    },
    onError: () => {
      toast({
        title: "Hata ❌", 
        description: "Ürün sepete eklenirken bir hata oluştu.",
      });
    },
  });

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

  // Stok kontrolü fonksiyonları
  const getCurrentStock = () => {
    // Önce seçilen variant'ın stok bilgisini al, yoksa product'ın genel stok bilgisini kullan
    return product.stock || 0;
  };

  const isStockLimitReached = () => {
    const currentStock = getCurrentStock();
    return quantity >= currentStock;
  };

  // Override quantity increase with stock control
  const handleQuantityIncrease = () => {
    const currentStock = getCurrentStock();
    
    if (quantity >= currentStock) {
      toast({
        title: "Stok Sınırı ⚠️",
        description: `Stok değerinden fazla eklenemez. Mevcut stok: ${currentStock}`,
      });
      return;
    }
    
    onQuantityIncrease();
  };

  const handleAddToCart = async () => {
    if (!selectedFlavor) {
      toast({
        title: "Hata ❌",
        description: "Lütfen bir aroma seçin.",
      });
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Hata ❌",
        description: "Lütfen bir boyut seçin.",
      });
      return;
    }

    const variantId = selectedFlavor?.id || selectedSize?.id;
    
    addToCartMutation.mutate({
      productId: product.id,
      variantId,
      quantity,
    });
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
        <div className="flex flex-col">
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
              onClick={handleQuantityIncrease}
              className={`p-2 transition-colors ${
                isStockLimitReached() 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-gray-100'
              }`}
              disabled={isStockLimitReached()}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Stock info */}
          <div className="text-xs text-gray-500 mt-1 text-center">
            Stok: {getCurrentStock()}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button className="flex-1 bg-black hover:bg-gray-800 text-white py-3 px-6 text-lg font-semibold" onClick={handleAddToCart}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          SEPETE EKLE
        </Button>
      </div>
    </div>
  );
} 