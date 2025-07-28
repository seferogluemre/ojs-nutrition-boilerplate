import { OrderSidebarProps } from "../types";


export function OrderSidebar({ order }: OrderSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h5 className="font-semibold text-gray-900 mb-3">Adres</h5>
        <div className="space-y-2">
          <p className="font-medium text-gray-900">{order.address.name}</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {order.address.fullAddress}
          </p>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h5 className="font-semibold text-gray-900 mb-3">Ödeme</h5>
        <div className="space-y-2">
          <p className="text-sm text-gray-900">{order.payment.method}</p>
          <p className="text-sm text-gray-600">{order.payment.cardNumber}</p>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h5 className="font-semibold text-gray-900 mb-3">Özet</h5>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ara Toplam</span>
            <span className="text-gray-900">{order.payment.summary.subtotal}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Kargo</span>
            <span className="text-gray-900">{order.payment.summary.shipping}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Toplam Vergi</span>
            <span className="text-gray-900">{order.payment.summary.tax}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Yüzde 10 indirimi</span>
            <span className="text-green-600">{order.payment.summary.discount}</span>
          </div>
          
          <hr className="border-gray-200" />
          
          <div className="flex justify-between font-semibold">
            <span className="text-gray-900">Toplam</span>
            <span className="text-gray-900">{order.payment.summary.total}</span>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h6 className="font-medium text-gray-900 mb-2">Yardıma mı İhtiyacın var?</h6>
        <div className="space-y-2 text-sm">
          <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
            Sıkça Sorulan Sorular
          </a>
          <a href="#" className="block text-blue-600 hover:text-blue-800 transition-colors">
            Satış Sözleşmesi
          </a>
        </div>
      </div>
    </div>
  );
} 