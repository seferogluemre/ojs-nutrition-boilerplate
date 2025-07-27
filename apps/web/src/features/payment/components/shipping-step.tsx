"use client"

import { Button } from "#/components/ui/button"
import { MapPin } from "lucide-react"

interface ShippingStepProps {
  onNext: () => void
  onPrev: () => void
  selectedAddress: any
  shippingCost: number
  setShippingCost: (cost: number) => void
}

export const ShippingStep = ({ onNext, onPrev, selectedAddress, shippingCost, setShippingCost }: ShippingStepProps) => {
  const shippingOptions = [
    { id: 1, name: "Standart Kargo", duration: "2-3 iş günü", price: 0 },
    { id: 2, name: "Hızlı Kargo", duration: "1 iş günü", price: 15 },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Teslimat Adresi</h3>

        {selectedAddress && (
          <div className="flex items-start space-x-3 p-4 bg-white rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <div className="font-medium">{selectedAddress.type}</div>
              <p className="text-sm text-gray-600 mt-1">{selectedAddress.fullAddress}</p>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="font-medium mb-3">Kargo Seçenekleri</h4>
          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setShippingCost(option.price)}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                  shippingCost === option.price
                    ? "bg-black text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="font-medium">{option.name}</div>
                  <div className={`text-sm ${shippingCost === option.price ? "text-gray-300" : "text-gray-600"}`}>
                    {option.duration}
                  </div>
                </div>
                <div className="font-medium">{option.price === 0 ? "Ücretsiz" : `${option.price} TL`}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onPrev} className="flex-1 bg-white">
            Geri
          </Button>
          <Button onClick={onNext} className="flex-1 bg-black hover:bg-gray-800">
            Ödemeye Geç
          </Button>
        </div>
      </div>
    </div>
  )
}