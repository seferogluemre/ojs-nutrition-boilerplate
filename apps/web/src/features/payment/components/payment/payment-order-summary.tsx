"use client"

import { Address } from "../../types";

interface PaymentOrderSummaryProps {
  selectedAddress: Address | null;
  shippingCost: number;
}

export const PaymentOrderSummary = ({ selectedAddress, shippingCost }: PaymentOrderSummaryProps) => {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg">
      <h4 className="font-medium mb-2">Sipariş Özeti</h4>
      <div className="text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Teslimat Adresi:</span>
          <span>{selectedAddress?.title || "Adres seçilmedi"}</span>
        </div>
        {selectedAddress && (
          <div className="text-xs text-gray-500 mt-1">
            {selectedAddress.recipientName} - {selectedAddress.addressLine1}
            {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
          </div>
        )}
        <div className="flex justify-between mt-2">
          <span>Kargo:</span>
          <span>{shippingCost === 0 ? "Ücretsiz" : `${shippingCost} TL`}</span>
        </div>
        <div className="flex justify-between mt-1 font-medium text-black">
          <span>Toplam:</span>
          <span>{(1556 + shippingCost).toLocaleString()} TL</span>
        </div>
      </div>
    </div>
  )
} 