import { api } from "#lib/api.js";
import { useAuthStore } from "#stores/authStore.js";
import { useQuery } from "@tanstack/react-query";
import { CartData, CartItem, OrderSummaryProps } from "../types";

export const OrderSummary = ({ shippingCost }: OrderSummaryProps) => {
  const auth = useAuthStore();

  const { data: cartData } = useQuery<CartData>({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const response = await api["cart-items"].get({
        headers: {
          authorization: `Bearer ${auth.auth.accessToken}`,
        },
      });
      return response.data;
    },
  });
  if (!cartData) {
    return (
      <div className="sticky top-4 rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 text-lg font-medium">Sipariş Özeti</h3>
        <div className="animate-pulse">
          <div className="mb-4 h-4 rounded bg-gray-200"></div>
          <div className="mb-4 h-4 rounded bg-gray-200"></div>
          <div className="h-4 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const itemsData =
    cartData.items?.map((item: CartItem) => ({
      id: item.id,
      name: item.product.name,
      variant: item.variant.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.primary_photo_url || "/images/collagen.jpg",
    })) || [];

  const subtotal = cartData.summary?.subtotal
    ? cartData.summary.subtotal / 100
    : 0;
  const total = subtotal + shippingCost;

  return (
    <div className="sticky top-4 rounded-lg bg-gray-50 p-6">
      <h3 className="mb-4 text-lg font-medium">Sipariş Özeti</h3>

      <div className="space-y-4">
        {itemsData.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <img
              src={item.image || "/images/collagen.jpg"}
              alt={item.name}
              className="h-12 w-12 rounded-lg bg-blue-100 object-cover"
              onError={(e: any) => {
                e.target.src = "/images/collagen.jpg";
              }}
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium">{item.name}</h4>
              <p className="text-xs text-gray-600">{item.variant}</p>
              <p className="text-xs text-blue-600">Adet: {item.quantity}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {(item.price / 100).toFixed(2)} TL
              </div>
              <div className="text-xs text-gray-500">
                Toplam: {((item.price * item.quantity) / 100).toFixed(2)} TL
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam</span>
              <span>{subtotal.toLocaleString()} TL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Kargo</span>
              <span>
                {shippingCost === 0 ? "Ücretsiz" : `${shippingCost} TL`}
              </span>
            </div>
          </div>

          <div className="mt-2 border-t border-gray-200 pt-2">
            <div className="flex justify-between font-semibold">
              <span>Toplam</span>
              <span>{total.toLocaleString()} TL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
