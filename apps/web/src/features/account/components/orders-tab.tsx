import { api } from "#lib/api.js";
import { useAuthStore } from "#stores/authStore.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { OrderDetail } from "./order/order-detail";

interface OrderFromAPI {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  itemCount: number;
  createdAt: string;
  firstProduct: {
    name: string;
    primary_photo_url: string;
  } | null;
  productDisplayText: string;
}

export function OrdersTab() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { auth } = useAuthStore();

  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("orderId");
      setSelectedOrderId(orderId);
    };

    checkUrlParams();

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", checkUrlParams);
    return () => window.removeEventListener("popstate", checkUrlParams);
  }, []);

  // Function to navigate to order detail
  const handleViewOrderDetail = (orderId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("orderId", orderId);
    window.history.pushState({}, "", url.toString());
    setSelectedOrderId(orderId);
  };

  // Function to go back to orders list
  const handleBackToOrders = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("orderId");
    window.history.pushState({}, "", url.toString());
    setSelectedOrderId(null);
  };

  // API call for orders list
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await api.orders.get({
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
        },
      });

      return response.data;
    },
    enabled: !!auth?.accessToken,
  });

  const orders =
    (ordersData as OrderFromAPI[])?.map((order: OrderFromAPI) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      productName: order.productDisplayText,
      orderDate: new Date(order.createdAt).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      status:
        order.status === "PENDING"
          ? "Sipariş Alındı"
          : order.status === "PROCESSING"
            ? "Hazırlanıyor"
            : order.status === "SHIPPED"
              ? "Kargoya Verildi"
              : order.status === "DELIVERED"
                ? "Teslim Edildi"
                : order.status,
      statusColor:
        order.status === "DELIVERED"
          ? "text-green-600 bg-green-50"
          : order.status === "SHIPPED"
            ? "text-blue-600 bg-blue-50"
            : order.status === "PROCESSING"
              ? "text-yellow-600 bg-yellow-50"
              : "text-gray-600 bg-gray-50",
      image: order.firstProduct?.primary_photo_url
        ? `/api/media/${order.firstProduct.primary_photo_url}`
        : "/icons/placeholder.webp",
    })) || [];

  if (selectedOrderId) {
    return (
      <OrderDetail orderId={selectedOrderId} onBack={handleBackToOrders} />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h3 className="mb-6 text-xl font-semibold text-gray-900">
          Siparişlerim (0)
        </h3>

        <div className="py-12 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <h4 className="mb-2 text-lg font-medium text-gray-900">
            Henüz siparişiniz yok
          </h4>
          <p className="mb-6 text-gray-600">
            Verdiğiniz siparişler burada görünecek
          </p>

          <button className="rounded-md bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700">
            Alışverişe Başla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-6 text-xl font-semibold text-gray-900">
        Siparişlerim ({orders.length})
      </h3>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            {/* Desktop Layout */}
            <div className="hidden items-center justify-between sm:flex">
              {/* Sol taraf - Görsel ve Bilgiler */}
              <div className="flex items-center space-x-4">
                {/* Ürün Görseli */}
                <div className="flex-shrink-0">
                  <img
                    src={order.image}
                    alt={order.productName}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                </div>

                {/* Sipariş Bilgileri */}
                <div className="flex-1">
                  {/* Sipariş Durumu */}
                  <div className="mb-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Ürün Adı */}
                  <h4 className="mb-1 text-sm font-medium text-gray-900">
                    {order.productName}
                  </h4>

                  {/* Tarih ve Sipariş No */}
                  <p className="text-sm text-gray-600">
                    {order.orderDate} Tarihinde Sipariş Verildi
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.orderNumber} numaralı sipariş
                  </p>
                </div>
              </div>

              {/* Sağ taraf - Detay Butonu */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleViewOrderDetail(order.id)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Detayını Görüntüle
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
              {/* Üst kısım - Görsel ve Durum */}
              <div className="mb-3 flex items-start space-x-3">
                {/* Ürün Görseli */}
                <div className="flex-shrink-0">
                  <img
                    src={order.image}
                    alt={order.productName}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                </div>

                {/* Sipariş Durumu ve Ürün Adı */}
                <div className="min-w-0 flex-1">
                  {/* Sipariş Durumu */}
                  <div className="mb-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Ürün Adı */}
                  <h4 className="mb-1 line-clamp-2 text-sm font-medium text-gray-900">
                    {order.productName}
                  </h4>
                </div>
              </div>

              {/* Alt kısım - Tarih ve Sipariş No */}
              <div className="mb-4 space-y-1">
                <p className="text-xs text-gray-600">
                  {order.orderDate} Tarihinde Sipariş Verildi
                </p>
                <p className="text-xs text-gray-600">
                  {order.orderNumber} numaralı sipariş
                </p>
              </div>

              {/* Detay Butonu - Full Width */}
              <button
                onClick={() => handleViewOrderDetail(order.id)}
                className="w-full rounded-md border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Detayını Görüntüle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
