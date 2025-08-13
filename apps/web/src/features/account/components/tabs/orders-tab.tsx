import { api } from "#lib/api.js";
import { getOrderStatus } from "#lib/utils";
import { useAuthStore } from "#stores/authStore.js";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { OrderDetail } from "../../orders/order-detail/order-detail";
import { OrderFromAPI } from "../../types";

export function OrdersTab() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [highlightOrderNumber, setHighlightOrderNumber] = useState<string | null>(null);
  const { auth } = useAuthStore();

  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("orderId");
      const orderNumber = urlParams.get("orderNumber");
      setSelectedOrderId(orderId);
      setHighlightOrderNumber(orderNumber);
    };

    checkUrlParams();

    window.addEventListener("popstate", checkUrlParams);
    return () => window.removeEventListener("popstate", checkUrlParams);
  }, []);

  const handleViewOrderDetail = (orderId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("orderId", orderId);
    window.history.pushState({}, "", url.toString());
    setSelectedOrderId(orderId);
  };

  const handleBackToOrders = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("orderId");
    window.history.pushState({}, "", url.toString());
    setSelectedOrderId(null);
  };


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
    (ordersData as OrderFromAPI[])?.map((order: OrderFromAPI) => {
      const orderStatus = getOrderStatus(order.status);
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        productName: order.productDisplayText,
        orderDate: new Date(order.createdAt).toLocaleDateString("tr-TR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        status: orderStatus.text,
        statusColor: orderStatus.colorClass,
        image: order.firstProduct?.primary_photo_url
          ? `/api/media/${order.firstProduct.primary_photo_url}`
          : "/icons/placeholder.webp",
      };
    }) || [];

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
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
          >
            <div className="hidden items-center justify-between sm:flex">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img
                    src={"/images/collagen.jpg"}
                    alt={order.productName}
                    className="h-20 w-20 rounded-xl object-cover ring-2 ring-gray-100"
                  />
                </div>

                {/* Sipariş Bilgileri */}
                <div className="flex-1">
                  {/* Sipariş Durumu */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ${order.statusColor}`}
                    >
                      <div className="mr-2 h-2 w-2 rounded-full bg-current opacity-75"></div>
                      {order.status}
                    </span>
                  </div>

                  <h4 className="mb-2 text-lg font-semibold text-gray-900">
                    {order.productName}
                  </h4>

                  {/* Tarih ve Sipariş No */}
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {order.orderDate} tarihinde sipariş verildi
                    </p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="mr-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h4a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1h4a1 1 0 011 1v3z" />
                      </svg>
                      Sipariş No: <span className="font-medium">{order.orderNumber}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Sağ taraf - Detay Butonu */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => handleViewOrderDetail(order.id)}
                  className="inline-flex items-center rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Detayını Görüntüle
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
              {/* Üst kısım - Görsel ve Durum */}
              <div className="mb-4 flex items-start space-x-4">
                {/* Ürün Görseli */}
                <div className="flex-shrink-0">
                  <img
                    src={order.image}
                    alt={order.productName}
                    className="h-16 w-16 rounded-lg object-cover ring-2 ring-gray-100"
                  />
                </div>

                {/* Sipariş Durumu ve Ürün Adı */}
                <div className="min-w-0 flex-1">
                  {/* Sipariş Durumu */}
                  <div className="mb-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${order.statusColor}`}
                    >
                      <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-75"></div>
                      {order.status}
                    </span>
                  </div>

                  {/* Ürün Adı */}
                  <h4 className="mb-1 line-clamp-2 text-base font-semibold text-gray-900">
                    {order.productName}
                  </h4>
                </div>
              </div>

              {/* Alt kısım - Tarih ve Sipariş No */}
              <div className="mb-5 space-y-2 rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600 flex items-center">
                  <svg className="mr-1.5 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {order.orderDate} tarihinde sipariş verildi
                </p>
                <p className="text-xs text-gray-600 flex items-center">
                  <svg className="mr-1.5 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h4a1 1 0 011 1v18a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1h4a1 1 0 011 1v3z" />
                  </svg>
                  Sipariş No: <span className="font-medium">{order.orderNumber}</span>
                </p>
              </div>

              {/* Detay Butonu - Full Width */}
              <button
                onClick={() => handleViewOrderDetail(order.id)}
                className="w-full inline-flex items-center justify-center rounded-lg bg-gray-900 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Detayını Görüntüle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}