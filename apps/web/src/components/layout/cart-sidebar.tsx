import { Button } from "#components/ui/button";
import { api } from "#lib/api.js";
import { cn, formatPrice } from "#lib/utils";
import { useAuthStore } from "#stores/authStore.js";
import { useCartStore } from "#stores/cartStore.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import React, { useEffect } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const auth = useAuthStore();  
  const { 
    items: cartItems, 
    setItems, 
    clearCart, 
    optimisticUpdateQuantity,
    removeItem: removeItemFromStore,
    revertOptimisticUpdate 
  } = useCartStore();
  const router = useRouter();

  const { data: cartData } = useQuery({
    queryKey: ["cart-items"],
    queryFn: async () => {
      if (!auth.accessToken) return { items: [] };

      const response = await api["cart-items"].get({
        headers: {
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
      return response.data;
    },
    enabled: !!auth.accessToken,
  });

  useEffect(() => {
    if (cartData?.items) {
      setItems(cartData.items);
    } else if (!auth.accessToken) {
      clearCart();
    }
  }, [cartData, auth.accessToken, setItems, clearCart]);

  const addItemMutation = useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity,
    }: {
      productId: string;
      variantId: string;
      quantity: number;
    }) => {
      const data = {
        product_id: productId,
        product_variant_id: variantId,
        quantity,
      };

      return await api["cart-items"].post(data, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${auth.accessToken}`,
        },
      });
    },
    onSuccess: (response) => {
      // Optimistic update başarılı oldu, backend response ile senkronize et
      if (response.data?.items) {
        setItems(response.data.items);
      }
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return await api["cart-items"]({ itemId }).delete(
        {},
        {
          headers: {
            authorization: `Bearer ${auth.accessToken}`,
          },
        },
      );
    },
    onSuccess: (response) => {
      // Optimistic update başarılı oldu, backend response ile senkronize et
      if (response.data?.items) {
        setItems(response.data.items);
      }
    },
  });

  const getItemPrice = (item: any) => {
    // Variant price'ı kullan (discounted_price varsa onu, yoksa total_price)
    return item.variant?.price?.discounted_price || 
           item.variant?.price?.total_price || 
           item.product.price;
  };

  const totalAmount = cartItems.reduce((total: number, item: any) => {
    const itemPrice = getItemPrice(item);
    return total + itemPrice * item.quantity;
  }, 0);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const increaseQuantity = async (item: any) => {
    // Önce optimistic update yap (anlık UI güncellemesi)
    const previousItems = [...cartItems];
    optimisticUpdateQuantity(item.id, 1);

    try {
      // Backend'e sadece +1 artış gönder
      await addItemMutation.mutateAsync({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: 1,
      });
    } catch (error) {
      // Hata durumunda eski haline döndür
      revertOptimisticUpdate(previousItems);
      console.error('Adet artırılırken hata oluştu:', error);
    }
  };

  const decreaseQuantity = async (item: any) => {
    if (item.quantity <= 1) return;

    // Önce optimistic update yap (anlık UI güncellemesi)
    const previousItems = [...cartItems];
    const updatedItem = optimisticUpdateQuantity(item.id, -1);
    
    if (!updatedItem) return;

    try {
      // Direkt API call yap (mutation callback'lerini bypass et)
      await api["cart-items"]({ itemId: item.id }).delete(
        {},
        {
          headers: {
            authorization: `Bearer ${auth.accessToken}`,
          },
        },
      );
      
      await api["cart-items"].post(
        {
          product_id: item.product.id,
          product_variant_id: item.variant.id,
          quantity: updatedItem.quantity,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${auth.accessToken}`,
          },
        },
      );
    } catch (error) {
      // Hata durumunda eski haline döndür
      revertOptimisticUpdate(previousItems);
      console.error('Adet azaltılırken hata oluştu:', error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    // Önce optimistic update yap (anlık UI güncellemesi)
    const previousItems = [...cartItems];
    removeItemFromStore(id);

    try {
      await removeItemMutation.mutateAsync(id);
    } catch (error) {
      // Hata durumunda eski haline döndür
      revertOptimisticUpdate(previousItems);
      console.error('Ürün silinirken hata oluştu:', error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-96 transform bg-white shadow-xl transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="text-lg font-bold text-gray-900">SEPETİM</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Content */}
        <div className="flex h-full flex-col">
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4">
            {cartItems.length === 0 ? (
              <div className="flex h-[400px] flex-col items-center justify-center text-center">
                {/* Simple Cart Icon */}
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <ShoppingCart className="h-8 w-8 text-gray-400" />
                </div>

                {/* Simple Text */}
                <div className="mb-8 space-y-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    Sepetiniz Boş
                  </h3>
                  <p className="max-w-xs text-sm text-gray-600">
                    Sepetinizde henüz ürün bulunmuyor.
                  </p>
                </div>

                {/* Simple Button */}
                <Button className="bg-black hover:bg-gray-800">
                  Alışverişe Başla
                </Button>
              </div>
            ) : (
              cartItems.map((item: any) => (
                <div
                  key={item.id}
                  className="mb-3 flex items-start space-x-3 rounded-lg bg-gray-50 p-3"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gray-200">
                      {item.product.primary_photo_url &&
                      item.product.primary_photo_url !== "null" ? (
                        <img
                          src={item.product.primary_photo_url}
                          alt={item.product.name}
                          className="h-full w-full rounded-md object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {item.variant.name}
                        </p>
                        <div className="text-xs text-gray-500">
                          {item.variant?.price?.discounted_price ? (
                            <>
                              <span className="line-through text-gray-400">
                                Birim: {formatPrice(item.variant.price.total_price)}
                              </span>
                              <br />
                              <span className="text-green-600 font-medium">
                                Birim: {formatPrice(item.variant.price.discounted_price)} 
                                {item.variant.price.discount_percentage && (
                                  <span className="ml-1">(%{item.variant.price.discount_percentage} indirim)</span>
                                )}
                              </span>
                            </>
                          ) : (
                            <span>Birim: {formatPrice(getItemPrice(item))}</span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {formatPrice(getItemPrice(item) * item.quantity)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-end">
                      <div className="flex items-center space-x-2">
                        {/* Sol taraf: çöp kutusu (adet=1) veya minus (adet>1) */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            item.quantity === 1
                              ? handleRemoveItem(item.id)
                              : decreaseQuantity(item)
                          }
                          className="h-7 w-7 p-1"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 className="h-3 w-3" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </Button>

                        <span className="px-2 text-sm font-medium">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => increaseQuantity(item)}
                          className="h-7 w-7 p-1"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto space-y-3 border-t p-4 pb-20">
            {/* Total */}
            <div className="text-center">
              <p className="text-end text-lg font-bold text-gray-900">
                TOPLAM {formatPrice(totalAmount)}
              </p>
            </div>

            {/* Continue Button */}
            <Button
              className="w-full bg-black py-3 text-base font-semibold text-white hover:bg-gray-800"
              onClick={() => {
                router.navigate({
                  to: "/payment",
                });
              }}
              disabled={cartItems.length === 0}
            >
              DEVAM ET ▶
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
