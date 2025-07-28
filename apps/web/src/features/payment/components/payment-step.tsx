"use client"

import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { CreditCard } from "lucide-react"
import { useState } from "react"
import { PaymentStepProps } from "../types"

export const PaymentStep = ({
  onPrev,
  selectedAddress,
  shippingCost,
  isProcessing,
  setIsProcessing,
}: PaymentStepProps) => {
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    cardType: "",
  })

  const handleCardNumberChange = (value: string) => {
    // Format card number and detect card type
    const formatted = value
      .replace(/\s/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim()
    let cardType = ""

    if (value.startsWith("4")) {
      cardType = "visa"
    } else if (value.startsWith("5") || value.startsWith("2")) {
      cardType = "mastercard"
    }

    setCardData({ ...cardData, number: formatted, cardType })
  }

  const handleCompleteOrder = async () => {
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    console.log("Order completed")
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900">Ödeme Gerçekleştiriliyor...</h3>
        <p className="text-sm text-gray-600 mt-2">Lütfen bekleyiniz</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Adım göstergesini kaldır */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Kart Bilgileri</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="cardNumber">Kart Numarası</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                value={cardData.number}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {cardData.cardType === "visa" && <div className="text-blue-600 font-bold text-sm">VISA</div>}
                {cardData.cardType === "mastercard" && <div className="text-red-600 font-bold text-sm">MC</div>}
                {!cardData.cardType && <CreditCard className="w-5 h-5 text-gray-400" />}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
            <Input
              id="cardName"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
              placeholder="İSİM SOYİSİM"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Son Kullanma Tarihi</Label>
              <Input
                id="expiry"
                value={cardData.expiry}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "")
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + "/" + value.substring(2, 4)
                  }
                  setCardData({ ...cardData, expiry: value })
                }}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                value={cardData.cvc}
                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, "") })}
                placeholder="123"
                maxLength={3}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg">
          <h4 className="font-medium mb-2">Sipariş Özeti</h4>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Teslimat Adresi:</span>
              <span>{selectedAddress?.type}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Kargo:</span>
              <span>{shippingCost === 0 ? "Ücretsiz" : `${shippingCost} TL`}</span>
            </div>
            <div className="flex justify-between mt-1 font-medium text-black">
              <span>Toplam:</span>
              <span>{(1556 + shippingCost).toLocaleString()} TL</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button variant="outline" onClick={onPrev} className="flex-1 bg-white">
            Geri
          </Button>
          <Button onClick={handleCompleteOrder} className="flex-1 bg-black hover:bg-gray-800">
            Siparişi Tamamla
          </Button>
        </div>
      </div>
    </div>
  )
}
