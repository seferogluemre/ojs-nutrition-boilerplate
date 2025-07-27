import { OrderSidebar } from './order-sidebar';
import { OrderSummary } from './order-summary';

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

export function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  // Mock data for order detail
  const orderDetail = {
    id: orderId,
    orderNumber: "290405",
    status: "Sipariş Teslim Edildi",
    deliveryDate: "14 Aralık 2022",
    products: [
      {
        id: 1,
        name: "MELATONIN x 2",
        price: "62 TL",
        size: "Boyut: 1 KUTU",
        image: "/icons/aromasız.webp"
      },
      {
        id: 2,
        name: "GÜNLÜK VİTAMİN PAKETİ x 1",
        price: "449 TL",
        size: "Boyut: 1 Paket x 2 Adet",
        image: "/icons/bisküvi.webp"
      },
      {
        id: 3,
        name: "BROMELAIN x 1",
        price: "197 TL",
        size: "Boyut: 1 KUTU x 2 Adet",
        image: "/icons/çikolata.webp"
      }
    ],
    address: {
      name: "Uğur İLTER",
      fullAddress: "Barbaros, Nidakule Ataşehir Batı, Begonya Sk. No: 1/2, 34746 Ataşehir/İstanbul"
    },
    payment: {
      method: "Kredi Kartı - 770 TL",
      cardNumber: "**** **** **** **61",
      summary: {
        subtotal: "856 TL",
        shipping: "0 TL",
        tax: "8 TL",
        discount: "- 86 TL",
        total: "770 TL"
      }
    }
  };

  return (
    <div>
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Geri
        </button>
        <h3 className="text-xl font-semibold text-gray-900">Sipariş Detayı</h3>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side - Order summary */}
        <div className="lg:col-span-2">
          <OrderSummary order={orderDetail} />
        </div>
        
        {/* Right side - Address and payment info */}
        <div className="lg:col-span-1">
          <OrderSidebar order={orderDetail} />
        </div>
      </div>
    </div>
  );
} 