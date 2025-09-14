"use client"

import { Button } from "#/components/ui/button";
import { Address } from "#/features/account/addresses/address-card";
import { MapPin, Phone, User } from "lucide-react";

interface ShippingStepProps {
  onNext: () => void
  onPrev: () => void
  selectedAddress: Address | null
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
      <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Teslimat Bilgileri</h3>

        {selectedAddress ? (
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-4 border border-gray-200 dark:border-neutral-800">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{selectedAddress.title}</span>
                  {selectedAddress.isDefault && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Varsayılan
                    </span>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{selectedAddress.recipientName}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{selectedAddress.phone}</span>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedAddress.addressLine1}
                      {selectedAddress.addressLine2 && `, ${selectedAddress.addressLine2}`}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedAddress.city.stateName} - {selectedAddress.city.name}, {selectedAddress.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 border border-gray-200 dark:border-neutral-800 text-center">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">Teslimat adresi seçilmedi</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Lütfen bir önceki adımdan adres seçin</p>
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
                    : "bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800"
                }`}
              >
                <div>
                  <div className="font-medium">{option.name}</div>
                  <div className={`text-sm ${shippingCost === option.price ? "text-gray-300" : "text-gray-600 dark:text-gray-400"}`}>
                    {option.duration}
                  </div>
                </div>
                <div className="font-medium">{option.price === 0 ? "Ücretsiz" : `${option.price} TL`}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onPrev} className="flex-1 bg-white dark:bg-neutral-900 dark:text-gray-100 dark:border-neutral-800">
            Geri
          </Button>
          <Button 
            onClick={onNext} 
            className="flex-1 bg-black hover:bg-gray-800"
            disabled={!selectedAddress}
          >
            Ödemeye Geç
          </Button>
        </div>
      </div>
    </div>
  )
}