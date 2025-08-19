import { api } from "#lib/api.js";
import { formatPrice, getOrderStatus } from "#lib/utils";
import { useAuthStore } from "#stores/authStore.js";
import { useQuery } from "@tanstack/react-query";
import { OrderDetailAPI } from "../../types";
import CargoTrackingButton from "./components/cargo-tracking-button";
import { OrderSidebar } from "./order-sidebar";
import { OrderSummary } from "./order-summary";

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

export function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const  auth  = useAuthStore();

  const {
    data: orderData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: async () => {
      const response = await api.orders({ id: orderId }).get({
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
        },
      });
      return response.data as OrderDetailAPI;
    },
    enabled: !!auth?.accessToken && !!orderId,
  });

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center">
          <button
            onClick={onBack}
            className="mr-4 flex items-center text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg
              className="mr-1 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Geri
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            Sipariş Detayı
          </h3>
        </div>

        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div>
        <div className="mb-6 flex items-center">
          <button
            onClick={onBack}
            className="mr-4 flex items-center text-gray-600 transition-colors hover:text-gray-900"
          >
            <svg
              className="mr-1 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Geri
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            Sipariş Detayı
          </h3>
        </div>

        <div className="py-20 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="mb-2 text-lg font-medium text-gray-900">
            Sipariş bulunamadı
          </h4>
          <p className="text-gray-600">
            Bu sipariş mevcut değil veya erişim izniniz yok.
          </p>
        </div>
      </div>
    );
  }

  const orderDetail = {
    id: orderData.id,
    orderNumber: orderData.orderNumber,
    status: getOrderStatus(orderData.status).text,
    deliveryDate: new Date(orderData.createdAt).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    products: orderData.items.map((item) => ({
      id: item.id,
      name: `${item.product.name}`,
      price: formatPrice(item.totalPrice / 100),
      size: `Boyut: ${item.quantity} ADET`,
      image: item.product.primary_photo_url
        ? `/api/media/${item.product.primary_photo_url}`
        : "/icons/placeholder.webp",
      productId: item.product.id,
    })),
    address: {
      name: orderData.shippingAddress.recipientName,
      fullAddress: `${orderData.shippingAddress.addressLine1}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state}, ${orderData.shippingAddress.country}`,
    },
    payment: {
      method: "Kredi Kartı",
      cardNumber: "**** **** **** ****",
      summary: {
        subtotal: formatPrice(orderData.subtotal / 100),
        shipping: "0,00 TL",
        tax: "0,00 TL",
        discount: "0,00 TL",
        total: formatPrice(orderData.subtotal / 100),
      },
    },
  };

  return (
    <div>
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="mr-4 flex items-center text-gray-600 transition-colors hover:text-gray-900"
        >
          <svg
            className="mr-1 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Geri
        </button>
        <h3 className="text-xl font-semibold text-gray-900">Sipariş Detayı</h3>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left side - Order summary */}
        <div className="lg:col-span-2">
          <OrderSummary order={orderDetail} />
        </div>

        {/* Right side - Address and payment info */}
        <div className="lg:col-span-1">
          <OrderSidebar order={orderDetail} />
        </div>

        <div className="lg:col-span-1">
          <CargoTrackingButton />
        </div>

      </div>
    </div>
  );
}
