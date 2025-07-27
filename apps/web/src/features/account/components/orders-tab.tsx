import { OrderDetail } from '@/components/order';
import { useEffect, useState } from 'react';

export function OrdersTab() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Check URL params on component mount and when URL changes
  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get('orderId');
      setSelectedOrderId(orderId);
    };

    checkUrlParams();
    
    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', checkUrlParams);
    return () => window.removeEventListener('popstate', checkUrlParams);
  }, []);

  // Function to navigate to order detail
  const handleViewOrderDetail = (orderId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('orderId', orderId);
    window.history.pushState({}, '', url.toString());
    setSelectedOrderId(orderId);
  };

  // Function to go back to orders list
  const handleBackToOrders = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('orderId');
    window.history.pushState({}, '', url.toString());
    setSelectedOrderId(null);
  };

  // Mock data for orders
  const orders = [
    {
      id: 1,
      orderNumber: "427795",
      productName: "DEEP SLEEP",
      orderDate: "31 Mart 2023",
      status: "Teslim Edildi",
      statusColor: "text-green-600 bg-green-50",
      image: "/icons/ahududu.webp"
    },
    {
      id: 2,
      orderNumber: "290405",
      productName: "MELATONIN - GÜNLÜK VİTAMİN PAKETİ - BROMELAIN",
      orderDate: "14 Aralık 2022",
      status: "Teslim Edildi",
      statusColor: "text-green-600 bg-green-50",
      image: "/icons/aromasız.webp"
    },
    {
      id: 3,
      orderNumber: "255564",
      productName: "GAMER HACK - DETOX PAKETİ",
      orderDate: "19 Kasım 2022",
      status: "Teslim Edildi",
      statusColor: "text-green-600 bg-green-50",
      image: "/icons/bisküvi.webp"
    },
    {
      id: 4,
      orderNumber: "190462",
      productName: "CREAM OF RICE",
      orderDate: "1 Ekim 2022",
      status: "Teslim Edildi",
      statusColor: "text-green-600 bg-green-50",
      image: "/icons/çikolata.webp"
    }
  ];

  // Show order detail if orderId exists in URL
  if (selectedOrderId) {
    return (
      <OrderDetail 
        orderId={selectedOrderId} 
        onBack={handleBackToOrders} 
      />
    );
  }

  // Show orders list
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Siparişlerim ({orders.length})</h3>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              {/* Sol taraf - Görsel ve Bilgiler */}
              <div className="flex items-center space-x-4">
                {/* Ürün Görseli */}
                <div className="flex-shrink-0">
                  <img 
                    src={order.image} 
                    alt={order.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
                
                {/* Sipariş Bilgileri */}
                <div className="flex-1">
                  {/* Sipariş Durumu */}
                  <div className="mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Ürün Adı */}
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
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
                  onClick={() => handleViewOrderDetail(order.orderNumber)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Detayını Görüntüle
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="sm:hidden">
              {/* Üst kısım - Görsel ve Durum */}
              <div className="flex items-start space-x-3 mb-3">
                {/* Ürün Görseli */}
                <div className="flex-shrink-0">
                  <img 
                    src={order.image} 
                    alt={order.productName}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                </div>
                
                {/* Sipariş Durumu ve Ürün Adı */}
                <div className="flex-1 min-w-0">
                  {/* Sipariş Durumu */}
                  <div className="mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  {/* Ürün Adı */}
                  <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
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
                onClick={() => handleViewOrderDetail(order.orderNumber)}
                className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-md text-sm font-medium transition-colors"
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