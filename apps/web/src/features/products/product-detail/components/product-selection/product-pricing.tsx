import { Button } from "#components/ui/button";
import { toast } from "#hooks/use-toast.js";
import { api } from "#lib/api.js";
import { formatPrice } from "#lib/utils";
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
    onError: (error: any) => {
      
      let errorMessage = "Ürün sepete eklenirken bir hata oluştu.";
      
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Hata ❌", 
        description: errorMessage,
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

  const getCurrentStock = () => {
    // Önce seçilen variant'ın stok bilgisini al, yoksa product'ın genel stok bilgisini kullan
    return product.stock || 0;
  };

  const isStockLimitReached = () => {
    const currentStock = getCurrentStock();
    return quantity >= currentStock;
  };

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

    // Önce selectedFlavor'ı kullan, yoksa selectedSize'ı kullan
    // Ama ikisi de varsa selectedFlavor öncelikli olsun
    let variantId: string;
    
    if (selectedFlavor && selectedSize) {
      // Eğer her ikisi de seçili ise, flavor'ı tercih et
      variantId = selectedFlavor.id;
    } else if (selectedFlavor) {
      variantId = selectedFlavor.id;
    } else if (selectedSize) {
      variantId = selectedSize.id;
    } else {
      toast({
        title: "Hata ❌",
        description: "Lütfen ürün varyantını seçin.",
      });
      return;
    }

    console.log("Sending to cart:", {
      productId: product.id,
      variantId,
      selectedFlavor: selectedFlavor?.name,
      selectedSize: selectedSize?.name,
      quantity
    });
    
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
          {formatPrice(getCurrentPrice())}
          {getOldPrice() && (
            <span className="text-lg text-gray-500 line-through ml-3">
              {formatPrice(getOldPrice()!)}
            </span>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Servis başına</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatPrice(parseFloat(getServingPrice()))}
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