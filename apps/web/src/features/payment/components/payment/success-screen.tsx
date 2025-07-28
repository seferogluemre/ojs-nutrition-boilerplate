"use client"

import { Button } from "#/components/ui/button"
import { ArrowRight, CheckCircle, Package } from "lucide-react"

interface SuccessScreenProps {
  showContent: boolean
  orderNumber: string
  onContinueToOrders: () => void
}

export function SuccessScreen({ showContent, orderNumber, onContinueToOrders }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
      {/* Success Icon with Animation */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600 animate-pulse" />
        </div>

        {/* Subtle Ring Animation */}
        <div className="absolute inset-0 w-20 h-20 border-2 border-green-200 rounded-full animate-ping opacity-20"></div>
      </div>

      {/* Content with Fade In */}
      <div
        className={`text-center space-y-4 transition-all duration-700 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-2xl font-semibold text-gray-900">Siparişiniz Oluşturuldu!</h2>

        <div className="space-y-2">
          <p className="text-gray-600">Siparişiniz başarıyla alındı.</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Package className="h-4 w-4" />
            <span>Sipariş No: #{orderNumber}</span>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Button onClick={onContinueToOrders} className="bg-black hover:bg-gray-800 px-6">
            Siparişlerim
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <div className="text-xs text-gray-500">Sipariş detayları e-posta adresinize gönderildi.</div>
        </div>
      </div>
    </div>
  )
}